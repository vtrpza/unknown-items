import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/session-provider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Unknown Items - Discover the Mysteries',
  description:
    'A social platform for sharing and discovering mysterious content, unknown facts, and unexplained phenomena.',
  keywords: [
    'mysteries',
    'unknown',
    'unexplained',
    'phenomena',
    'social media',
  ],
  authors: [{ name: 'Unknown Items Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://unknownitems.com',
    title: 'Unknown Items - Discover the Mysteries',
    description:
      'A social platform for sharing and discovering mysterious content, unknown facts, and unexplained phenomena.',
    siteName: 'Unknown Items',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unknown Items - Discover the Mysteries',
    description:
      'A social platform for sharing and discovering mysterious content, unknown facts, and unexplained phenomena.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
