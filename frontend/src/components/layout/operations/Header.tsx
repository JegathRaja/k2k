'use client';

import React from 'react';
import { Search, Bell, ChevronRight, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function OperationsHeader() {
  const pathname = usePathname();
  
  const segments = pathname.split('/').filter(Boolean);
  const pageName = segments.length > 1 
    ? segments[segments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    : 'Dashboard';

  return (
    <header className="h-20 bg-card border-b border-border shadow-sm flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground">
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center text-bodyMedium text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">Operations</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-foreground">{pageName}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search operations..." 
            className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-bodySmall"
          />
        </div>

        <div className="flex items-center gap-4 border-l border-border pl-6">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
