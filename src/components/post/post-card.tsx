'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Eye,
  Clock,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { PostActions } from './post-actions';
import { MediaCarousel } from './media-carousel';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  mysteryStatus: string;
  views: number;
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
    comments: number;
    bookmarks: number;
  };
  media: Array<{
    id: string;
    url: string;
    type: string;
    thumbnailUrl?: string;
  }>;
}

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
}

const STATUS_CONFIG = {
  UNSOLVED: { icon: HelpCircle, color: 'bg-red-500', text: 'Unsolved' },
  PARTIALLY_SOLVED: {
    icon: AlertTriangle,
    color: 'bg-yellow-500',
    text: 'Partially Solved',
  },
  SOLVED: { icon: CheckCircle, color: 'bg-green-500', text: 'Solved' },
  DEBUNKED: { icon: X, color: 'bg-gray-500', text: 'Debunked' },
};

const CATEGORY_LABELS = {
  UNKNOWN_FACTS: 'Unknown Facts',
  INTERNET_MYSTERIES: 'Internet Mysteries',
  UNIDENTIFIED_OBJECTS: 'Unidentified Objects',
  UNEXPLAINED_EVENTS: 'Unexplained Events',
  HISTORICAL_MYSTERIES: 'Historical Mysteries',
  SCIENTIFIC_ANOMALIES: 'Scientific Anomalies',
  CRYPTIDS: 'Cryptids',
  CONSPIRACIES: 'Conspiracies',
  OTHER: 'Other',
};

export function PostCard({ post, showFullContent = false }: PostCardProps) {
  const statusConfig =
    STATUS_CONFIG[post.mysteryStatus as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig.icon;
  const categoryLabel =
    CATEGORY_LABELS[post.category as keyof typeof CATEGORY_LABELS] ||
    post.category;

  const displayName = post.author.profile?.displayName || post.author.username;
  const avatar = post.author.profile?.avatar;

  // Truncate content if not showing full content
  const displayContent = showFullContent
    ? post.content
    : post.content.length > 300
      ? post.content.substring(0, 300) + '...'
      : post.content;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={displayName} />
              <AvatarFallback>
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link
                href={`/profile/${post.author.username}`}
                className="font-semibold hover:underline"
              >
                {displayName}
              </Link>
              <span className="text-sm text-muted-foreground">
                @{post.author.username}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {categoryLabel}
            </Badge>
            <Badge className={cn('text-xs text-white', statusConfig.color)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.text}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Link href={`/post/${post.id}`}>
            <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {displayContent}
          </p>
          {!showFullContent && post.content.length > 300 && (
            <Link
              href={`/post/${post.id}`}
              className="text-primary hover:underline text-sm inline-block mt-2"
            >
              Read more
            </Link>
          )}
        </div>

        {post.media && post.media.length > 0 && (
          <MediaCarousel media={post.media} />
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views.toLocaleString()} views
            </div>
          </div>
        </div>

        <PostActions
          postId={post.id}
          likesCount={post._count.likes}
          commentsCount={post._count.comments}
          bookmarksCount={post._count.bookmarks}
        />
      </CardContent>
    </Card>
  );
}
