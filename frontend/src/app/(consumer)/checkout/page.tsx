'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/shared/api/hooks/useCart';
import { useAddresses } from '@/shared/api/hooks/useAddresses';
import { useCheckout } from '@/shared/api/hooks/useOrders';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { data: addresses, isLoading: isAddressesLoading } = useAddresses();
  const checkout = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (isCartLoading || isAddressesLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading secure checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleCheckout = () => {
    if (!selectedAddressId) {
      setError('Please select a delivery location so we know where to send your fresh catch.');
      return;
    }
    setError('');
    checkout.mutate({ address_id: selectedAddressId, notes }, {
      onSuccess: () => {
        router.push('/checkout/success');
      },
      onError: (err: any) => {
        setError(err.message || 'Checkout failed. Please try again.');
      }
    });
  };

  const deliveryFee = 50; // hardcoded logic in backend for now
  const total = Number(cart.subtotal) + deliveryFee;

  return (
    <div className="py-12 lg:py-20 bg-background min-h-screen relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/4"></div>

      <Container className="relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <ShieldCheck className="h-10 w-10 text-primary" />
          <h1 className="text-3xl lg:text-5xl font-heading font-black text-foreground drop-shadow-sm">Secure Checkout</h1>
        </div>
        
        <div className="grid xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-8">
            
            {/* Address Selection */}
            <div className="glass-panel border border-white/10 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  Delivery Location
                </h2>
                <Link href="/addresses">
                  <Button variant="outline" size="sm" className="rounded-full px-5 font-semibold border-border">Manage</Button>
                </Link>
              </div>

              {addresses && addresses.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {addresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${selectedAddressId === address.id ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' : 'border-border/50 hover:border-primary/30 hover:bg-white/5 bg-card'}`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-lg text-foreground">{address.label}</span>
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedAddressId === address.id ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                          {selectedAddressId === address.id && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {address.street},<br />
                        {address.city}, {address.state}<br />
                        {address.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-black/5 rounded-2xl border border-dashed border-border">
                  <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-6 font-medium">Where should we deliver your catch?</p>
                  <Link href="/addresses">
                    <Button className="rounded-full px-8 bg-primary hover:bg-primary-600 shadow-md">Add an Address</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="glass-panel border border-white/10 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <span className="bg-secondary/10 p-2 rounded-lg text-secondary">📝</span>
                Delivery Notes
                <span className="text-sm font-medium text-muted-foreground ml-2">(Optional)</span>
              </h2>
              <textarea 
                className="w-full h-32 border border-border/50 rounded-2xl p-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 backdrop-blur-sm shadow-inner transition-all resize-none"
                placeholder="E.g., Call upon arrival, leave at the front door, handle with care..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-5 rounded-2xl flex items-center gap-4 border border-destructive/20 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <AlertCircle className="h-6 w-6 shrink-0" />
                <p className="font-semibold text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="xl:col-span-1">
            <div className="glass-panel border border-white/10 rounded-3xl p-8 shadow-xl sticky top-28">
              <h2 className="text-2xl font-heading font-black mb-8 pb-4 border-b border-border/50 text-foreground drop-shadow-sm">Order Summary</h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span className="text-foreground font-bold">₹{cart.subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Delivery Fee</span>
                  <span className="text-foreground font-bold">₹{deliveryFee}</span>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-2xl p-5 mb-8 border border-primary/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xl text-foreground">Total to Pay</span>
                  <span className="font-black text-3xl text-primary drop-shadow-sm">₹{total}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-3 py-1.5 rounded-md">
                  <CheckCircle2 className="w-4 h-4" />
                  Cash on Delivery
                </div>
              </div>
              
              <Button 
                className="w-full py-7 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all group bg-gradient-to-r from-primary to-secondary" 
                onClick={handleCheckout}
                disabled={checkout.isPending || !selectedAddressId}
              >
                {checkout.isPending ? <Loader2 className="h-6 w-6 animate-spin mr-3" /> : <ShieldCheck className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />}
                {checkout.isPending ? 'Processing Securely...' : 'Place Order'}
              </Button>
              
              <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4" />
                100% Secure Checkout Guarantee
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
