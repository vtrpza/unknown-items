import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/posts/[id]/comments - Get comments for a post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: postId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get top-level comments (no parent)
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
        parentId: null,
      },
      orderBy: { createdAt: 'desc' },
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
        _count: {
          select: {
            likes: true,
          },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          take: 5, // Limit initial replies
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
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
      },
    });

    const total = await prisma.comment.count({
      where: {
        postId: postId,
        parentId: null,
      },
    });

    return NextResponse.json({
      comments,
      total,
      page,
      hasMore: skip + comments.length < total,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/posts/[id]/comments - Create a new comment
const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId } = await params;
    const body = await request.json();
    const validatedData = createCommentSchema.parse(body);

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // If replying to a comment, check if parent exists
    if (validatedData.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validatedData.parentId },
        select: { id: true, postId: true },
      });

      if (!parentComment || parentComment.postId !== postId) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        authorId: session.user.id,
        postId: postId,
        parentId: validatedData.parentId,
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
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);

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
