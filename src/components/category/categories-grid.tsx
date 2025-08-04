'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  Monitor,
  Telescope,
  Clock,
  BookOpen,
  Microscope,
  Eye,
  Shield,
  HelpCircle,
} from 'lucide-react';

const CATEGORIES = [
  {
    slug: 'unknown-facts',
    name: 'Unknown Facts',
    description: 'Fascinating facts that remain mysteries',
    icon: Globe,
    color: 'bg-blue-500',
    postCount: 0, // This would come from the API in a real implementation
  },
  {
    slug: 'internet-mysteries',
    name: 'Internet Mysteries',
    description: 'Digital enigmas and online puzzles',
    icon: Monitor,
    color: 'bg-purple-500',
    postCount: 0,
  },
  {
    slug: 'unidentified-objects',
    name: 'Unidentified Objects',
    description: 'UFOs and mysterious objects',
    icon: Telescope,
    color: 'bg-indigo-500',
    postCount: 0,
  },
  {
    slug: 'unexplained-events',
    name: 'Unexplained Events',
    description: 'Strange occurrences without clear explanations',
    icon: Clock,
    color: 'bg-orange-500',
    postCount: 0,
  },
  {
    slug: 'historical-mysteries',
    name: 'Historical Mysteries',
    description: 'Unsolved puzzles from the past',
    icon: BookOpen,
    color: 'bg-amber-500',
    postCount: 0,
  },
  {
    slug: 'scientific-anomalies',
    name: 'Scientific Anomalies',
    description: 'Phenomena that challenge current science',
    icon: Microscope,
    color: 'bg-green-500',
    postCount: 0,
  },
  {
    slug: 'cryptids',
    name: 'Cryptids',
    description: 'Legendary creatures and unknown animals',
    icon: Eye,
    color: 'bg-red-500',
    postCount: 0,
  },
  {
    slug: 'conspiracies',
    name: 'Conspiracies',
    description: 'Alternative theories and cover-ups',
    icon: Shield,
    color: 'bg-gray-600',
    postCount: 0,
  },
  {
    slug: 'other',
    name: 'Other',
    description: "Mysteries that don't fit other categories",
    icon: HelpCircle,
    color: 'bg-slate-500',
    postCount: 0,
  },
];

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {CATEGORIES.map(category => {
        const Icon = category.icon;

        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group-hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${category.color} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.postCount} posts
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Explore mysteries and share discoveries in this category.
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
