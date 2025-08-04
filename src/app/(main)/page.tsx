import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainFeed } from '@/components/feed/main-feed';
import Link from 'next/link';
import { Plus, TrendingUp, Eye, Users } from 'lucide-react';

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4 mystery-text-gradient">
          Welcome to Unknown Items
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover mysteries, share unexplained phenomena, and connect with a
          community fascinated by the unknown.
        </p>

        {session ? (
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/create">
                <Plus className="mr-2 h-5 w-5" />
                Share a Mystery
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/discover">
                <Eye className="mr-2 h-5 w-5" />
                Explore
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Join Community</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl">
              <Eye className="mr-2 h-6 w-6 text-blue-500" />
              1,247
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Active Mysteries</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl">
              <Users className="mr-2 h-6 w-6 text-green-500" />
              15,892
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Mystery Hunters</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl">
              <TrendingUp className="mr-2 h-6 w-6 text-purple-500" />
              342
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Solved This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Explore Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Internet Mysteries',
              description: 'Strange websites, unexplained phenomena online',
              href: '/category/internet-mysteries',
              gradient: 'from-blue-500 to-cyan-500',
            },
            {
              title: 'Unexplained Events',
              description: 'Historical events that remain unexplained',
              href: '/category/unexplained-events',
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              title: 'Scientific Anomalies',
              description: 'Things that science cannot yet explain',
              href: '/category/scientific-anomalies',
              gradient: 'from-green-500 to-emerald-500',
            },
            {
              title: 'Unknown Facts',
              description: 'Fascinating facts about our world',
              href: '/category/unknown-facts',
              gradient: 'from-orange-500 to-red-500',
            },
            {
              title: 'Cryptids',
              description: 'Mysterious creatures and urban legends',
              href: '/category/cryptids',
              gradient: 'from-indigo-500 to-purple-500',
            },
            {
              title: 'Historical Mysteries',
              description: 'Unsolved puzzles from the past',
              href: '/category/historical-mysteries',
              gradient: 'from-yellow-500 to-orange-500',
            },
          ].map(category => (
            <Card
              key={category.href}
              className="hover-lift cursor-pointer group"
            >
              <Link href={category.href}>
                <CardHeader>
                  <div
                    className={`w-full h-24 rounded-lg bg-gradient-to-r ${category.gradient} mb-4`}
                  />
                  <CardTitle className="group-hover:mystery-text-gradient transition-all">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Feed */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Latest Mysteries</h2>
        <MainFeed />
      </div>
    </div>
  );
}
