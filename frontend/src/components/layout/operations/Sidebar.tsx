'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Home, Package, ShoppingBag, Users, Settings, BarChart2, Anchor, ShieldCheck, Shield } from 'lucide-react';

export function OperationsSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  const getInitials = (first?: string, last?: string) => {
    if (first && last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    if (first) return first.charAt(0).toUpperCase();
    return 'A';
  };

  const mainRole = user?.roles?.[0]?.name?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Super Admin';

  const isActive = (path: string) => pathname.startsWith(path);
  
  const getLinkClasses = (path: string) => 
    isActive(path)
      ? "flex items-center gap-3 px-3 py-2.5 rounded-md bg-primary-800 text-white font-medium"
      : "flex items-center gap-3 px-3 py-2.5 rounded-md text-primary-200 hover:bg-primary-800/50 hover:text-white transition-colors";
      
  const getIconClasses = (path: string) =>
    isActive(path) ? "h-5 w-5 text-accent-400" : "h-5 w-5";

  return (
    <aside className="w-64 bg-primary-900 flex flex-col h-full shadow-lg shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-primary-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Anchor className="h-6 w-6 text-accent-400" />
          <span className="font-heading text-h5 font-bold text-white tracking-tight">Operations</span>
        </Link>
      </div>

      <div className="p-4 border-b border-primary-800 bg-primary-800/50">
        <Link href="/admin/profile" className="flex items-center gap-3 hover:bg-primary-800/80 p-2 -mx-2 rounded-lg transition-colors">
          <div className="h-10 w-10 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold">
            {getInitials(user?.first_name, user?.last_name)}
          </div>
          <div>
            <p className="text-bodySmall font-semibold text-white">{user?.first_name || 'Admin'} {user?.last_name || 'User'}</p>
            <p className="text-caption text-primary-300 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> {mainRole}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="mb-6">
          <p className="px-3 text-caption font-semibold text-primary-400 uppercase tracking-wider mb-2">Overview</p>
          <Link href="/admin/dashboard" className={getLinkClasses('/admin/dashboard')}>
            <Home className={getIconClasses('/admin/dashboard')} />
            Dashboard
          </Link>
          <Link href="/admin/consumers" className={getLinkClasses('/admin/consumers')}>
            <Users className={getIconClasses('/admin/consumers')} />
            Consumers
          </Link>
        </div>

        <div className="mb-6">
          <p className="px-3 text-caption font-semibold text-primary-400 uppercase tracking-wider mb-2">Commerce</p>
          <Link href="/admin/orders" className={getLinkClasses('/admin/orders')}>
            <ShoppingBag className={getIconClasses('/admin/orders')} />
            Orders
          </Link>
          <Link href="/admin/products" className={getLinkClasses('/admin/products')}>
            <Package className={getIconClasses('/admin/products')} />
            Inventory
          </Link>
          <Link href="/admin/categories" className={getLinkClasses('/admin/categories')}>
            <Package className={getIconClasses('/admin/categories')} />
            Categories
          </Link>
        </div>

        <div className="mb-6">
          <p className="px-3 text-caption font-semibold text-primary-400 uppercase tracking-wider mb-2">Administration</p>
          <Link href="/admin/users" className={getLinkClasses('/admin/users')}>
            <Users className={getIconClasses('/admin/users')} />
            Users & Roles
          </Link>

          <Link href="/admin/settings" className={getLinkClasses('/admin/settings')}>
            <Settings className={getIconClasses('/admin/settings')} />
            System Settings
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('api_token');
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-md text-error-400 hover:bg-error-500/10 hover:text-error-300 transition-colors"
          >
            <ShieldCheck className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
