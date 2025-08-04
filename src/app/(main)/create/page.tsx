import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { PostCreationForm } from '@/components/post/post-creation-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export const metadata = {
  title: 'Share a Mystery - Unknown Items',
  description:
    'Share your mystery, unexplained phenomenon, or unknown fact with the community.',
};

export default async function CreatePostPage() {
  const session = await auth();

  if (!session) {
    redirect('/signin?callbackUrl=/create');
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <PlusCircle className="h-6 w-6" />
            Share a Mystery
          </CardTitle>
          <p className="text-muted-foreground">
            Share something mysterious, unexplained, or fascinating with the
            community. Your post could be the key to solving an ancient puzzle
            or discovering something new.
          </p>
        </CardHeader>
        <CardContent>
          <PostCreationForm />
        </CardContent>
      </Card>
    </div>
  );
}
