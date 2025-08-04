import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Settings,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import Link from 'next/link';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await auth();
  const { username } = await params;

  // Fetch user profile data
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      posts: {
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === user.id;

  // Check if current user follows this user
  const isFollowing = session?.user?.id
    ? await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: user.id,
          },
        },
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="glass-effect">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={user.profile?.avatar || ''}
                  alt={user.profile?.displayName || user.username}
                />
                <AvatarFallback className="text-2xl">
                  {(user.profile?.displayName || user.username)
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">
                    {user.profile?.displayName || user.username}
                  </h1>
                  {user.profile?.verified && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">@{user.username}</p>

                {/* Mystery Score */}
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="mystery-text-gradient font-semibold"
                  >
                    Mystery Score: {user.profile?.mysteryScore || 0}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              {/* Bio */}
              {user.profile?.bio && (
                <p className="text-muted-foreground">{user.profile.bio}</p>
              )}

              {/* Profile Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user.profile?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.profile.location}
                  </div>
                )}

                {user.profile?.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <a
                      href={user.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      Website
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined{' '}
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Interests */}
              {user.profile?.interests && user.profile.interests.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.interests.map(interest => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="font-bold text-lg">{user._count.posts}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {user._count.followers}
                  </div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {user._count.following}
                  </div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button asChild>
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                ) : session ? (
                  <Button variant={isFollowing ? 'outline' : 'default'}>
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Recent Posts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Recent Posts</h2>

        {user.posts.length === 0 ? (
          <Card className="glass-effect">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "You haven't posted any mysteries yet."
                  : `${user.profile?.displayName || user.username} hasn't posted any mysteries yet.`}
              </p>
              {isOwnProfile && (
                <Button className="mt-4" asChild>
                  <Link href="/create">Share Your First Mystery</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {user.posts.map(post => (
              <Card key={post.id} className="glass-effect hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="hover:mystery-text-gradient transition-all cursor-pointer">
                        <Link href={`/post/${post.id}`}>{post.title}</Link>
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {post.category
                            .replace('_', ' ')
                            .toLowerCase()
                            .replace(/^\w/, c => c.toUpperCase())}
                        </Badge>
                        <Badge
                          variant={
                            post.mysteryStatus === 'SOLVED'
                              ? 'default'
                              : post.mysteryStatus === 'PARTIALLY_SOLVED'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {post.mysteryStatus
                            .replace('_', ' ')
                            .toLowerCase()
                            .replace(/^\w/, c => c.toUpperCase())}
                        </Badge>
                        {post.featured && (
                          <Badge className="mystery-gradient text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {post.content.substring(0, 200)}...
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post._count.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post._count.comments}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
