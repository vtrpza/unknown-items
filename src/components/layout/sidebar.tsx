'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Home,
  Compass,
  TrendingUp,
  Bookmark,
  User,
  Settings,
  Search,
  Grid3X3,
  Eye,
  Globe,
  History,
  Microscope,
  Skull,
  HelpCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
    },
    {
      label: 'Discover',
      href: '/discover',
      icon: Compass,
    },
    {
      label: 'Trending',
      href: '/trending',
      icon: TrendingUp,
      badge: 'Hot',
    },
    {
      label: 'Search',
      href: '/search',
      icon: Search,
    },
  ];

  const categories = [
    {
      label: 'Unknown Facts',
      href: '/category/unknown-facts',
      icon: HelpCircle,
      color: 'text-blue-500',
    },
    {
      label: 'Internet Mysteries',
      href: '/category/internet-mysteries',
      icon: Globe,
      color: 'text-green-500',
    },
    {
      label: 'Unidentified Objects',
      href: '/category/unidentified-objects',
      icon: Eye,
      color: 'text-purple-500',
    },
    {
      label: 'Unexplained Events',
      href: '/category/unexplained-events',
      icon: History,
      color: 'text-orange-500',
    },
    {
      label: 'Historical Mysteries',
      href: '/category/historical-mysteries',
      icon: Grid3X3,
      color: 'text-yellow-500',
    },
    {
      label: 'Scientific Anomalies',
      href: '/category/scientific-anomalies',
      icon: Microscope,
      color: 'text-red-500',
    },
    {
      label: 'Cryptids',
      href: '/category/cryptids',
      icon: Skull,
      color: 'text-indigo-500',
    },
  ];

  const userItems = session
    ? [
        {
          label: 'My Profile',
          href: `/profile/${session.user.username}`,
          icon: User,
        },
        {
          label: 'Bookmarks',
          href: '/bookmarks',
          icon: Bookmark,
        },
        {
          label: 'Settings',
          href: '/settings',
          icon: Settings,
        },
      ]
    : [];

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      <div className="p-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg mystery-gradient flex items-center justify-center">
            <span className="text-white font-bold text-lg">?</span>
          </div>
          <span className="font-bold text-xl mystery-text-gradient">
            Unknown Items
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4 space-y-6">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            );
          })}
        </nav>

        <Separator />

        {/* Categories */}
        <div>
          <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
            Categories
          </h3>
          <nav className="space-y-1">
            {categories.map(category => {
              const Icon = category.icon;
              const isActive = pathname === category.href;

              return (
                <Button
                  key={category.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={category.href}>
                    <Icon className={`mr-3 h-4 w-4 ${category.color}`} />
                    <span className="text-sm">{category.label}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* User Section */}
        {session && (
          <>
            <Separator />
            <div>
              <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
                Your Account
              </h3>
              <nav className="space-y-1">
                {userItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={item.href}>
                        <Icon className="mr-3 h-4 w-4" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>&copy; 2024 Unknown Items</p>
          <div className="flex space-x-3">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
