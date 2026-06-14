'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSellerOrders, useApproveSellerOrder, useRejectSellerOrder, useUpdateSellerOrderStatus } from '@/shared/api/hooks/useSellerOrders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Eye, Check, X, Truck, Package } from 'lucide-react';

export default function SellerOrdersDashboard() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerOrders(page);
  const approveOrder = useApproveSellerOrder();
  const rejectOrder = useRejectSellerOrder();
  const updateStatus = useUpdateSellerOrderStatus();

  const orders = data?.data || [];

  const handleApprove = (id: string) => {
    approveOrder.mutate(id);
  };

  const handleReject = (id: string) => {
    if (!prompt('Enter rejection reason (optional):')) return; // In a real app we'd use a modal
    rejectOrder.mutate({ id, reason: 'Seller rejected' });
  };

  const handleStatusChange = (id: string, currentStatus: string) => {
    // Flow: approved -> preparing -> packed -> ready_for_dispatch -> delivered
    let nextStatus = '';
    if (currentStatus === 'approved') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'packed';
    else if (currentStatus === 'packed') nextStatus = 'ready_for_dispatch';
    else if (currentStatus === 'ready_for_dispatch') nextStatus = 'delivered';

    if (nextStatus) {
      updateStatus.mutate({ id, status: nextStatus });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Order Management</h1>
        <p className="text-muted-foreground">Process your incoming orders and manage dispatch statuses.</p>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search order ID..." 
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{order.order_number}</td>
                    <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{order.consumer?.first_name} {order.consumer?.last_name}</td>
                    <td className="px-6 py-4 font-semibold">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'pending_seller_approval' && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(order.id)} disabled={approveOrder.isPending} className="bg-green-600 hover:bg-green-700">
                              <Check className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(order.id)} disabled={rejectOrder.isPending}>
                              <X className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        
                        {(order.status === 'approved' || order.status === 'preparing' || order.status === 'packed' || order.status === 'ready_for_dispatch') && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.id, order.status)} disabled={updateStatus.isPending}>
                            <Truck className="w-4 h-4 mr-1" /> Next Step
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
