'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <button onClick={toggle} className="p-2 text-foreground" aria-label="Toggle Menu">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b p-4 shadow-lg flex flex-col gap-4 z-50">
          <Link href="/" onClick={toggle} className="font-medium px-2 py-1">Home</Link>
          <Link href="/categories" onClick={toggle} className="font-medium px-2 py-1">Categories</Link>
          <Link href="/products" onClick={toggle} className="font-medium px-2 py-1">Products</Link>
          <Link href="/about" onClick={toggle} className="font-medium px-2 py-1">About Us</Link>
          <Link href="/contact" onClick={toggle} className="font-medium px-2 py-1">Contact</Link>
          <hr />
          <Link href="/login" onClick={toggle}>
            <Button variant="outline" className="w-full">Login</Button>
          </Link>
          <Link href="/register" onClick={toggle}>
            <Button className="w-full">Register</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
