import Link from 'next/link';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
        <ShieldX className="size-10" />
      </div>
      <h1 className="text-2xl font-bold">Access denied</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        You don&apos;t have permission to view this portal with your current role.
        Please sign in with the correct credentials.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/login">
          <Button>Sign in again</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
