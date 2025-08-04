import { Metadata } from 'next';
import { CategoriesGrid } from '@/components/category/categories-grid';

export const metadata: Metadata = {
  title: 'Categories - Unknown Items',
  description:
    'Explore different types of mysteries and unexplained phenomena. From internet mysteries to historical puzzles.',
  openGraph: {
    title: 'Categories - Unknown Items',
    description:
      'Explore different types of mysteries and unexplained phenomena.',
  },
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Mystery Categories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the different types of mysteries and unexplained phenomena
            that fascinate us. Each category contains curated content from our
            community of mystery enthusiasts.
          </p>
        </div>

        <CategoriesGrid />
      </div>
    </div>
  );
}
