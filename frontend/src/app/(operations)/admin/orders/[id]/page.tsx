'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminOrder, useUpdateAdminOrderStatus } from '@/shared/api/hooks/useAdminOrders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Loader2, ChevronLeft, Package, User, MapPin, 
  CheckCircle2, ShieldAlert, ShoppingBag, CreditCard, UserCheck
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const { data: order, isLoading } = useAdminOrder(params.id);
  const updateStatus = useUpdateAdminOrderStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm font-medium">Loading order information...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          The order you are looking for does not exist or you don't have permission to access it.
        </p>
        <Link href="/admin/orders">
          <Button className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" /> Back to Global Orders
          </Button>
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = async (status: string) => {
    setUpdatingId(status);
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Define steps for the timeline
  const getTimelineSteps = () => {
    const defaultSteps = [
      { key: 'pending_seller_approval', label: 'Pending Approval', color: 'bg-amber-500' },
      { key: 'approved', label: 'Approved', color: 'bg-blue-500' },
      { key: 'processing', label: 'Processing', color: 'bg-indigo-500' },
      { key: 'ready_for_delivery', label: 'Ready', color: 'bg-cyan-500' },
      { key: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-purple-500' },
      { key: 'delivered', label: 'Delivered', color: 'bg-emerald-500' }
    ];

    if (order.status === 'cancelled') {
      return [
        ...defaultSteps.slice(0, 3),
        { key: 'cancelled', label: 'Cancelled', color: 'bg-rose-500' }
      ];
    }

    if (order.status === 'rejected') {
      return [
        { key: 'pending_seller_approval', label: 'Pending Approval', color: 'bg-amber-500' },
        { key: 'rejected', label: 'Rejected', color: 'bg-rose-500' }
      ];
    }

    return defaultSteps;
  };

  const steps = getTimelineSteps();
  const currentStepIndex = steps.findIndex(s => s.key === order.status);

  // Status-related helper variables
  const isTerminal = ['delivered', 'cancelled', 'rejected', 'refunded'].includes(order.status);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <Link href="/admin/orders" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
            <ChevronLeft className="h-4 w-4" /> Back to Global Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Order #{order.order_number}</h1>
            <Badge variant="outline" className="capitalize text-sm font-semibold border-primary/20 px-3 py-0.5">
              {order.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created on {format(new Date(order.created_at), 'PPP')} at {format(new Date(order.created_at), 'p')}
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2 block w-full md:w-auto">Update Status:</span>
          {order.status === 'pending_seller_approval' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                disabled={updateStatus.isPending}
                onClick={() => handleStatusUpdate('approved')}
              >
                {updatingId === 'approved' ? 'Approving...' : 'Approve Order'}
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                disabled={updateStatus.isPending}
                onClick={() => handleStatusUpdate('rejected')}
              >
                {updatingId === 'rejected' ? 'Rejecting...' : 'Reject Order'}
              </Button>
            </>
          )}

          {!isTerminal && order.status !== 'pending_seller_approval' && (
            <>
              {order.status === 'approved' && (
                <Button 
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={updateStatus.isPending}
                  onClick={() => handleStatusUpdate('processing')}
                >
                  {updatingId === 'processing' ? 'Updating...' : 'Start Processing'}
                </Button>
              )}
              {order.status === 'processing' && (
                <Button 
                  size="sm" 
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  disabled={updateStatus.isPending}
                  onClick={() => handleStatusUpdate('ready_for_delivery')}
                >
                  {updatingId === 'ready_for_delivery' ? 'Updating...' : 'Mark as Ready'}
                </Button>
              )}
              {order.status === 'ready_for_delivery' && (
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={updateStatus.isPending}
                  onClick={() => handleStatusUpdate('out_for_delivery')}
                >
                  {updatingId === 'out_for_delivery' ? 'Updating...' : 'Ship / Dispatched'}
                </Button>
              )}
              {order.status === 'out_for_delivery' && (
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={updateStatus.isPending}
                  onClick={() => handleStatusUpdate('delivered')}
                >
                  {updatingId === 'delivered' ? 'Updating...' : 'Complete / Deliver'}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                disabled={updateStatus.isPending}
                onClick={() => handleStatusUpdate('cancelled')}
              >
                {updatingId === 'cancelled' ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            </>
          )}

          {isTerminal && (
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 px-2 py-1 bg-muted rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> No actions available (Terminal State)
            </span>
          )}
        </div>
      </div>

      {/* Progress Timeline */}
      <Card className="shadow-sm border-slate-100 overflow-hidden bg-gradient-to-r from-slate-50/50 via-white to-slate-50/50">
        <CardContent className="pt-8 pb-10">
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-5 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            {/* Progress Line */}
            {currentStepIndex !== -1 && (
              <div 
                className="absolute top-5 left-4 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
            )}

            {/* Steps */}
            <div className="relative z-10 flex justify-between">
              {steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center gap-3">
                    <div 
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 bg-white transition-all duration-300 ${
                        isActive 
                          ? 'border-primary text-primary shadow-sm scale-110' 
                          : 'border-slate-300 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="h-5 w-5 fill-primary text-white" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-semibold ${isActive ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-md uppercase mt-1">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-100 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-slate-500" /> Products and Quantities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center border text-slate-500">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.product?.name || 'Unknown Product'}</h4>
                        <p className="text-xs text-muted-foreground font-mono">ID: {item.product?.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">Price</span>
                        <span className="text-sm font-semibold text-slate-900">₹{item.unit_price}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">Quantity</span>
                        <span className="text-sm font-bold text-slate-800">x{item.quantity}</span>
                      </div>
                      <div className="text-right min-w-[70px]">
                        <span className="text-xs text-muted-foreground block">Subtotal</span>
                        <span className="text-sm font-bold text-primary">₹{item.total_price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Meta / Information Cards */}
        <div className="space-y-6">
          
          {/* Summary Card */}
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="border-b bg-slate-50/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-slate-500" /> Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">₹{order.subtotal || order.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="font-semibold">₹{order.delivery_fee || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-semibold">₹{order.tax_amount || '0.00'}</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Price:</span>
                <span className="text-xl font-extrabold text-primary">₹{order.total}</span>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 text-xs flex justify-between font-semibold">
                <span className="text-primary-800">Payment Status:</span>
                <span className="text-primary-900 uppercase">Paid / Cash on Delivery</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Address Details */}
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="border-b bg-slate-50/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-slate-500" /> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-slate-950">{order.consumer?.first_name} {order.consumer?.last_name}</h4>
                <p className="text-xs text-muted-foreground">{order.consumer?.email || 'No email provided'}</p>
                <p className="text-xs text-muted-foreground">Phone: {order.consumer?.contact_number || 'No contact number'}</p>
              </div>
              <div className="border-t pt-4 space-y-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipping Address</h5>
                {order.address ? (
                  <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p>{order.address.street}</p>
                      <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No address provided for this order.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Seller details */}
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="border-b bg-slate-50/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-slate-500" /> Merchant / Seller Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h4 className="font-bold text-slate-900">{order.seller?.first_name} {order.seller?.last_name}</h4>
              <p className="text-xs text-muted-foreground mt-1">Verified Kadal2Kadaai Partner Merchant</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
