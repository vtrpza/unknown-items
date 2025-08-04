import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/posts/[id]/bookmark - Toggle bookmark on a post
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId } = await params;
    const userId = session.user.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if already bookmarked
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    let isBookmarked: boolean;

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      isBookmarked = false;
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId,
          postId,
        },
      });
      isBookmarked = true;
    }

    // Get updated bookmark count
    const bookmarksCount = await prisma.bookmark.count({
      where: { postId },
    });

    return NextResponse.json({
      isBookmarked,
      bookmarksCount,
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
