'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  BookmarkCheck,
  Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostActionsProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export function PostActions({
  postId,
  likesCount,
  commentsCount,
  bookmarksCount,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
}: PostActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [likes, setLikes] = useState(likesCount);
  const [bookmarks, setBookmarks] = useState(bookmarksCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!session) {
      router.push('/signin');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const previousState = { isLiked, likes };

    // Optimistic update
    setIsLiked(!isLiked);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
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

  const handleBookmark = async () => {
    if (!session) {
      router.push('/signin');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const previousState = { isBookmarked, bookmarks };

    // Optimistic update
    setIsBookmarked(!isBookmarked);
    setBookmarks(prev => (isBookmarked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }

      const data = await response.json();
      setBookmarks(data.bookmarksCount);
      setIsBookmarked(data.isBookmarked);

      toast.success(
        data.isBookmarked ? 'Post bookmarked!' : 'Bookmark removed'
      );
    } catch (_error) {
      // Revert optimistic update on error
      setIsBookmarked(previousState.isBookmarked);
      setBookmarks(previousState.bookmarks);
      toast.error('Failed to update bookmark. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = () => {
    router.push(`/post/${postId}#comments`);
  };

  const handleShare = async (type: 'copy' | 'twitter' | 'facebook') => {
    const url = `${window.location.origin}/post/${postId}`;

    switch (type) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
        } catch (_error) {
          toast.error('Failed to copy link');
        }
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLoading}
          className={cn(
            'gap-2 hover:text-red-500 transition-colors',
            isLiked && 'text-red-500'
          )}
        >
          <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
          {likes > 0 && <span className="text-sm">{likes}</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleComment}
          className="gap-2 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          {commentsCount > 0 && (
            <span className="text-sm">{commentsCount}</span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          disabled={isLoading}
          className={cn(
            'gap-2 hover:text-yellow-500 transition-colors',
            isBookmarked && 'text-yellow-500'
          )}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4 fill-current" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {bookmarks > 0 && <span className="text-sm">{bookmarks}</span>}
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:text-green-500">
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleShare('copy')}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('twitter')}>
            <svg
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('facebook')}>
            <svg
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Share on Facebook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
