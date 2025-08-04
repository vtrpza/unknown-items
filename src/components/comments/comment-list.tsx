'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Reply, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    profile?: {
      displayName?: string;
      avatar?: string;
    };
  };
  _count: {
    likes: number;
  };
  replies?: Comment[];
}

interface CommentListProps {
  comments: Comment[];
  postId: string;
  level?: number;
}

export function CommentList({ comments, postId, level = 0 }: CommentListProps) {
  return (
    <div className={cn('space-y-4', level > 0 && 'ml-8 mt-4')}>
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          level={level}
        />
      ))}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  level: number;
}

function CommentItem({ comment, postId, level }: CommentItemProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(comment._count.likes);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayName =
    comment.author.profile?.displayName || comment.author.username;
  const avatar = comment.author.profile?.avatar;

  const handleLike = async () => {
    if (!session) {
      toast.error('Please sign in to like comments');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const previousState = { isLiked, likes };

    // Optimistic update
    setIsLiked(!isLiked);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/comments/${comment.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const data = await response.json();
      setLikes(data.likesCount);
      setIsLiked(data.isLiked);
    } catch (_error) {
      // Revert optimistic update on error
      setIsLiked(previousState.isLiked);
      setLikes(previousState.likes);
      toast.error('Failed to update like. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} alt={displayName} />
        <AvatarFallback>
          {displayName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{displayName}</span>
          <span className="text-xs text-muted-foreground">
            @{comment.author.username}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <p className="text-sm whitespace-pre-wrap mb-2">{comment.content}</p>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLoading}
            className={cn(
              'h-6 px-2 text-xs hover:text-red-500',
              isLiked && 'text-red-500'
            )}
          >
            <Heart className={cn('h-3 w-3 mr-1', isLiked && 'fill-current')} />
            {likes > 0 && likes}
          </Button>

          {level < 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-6 px-2 text-xs hover:text-blue-500"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          )}

          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>

        {showReplyForm && (
          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-2">
              Reply functionality coming soon...
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <CommentList
            comments={comment.replies}
            postId={postId}
            level={level + 1}
          />
        )}
      </div>
    </div>
  );
}
