import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PostCard } from '@/components/post/post-card';
import { CommentSection } from '@/components/comments/comment-section';
import { prisma } from '@/lib/prisma';

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                displayName: true,
                avatar: true,
                verified: true,
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
            width: true,
            height: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
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

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: 'Post Not Found - Unknown Items',
    };
  }

  const displayName = post.author.profile?.displayName || post.author.username;
  const description =
    post.content.length > 160
      ? post.content.substring(0, 160) + '...'
      : post.content;

  return {
    title: `${post.title} - Unknown Items`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      authors: [displayName],
      images: post.media.length > 0 ? [post.media[0].url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.media.length > 0 ? [post.media[0].url] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  // Increment view count (this could be optimized with a separate API call or background job)
  await prisma.post.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  // Convert the post data to match the expected format
  const postData = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: {
      ...post.author,
      profile: post.author.profile
        ? {
            displayName: post.author.profile.displayName || undefined,
            avatar: post.author.profile.avatar || undefined,
          }
        : undefined,
    },
    media: post.media.map(media => ({
      id: media.id,
      url: media.url,
      type: media.type,
      thumbnailUrl: media.thumbnailUrl || undefined,
    })),
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <PostCard post={postData} showFullContent={true} />

      <div id="comments">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}
