'use client';

// Remove unused imports
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  TrendingUp,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryInfo {
  key: string;
  name: string;
  description: string;
}

interface CategoryHeaderProps {
  category: CategoryInfo;
  currentSort: string;
  currentStatus?: string;
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent', icon: Clock },
  { value: 'popular', label: 'Most Popular', icon: TrendingUp },
  { value: 'unsolved', label: 'Unsolved First', icon: HelpCircle },
];

const STATUS_OPTIONS = [
  {
    value: 'unsolved',
    label: 'Unsolved',
    icon: HelpCircle,
    color: 'bg-red-500',
  },
  {
    value: 'partially-solved',
    label: 'Partially Solved',
    icon: AlertTriangle,
    color: 'bg-yellow-500',
  },
  {
    value: 'solved',
    label: 'Solved',
    icon: CheckCircle,
    color: 'bg-green-500',
  },
  { value: 'debunked', label: 'Debunked', icon: X, color: 'bg-gray-500' },
];

export function CategoryHeader({
  category,
  currentSort,
  currentStatus,
}: CategoryHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    router.push(`?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (currentStatus === status) {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`?${params.toString()}`);
  };

  const currentSortOption = SORT_OPTIONS.find(
    option => option.value === currentSort
  );

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-xl text-muted-foreground">
            {category.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              Filter by status:
            </span>
            {STATUS_OPTIONS.map(status => {
              const isActive = currentStatus === status.value;
              const Icon = status.icon;

              return (
                <Button
                  key={status.value}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusFilter(status.value)}
                  className={`gap-1 ${isActive ? status.color : ''}`}
                >
                  <Icon className="h-3 w-3" />
                  {status.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Sort by:
            </span>
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {currentSortOption && (
                      <currentSortOption.icon className="h-4 w-4" />
                    )}
                    {currentSortOption?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
