'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:pt-16 lg:border-r">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-72">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
