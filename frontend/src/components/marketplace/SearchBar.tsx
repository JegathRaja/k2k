'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchBar({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex w-full items-center ${className}`}>
      <Input
        type="search"
        placeholder="Search for fresh fish, prawns, crabs..."
        className="w-full pr-12 rounded-full border-primary/20 focus-visible:ring-primary h-12 text-base"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button 
        type="submit" 
        size="icon" 
        className="absolute right-1 top-1 bottom-1 h-10 w-10 rounded-full"
        aria-label="Submit Search"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
