import React from 'react';
import Link from 'next/link';
import { Anchor, Building2, User, LogOut } from 'lucide-react';

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* B2B Header */}
      <header className="bg-primary-950 border-b border-primary-900 sticky top-0 z-50">
        <div className="h-16 px-4 md:px-8 mx-auto flex items-center justify-between">
          <Link href="/b2b" className="flex items-center gap-2 text-white">
            <Anchor className="h-6 w-6 text-accent-500" />
            <span className="font-heading font-bold text-h5 tracking-tight">Kadal2Kadaai <span className="font-light text-primary-300">| Business</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-bodyMedium font-medium">
            <Link href="/procurement" className="text-primary-100 hover:text-white transition-colors">Catalog</Link>
            <Link href="/dashboard" className="text-primary-100 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/dashboard" className="text-primary-100 hover:text-white transition-colors">Invoices</Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-primary-200 text-bodySmall">
              <Building2 className="h-4 w-4" />
              <span>Marriott Hotels (GST Verified)</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-800 flex items-center justify-center text-primary-100 cursor-pointer">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {/* B2B Footer */}
      <footer className="bg-primary-950 text-primary-300 py-8 border-t border-primary-900 mt-auto">
        <div className="px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-caption">
          <p>© 2026 Kadal2Kadaai Business. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">Procurement Terms</Link>
            <Link href="#" className="hover:text-white">API Integration</Link>
            <Link href="#" className="hover:text-white">Support Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
