import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CategoryFeed } from '@/components/category/category-feed';
import { CategoryHeader } from '@/components/category/category-header';

// Define valid category slugs based on our Prisma schema
const VALID_CATEGORIES = {
  'unknown-facts': {
    key: 'UNKNOWN_FACTS',
    name: 'Unknown Facts',
    description: 'Fascinating facts that remain mysteries',
  },
  'internet-mysteries': {
    key: 'INTERNET_MYSTERIES',
    name: 'Internet Mysteries',
    description: 'Digital enigmas and online puzzles',
  },
  'unidentified-objects': {
    key: 'UNIDENTIFIED_OBJECTS',
    name: 'Unidentified Objects',
    description: 'UFOs and mysterious objects',
  },
  'unexplained-events': {
    key: 'UNEXPLAINED_EVENTS',
    name: 'Unexplained Events',
    description: 'Strange occurrences without clear explanations',
  },
  'historical-mysteries': {
    key: 'HISTORICAL_MYSTERIES',
    name: 'Historical Mysteries',
    description: 'Unsolved puzzles from the past',
  },
  'scientific-anomalies': {
    key: 'SCIENTIFIC_ANOMALIES',
    name: 'Scientific Anomalies',
    description: 'Phenomena that challenge current science',
  },
  cryptids: {
    key: 'CRYPTIDS',
    name: 'Cryptids',
    description: 'Legendary creatures and unknown animals',
  },
  conspiracies: {
    key: 'CONSPIRACIES',
    name: 'Conspiracies',
    description: 'Alternative theories and cover-ups',
  },
  other: {
    key: 'OTHER',
    name: 'Other',
    description: "Mysteries that don't fit other categories",
  },
} as const;

type CategorySlug = keyof typeof VALID_CATEGORIES;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    sort?: 'recent' | 'popular' | 'unsolved';
    status?: 'unsolved' | 'partially-solved' | 'solved' | 'debunked';
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = VALID_CATEGORIES[slug as CategorySlug];

  if (!category) {
    return {
      title: 'Category Not Found - Unknown Items',
    };
  }

  return {
    title: `${category.name} - Unknown Items`,
    description: `Explore ${category.description.toLowerCase()} on Unknown Items. Discover, discuss, and solve mysteries together.`,
    openGraph: {
      title: `${category.name} - Unknown Items`,
      description: category.description,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(VALID_CATEGORIES).map(slug => ({
    slug,
  }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort, status } = await searchParams;
  const category = VALID_CATEGORIES[slug as CategorySlug];

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <CategoryHeader
        category={category}
        currentSort={sort || 'recent'}
        currentStatus={status}
      />
      <CategoryFeed
        categoryKey={category.key}
        sort={sort || 'recent'}
        status={status}
      />
    </div>
  );
}
