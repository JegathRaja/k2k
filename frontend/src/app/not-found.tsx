import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🎣</div>
      <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Nothing Caught Here!</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
        The page you are looking for seems to have swum away. It might have been moved or deleted.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button size="lg">Return Home</Button>
        </Link>
        <Link href="/products">
          <Button size="lg" variant="outline">Browse Products</Button>
        </Link>
      </div>
    </div>
  );
}
