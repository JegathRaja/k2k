'use client';

import React from 'react';
import { useSellerAnalytics } from '@/shared/api/hooks/useSellerAnalytics';
import { Loader2, TrendingUp, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SellerAnalyticsDashboard() {
  const { data, isLoading } = useSellerAnalytics();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Shop Analytics</h1>
      <p className="text-muted-foreground">Track your revenue, orders, and products overview.</p>
      
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">Total Products</h3>
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-primary">{data?.total_products || 0}</p>
        </div>
        
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">Total Orders</h3>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-primary">{data?.total_orders || 0}</p>
        </div>
        
        <div className="p-6 bg-card rounded-xl border shadow-sm border-orange-200 bg-orange-50/50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-orange-800">Pending Orders</h3>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{data?.pending_orders || 0}</p>
          {data?.pending_orders ? (
            <Link href="/seller/orders" className="text-sm text-orange-700 underline mt-2 inline-block">Review orders</Link>
          ) : null}
        </div>

        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">Est. Revenue</h3>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-primary">₹{data?.total_revenue || '0.00'}</p>
        </div>
      </div>
    </div>
  );
}
