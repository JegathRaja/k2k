'use client';

import React, { useState } from 'react';
import { useOrder, useCancelOrder } from '@/shared/api/hooks/useOrders';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, MapPin, AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: order, isLoading } = useOrder(params.id);
  const cancelOrder = useCancelOrder();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order you are looking for does not exist or you don't have access.</p>
        <Link href="/orders"><Button>Back to Orders</Button></Link>
      </div>
    );
  }

  const isCancellable = order.status === 'PENDING_SELLER_APPROVAL' || order.status === 'APPROVED';

  const handleCancel = () => {
    cancelOrder.mutate({ id: order.id, reason: cancelReason }, {
      onSuccess: () => setShowCancelDialog(false)
    });
  };

  return (
    <div className="py-12 bg-muted/30 min-h-screen">
      <Container>
        <div className="mb-6">
          <Link href="/orders" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm font-medium">
            <ChevronLeft className="h-4 w-4" /> Back to My Orders
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Order #{order.order_number}</h1>
            <p className="text-muted-foreground">Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy h:mm a')}</p>
          </div>
          <div className="flex gap-4">
            <Badge className="text-sm px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-0">
              {order.status.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Items */}
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" /> Items Ordered
                </h2>
              </div>
              <div className="divide-y">
                {order.items.map(item => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-16 w-16 bg-muted/50 rounded-lg flex items-center justify-center shrink-0 border">
                        <Package className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <div>
                        <h3 className="font-bold">{item.product_snapshot.name}</h3>
                        <p className="text-sm text-muted-foreground">Category: {item.product_snapshot.category || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 w-full sm:w-auto">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Price</p>
                        <p className="font-medium">₹{item.unit_price} / {item.product_snapshot.weight_unit}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Qty</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div className="text-right flex-1 sm:flex-none">
                        <p className="text-xs text-muted-foreground mb-1">Total</p>
                        <p className="font-bold">₹{item.total_price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel Order Section */}
            {isCancellable && !showCancelDialog && (
              <div className="bg-card border rounded-xl p-6 shadow-sm border-destructive/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-destructive">Need to cancel this order?</h3>
                  <p className="text-sm text-muted-foreground">Orders can only be cancelled before they are shipped.</p>
                </div>
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => setShowCancelDialog(true)}>
                  Cancel Order
                </Button>
              </div>
            )}

            {showCancelDialog && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-destructive mb-2">Cancel Order</h3>
                <p className="text-sm text-muted-foreground mb-4">Are you sure you want to cancel this order? This action cannot be undone.</p>
                <textarea 
                  placeholder="Reason for cancellation (optional)" 
                  className="w-full border rounded-md p-3 text-sm mb-4"
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                />
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={cancelOrder.isPending}>Keep Order</Button>
                  <Button variant="destructive" onClick={handleCancel} disabled={cancelOrder.isPending}>
                    {cancelOrder.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4">Payment Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>₹{order.delivery_fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>₹{order.tax_amount}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{order.total}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">Payment Method: Cash on Delivery</p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" /> Delivery Address
              </h2>
              {order.address ? (
                <div className="text-sm">
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Address information unavailable.</p>
              )}
              
              {order.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Order Notes</h3>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{order.notes}</p>
                </div>
              )}
            </div>
            
            {/* Seller Info */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-2">Seller Information</h2>
              <p className="font-medium">{order.seller?.first_name} {order.seller?.last_name}</p>
              <p className="text-sm text-muted-foreground">Kadal2Kadaai Verified Seller</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
