import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
        <Eye className="size-10" />
      </div>
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We couldn&apos;t find that page. It may have moved or never existed.
      </p>
      <Link href="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
