import Link from 'next/link';
import { Search, ShoppingCart, User as UserIcon } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground font-bold p-1 rounded">K2K</div>
            <span className="font-heading font-bold text-xl hidden sm:inline-block">Kadal2Kadaai</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/search" aria-label="Search">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {/* Future Cart Badge */}
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">0</span>
          </div>

          <Link href="/profile" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <UserIcon className="h-5 w-5" />
            </Button>
          </Link>

          <div className="hidden md:flex gap-2 ml-2 border-l pl-4">
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
