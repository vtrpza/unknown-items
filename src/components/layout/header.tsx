'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({}: HeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [, setIsSearchOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <MobileNav />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg mystery-gradient flex items-center justify-center">
              <span className="text-white font-bold text-lg">?</span>
            </div>
            <span className="font-bold text-xl mystery-text-gradient hidden sm:inline-block">
              Unknown Items
            </span>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search mysteries..."
              className="pl-10 pr-4 bg-muted/50"
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        </div>

        {/* Right side - Actions and User Menu */}
        <div className="flex items-center space-x-2">
          {/* Search button for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {session ? (
            <>
              {/* Create Post Button */}
              <Button size="sm" className="hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Plus className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || ''}
                        alt={session.user.name || ''}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) ||
                          session.user.email?.charAt(0) ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name || session.user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${session.user.username}`}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const { data: session } = useSession();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/discover', label: 'Discover' },
    { href: '/categories', label: 'Categories' },
    { href: '/trending', label: 'Trending' },
  ];

  return (
    <div className="flex flex-col space-y-4 py-6">
      <Link href="/" className="flex items-center space-x-2 px-2">
        <div className="w-8 h-8 rounded-lg mystery-gradient flex items-center justify-center">
          <span className="text-white font-bold text-lg">?</span>
        </div>
        <span className="font-bold text-xl mystery-text-gradient">
          Unknown Items
        </span>
      </Link>

      <div className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {session && (
        <>
          <hr className="my-4" />
          <div className="space-y-2">
            <Link
              href={`/profile/${session.user.username}`}
              className="block px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              My Profile
            </Link>
            <Link
              href="/bookmarks"
              className="block px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              Bookmarks
            </Link>
            <Link
              href="/settings"
              className="block px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              Settings
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
