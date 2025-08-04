'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'UNKNOWN_FACTS', label: 'Unknown Facts' },
  { value: 'INTERNET_MYSTERIES', label: 'Internet Mysteries' },
  { value: 'UNIDENTIFIED_OBJECTS', label: 'Unidentified Objects' },
  { value: 'UNEXPLAINED_EVENTS', label: 'Unexplained Events' },
  { value: 'HISTORICAL_MYSTERIES', label: 'Historical Mysteries' },
  { value: 'SCIENTIFIC_ANOMALIES', label: 'Scientific Anomalies' },
  { value: 'CRYPTIDS', label: 'Cryptids' },
  { value: 'CONSPIRACIES', label: 'Conspiracies' },
  { value: 'OTHER', label: 'Other' },
] as const;

const formSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum([
    'UNKNOWN_FACTS',
    'INTERNET_MYSTERIES',
    'UNIDENTIFIED_OBJECTS',
    'UNEXPLAINED_EVENTS',
    'HISTORICAL_MYSTERIES',
    'SCIENTIFIC_ANOMALIES',
    'CRYPTIDS',
    'CONSPIRACIES',
    'OTHER',
  ]),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
});

type FormValues = z.infer<typeof formSchema>;

export function PostCreationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'OTHER',
      tags: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          contentType: 'TEXT',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      const post = await response.json();
      toast.success('Mystery shared successfully!');
      router.push(`/post/${post.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create post'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (!tag) return;

    const currentTags = form.getValues('tags');
    if (currentTags.includes(tag)) {
      toast.error('Tag already added');
      return;
    }

    if (currentTags.length >= 10) {
      toast.error('Maximum 10 tags allowed');
      return;
    }

    form.setValue('tags', [...currentTags, tag]);
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue(
      'tags',
      currentTags.filter(tag => tag !== tagToRemove)
    );
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="What's the mystery you want to share?"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Give your mystery a compelling title that draws people in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best fits your mystery.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the mystery in detail. What makes it unexplained? What evidence do you have? What theories exist?"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide as much detail as possible. Include sources, links, or
                references if available.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                      disabled={!newTag.trim() || field.value.length >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {field.value.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Add relevant tags to help others find your mystery. Press Enter
                or click + to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-6">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSubmitting ? 'Sharing...' : 'Share Mystery'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
