import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication pages for Unknown Items',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mystery-text-gradient">
            Unknown Items
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover the mysteries that surround us
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
