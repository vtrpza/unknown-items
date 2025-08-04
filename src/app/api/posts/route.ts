import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Category, MysteryStatus } from '@prisma/client';

// GET /api/posts - Get posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'recent';
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const authorId = searchParams.get('authorId');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      published: boolean;
      category?: Category;
      mysteryStatus?: MysteryStatus;
      authorId?: string;
    } = {
      published: true,
    };

    if (category) {
      where.category = category as Category;
    }

    if (status) {
      where.mysteryStatus = status
        .toUpperCase()
        .replace('-', '_') as MysteryStatus;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    // Build orderBy clause
    let orderBy:
      | { createdAt: 'desc' | 'asc' }
      | Array<{
          likes?: { _count: 'desc' | 'asc' };
          views?: 'desc' | 'asc';
          createdAt?: 'desc' | 'asc';
          mysteryStatus?: 'desc' | 'asc';
        }> = { createdAt: 'desc' };

    switch (sort) {
      case 'popular':
        orderBy = [
          { likes: { _count: 'desc' } },
          { views: 'desc' },
          { createdAt: 'desc' },
        ];
        break;
      case 'unsolved':
        orderBy = [{ mysteryStatus: 'asc' }, { createdAt: 'desc' }];
        break;
      case 'recent':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profile: {
                select: {
                  displayName: true,
                  avatar: true,
                },
              },
            },
          },
          media: {
            select: {
              id: true,
              url: true,
              type: true,
              thumbnailUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              bookmarks: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    const hasMore = skip + posts.length < total;

    return NextResponse.json({
      posts,
      hasMore,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: z.enum([
    'UNKNOWN_FACTS',
    'INTERNET_MYSTERIES',
    'UNIDENTIFIED_OBJECTS',
    'UNEXPLAINED_EVENTS',
    'HISTORICAL_MYSTERIES',
    'SCIENTIFIC_ANOMALIES',
    'CRYPTIDS',
    'CONSPIRACIES',
    'OTHER',
  ]),
  contentType: z
    .enum(['TEXT', 'IMAGE', 'VIDEO', 'LINK', 'MIXED'])
    .default('TEXT'),
  tags: z.array(z.string()).optional(),
  mediaIds: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    // Start transaction
    const post = await prisma.$transaction(async tx => {
      // Create the post
      const newPost = await tx.post.create({
        data: {
          title: validatedData.title,
          content: validatedData.content,
          category: validatedData.category,
          contentType: validatedData.contentType,
          authorId: session.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profile: {
                select: {
                  displayName: true,
                  avatar: true,
                },
              },
            },
          },
          media: {
            select: {
              id: true,
              url: true,
              type: true,
              thumbnailUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              bookmarks: true,
            },
          },
        },
      });

      // Handle media attachments
      if (validatedData.mediaIds && validatedData.mediaIds.length > 0) {
        await tx.media.updateMany({
          where: {
            id: { in: validatedData.mediaIds },
            uploaderId: session.user.id,
            postId: null,
          },
          data: {
            postId: newPost.id,
          },
        });
      }

      // Handle tags
      if (validatedData.tags && validatedData.tags.length > 0) {
        for (const tagName of validatedData.tags) {
          const slug = tagName.toLowerCase().replace(/\s+/g, '-');

          // Create or find tag
          const tag = await tx.tag.upsert({
            where: { slug },
            update: {
              usageCount: { increment: 1 },
            },
            create: {
              name: tagName,
              slug,
              usageCount: 1,
            },
          });

          // Link tag to post
          await tx.postTag.create({
            data: {
              postId: newPost.id,
              tagId: tag.id,
            },
          });
        }
      }

      return newPost;
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
