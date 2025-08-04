import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/comments/[id]/like - Toggle like on a comment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: commentId } = await params;
    const userId = session.user.id;

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    let isLiked: boolean;

    if (existingLike) {
      // Unlike - remove the like
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });
      isLiked = false;
    } else {
      // Like - create the like
      await prisma.commentLike.create({
        data: {
          userId,
          commentId,
        },
      });
      isLiked = true;
    }

    // Get updated like count
    const likesCount = await prisma.commentLike.count({
      where: { commentId },
    });

    return NextResponse.json({
      isLiked,
      likesCount,
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
