'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminOrders } from '@/shared/api/hooks/useAdminOrders';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Eye, Filter } from 'lucide-react';

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useAdminOrders(page, { search, status });

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Global Order Management</h1>
          <p className="text-muted-foreground mt-1">View and monitor all orders across the marketplace.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="h-10 px-3 py-2 border rounded-md text-sm bg-background"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending_seller_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="preparing">Preparing</option>
            <option value="packed">Packed</option>
            <option value="ready_for_dispatch">Ready for Dispatch</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search Order ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Seller</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    Loading global orders...
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No orders found matching your criteria.</td></tr>
              ) : (
                data?.data?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium text-slate-900">#{order.order_number}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {order.consumer?.first_name} {order.consumer?.last_name}
                    </td>
                    <td className="px-6 py-4">
                      {order.seller?.first_name} {order.seller?.last_name}
                    </td>
                    <td className="px-6 py-4 font-semibold">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="icon" title="View Order Timeline">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data && data.last_page > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Page {data.current_page} of {data.last_page}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={data.current_page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={data.current_page === data.last_page} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
