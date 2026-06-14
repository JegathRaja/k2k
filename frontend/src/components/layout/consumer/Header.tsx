'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ShoppingCart, Bell, User, Heart, LogOut } from 'lucide-react';
import { Container } from '../shared/Container';
import { useCart } from '@/shared/api/hooks/useCart';
import { useAuth } from '@/providers/AuthProvider';

export function ConsumerHeader() {
  const { data: cart } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart?.total_items || 0;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'glass-nav py-2' : 'bg-transparent py-4'}`}>
      <Container className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
              <span className="font-bold text-lg">K2</span>
            </div>
            <span className="font-heading text-h4 font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">Kadal2Kadaai</span>
          </Link>
          
          {/* Location Selector */}
          <button className="hidden md:flex items-center gap-2 text-bodySmall text-muted-foreground hover:text-primary transition-colors bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-border/50">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="font-medium">Select Location</span>
          </button>
        </div>

        {/* Search */}
        <div className="hidden lg:flex flex-1 max-w-xl px-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search fresh seafood..." 
              className="w-full h-12 pl-12 pr-4 rounded-full border border-border/50 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm transition-all outline-none text-foreground font-medium placeholder:text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap"
            />
          </div>
        </div>

        {/* Actions & Navigation */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-bodyMedium font-medium mr-4">
            <Link href="/categories" className="text-foreground/80 hover:text-primary transition-colors hover:scale-105 transform">Categories</Link>
            <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors hover:scale-105 transform">About Us</Link>
          </nav>

          <div className="flex items-center gap-3 border-l border-border/50 pl-6">
            <button className="p-2.5 text-foreground/80 hover:text-accent hover:bg-accent/10 rounded-full transition-all">
              <Heart className="h-5 w-5" />
            </button>
            <Link href="/cart" className="p-2.5 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-full transition-all relative block group">
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {mounted && cartCount > 0 && (
                <span className="absolute 0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-md animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="p-2.5 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-full transition-all">
              <Bell className="h-5 w-5" />
            </button>
            
            {mounted && (
              isAuthenticated ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-sm">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline-block text-sm font-semibold">{user?.first_name}</span>
                  </Link>
                  <button onClick={() => { logout(); window.location.href = '/login'; }} className="p-2.5 text-foreground/80 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all" title="Log Out">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg hover:scale-105 transition-all ml-2 font-medium">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline-block">Log In</span>
                </Link>
              )
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
