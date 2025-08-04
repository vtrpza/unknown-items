'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostCard } from '@/components/post/post-card';
import { PostCardSkeleton } from '@/components/post/post-card-skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

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

interface CategoryFeedProps {
  categoryKey: string;
  sort: string;
  status?: string;
}

export function CategoryFeed({ categoryKey, sort, status }: CategoryFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadPosts = useCallback(
    async (pageNum: number, reset = false) => {
      try {
        setError(null);
        if (reset) {
          setLoading(true);
          setPosts([]);
        }

        const params = new URLSearchParams({
          category: categoryKey,
          sort,
          page: pageNum.toString(),
          limit: '10',
        });

        if (status) {
          params.set('status', status);
        }

        const response = await fetch(`/api/posts?${params}`);
        if (!response.ok) {
          throw new Error('Failed to load posts');
        }

        const data = await response.json();

        if (reset) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }

        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [categoryKey, sort, status]
  );

  // Load initial posts
  useEffect(() => {
    setPage(1);
    loadPosts(1, true);
  }, [categoryKey, sort, status, loadPosts]);

  // Load more posts
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage);
    }
  };

  // Set up infinite scroll
  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore,
  });

  const retry = () => {
    setPage(1);
    loadPosts(1, true);
  };

  if (error && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unable to load posts</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={retry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastElementRef : undefined}
          >
            <PostCard post={post} />
          </div>
        ))}

        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              {status
                ? `No ${status.replace('-', ' ')} posts in this category yet.`
                : 'No posts in this category yet.'}
            </p>
          </div>
        )}

        {!loading && !hasMore && posts.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You&apos;ve reached the end!</p>
          </div>
        )}
      </div>
    </div>
  );
}
