'use client';

import React from 'react';
import Link from 'next/link';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/shared/api/hooks/useCart';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowRight, Loader2, Plus, Minus, Anchor } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { data: cart, isLoading, error } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  if (error || !cart || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-background flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <Container className="py-16 relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto glass-panel p-12 rounded-[3rem] border border-white/10 shadow-xl">
            <div className="h-28 w-28 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <Anchor className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-black text-foreground mb-3">Your net is empty</h1>
            <p className="text-muted-foreground mb-10">
              Looks like you haven't caught any fresh seafood yet. Time to hit the marketplace!
            </p>
            <Link href="/products" className="w-full">
              <Button size="lg" className="w-full rounded-full h-14 text-lg font-bold bg-primary hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all">
                Explore Fresh Catch
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20 bg-background min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0 translate-x-1/3 -translate-y-1/4"></div>

      <Container className="relative z-10">
        <h1 className="text-3xl lg:text-5xl font-heading font-black text-foreground mb-10 drop-shadow-sm">Your Catch</h1>
        
        <div className="grid xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-6">
            <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-12 gap-4 p-5 bg-black/5 border-b border-border/50 text-sm font-bold text-muted-foreground uppercase tracking-wider hidden sm:grid">
                <div className="col-span-6">Fresh Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="divide-y divide-border/50">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center hover:bg-white/5 transition-colors">
                    <div className="sm:col-span-6 flex items-center gap-5">
                      <div className="h-24 w-24 rounded-2xl bg-white/40 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain drop-shadow-sm p-2" />
                        ) : (
                          <Anchor className="h-10 w-10 text-primary/30" />
                        )}
                      </div>
                      <div>
                        <Link href={`/products/${item.product.slug}`} className="font-heading font-bold text-lg text-foreground hover:text-primary transition-colors block mb-1">
                          {item.product.name}
                        </Link>
                        <div className="text-sm font-medium text-muted-foreground/80">
                          ₹{item.unit_price} / {item.product.weight_unit}
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3 flex flex-col items-start sm:items-center justify-center mt-4 sm:mt-0">
                      <span className="sm:hidden text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Quantity</span>
                      <div className="flex items-center bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => updateItem.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                          disabled={item.quantity <= 1 || updateItem.isPending}
                          className="p-3 hover:bg-muted text-foreground disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-base">{item.quantity}</span>
                        <button 
                          onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                          disabled={updateItem.isPending}
                          className="p-3 hover:bg-muted text-foreground disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end mt-4 sm:mt-0">
                      <span className="sm:hidden text-xs uppercase tracking-wider text-muted-foreground font-bold">Total</span>
                      <span className="font-black text-xl text-primary drop-shadow-sm">₹{item.total_price}</span>
                    </div>
                    
                    <div className="sm:col-span-1 flex justify-end mt-4 sm:mt-0 border-t sm:border-0 pt-4 sm:pt-0 border-border/50">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-10 w-10 transition-all"
                        onClick={() => removeItem.mutate(item.id)}
                        disabled={removeItem.isPending}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
              <Link href="/products">
                <Button variant="link" className="text-primary hover:text-primary-600 p-0 h-auto font-bold text-base group">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Continue Shopping
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="text-destructive border-destructive/20 hover:bg-destructive/10 rounded-full px-6 font-semibold"
                onClick={() => clearCart.mutate()}
                disabled={clearCart.isPending}
              >
                Empty Net
              </Button>
            </div>
          </div>
          
          <div className="xl:col-span-1">
            <div className="glass-panel border border-white/10 rounded-3xl p-8 shadow-xl sticky top-28">
              <h2 className="text-2xl font-heading font-black mb-8 pb-4 border-b border-border/50 text-foreground drop-shadow-sm">Order Summary</h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center text-muted-foreground font-medium">
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span className="text-foreground font-bold">₹{cart.subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground font-medium">
                  <span>Delivery Estimate</span>
                  <span className="text-foreground">Calculated next</span>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-2xl p-5 mb-8 border border-primary/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-foreground">Total</span>
                  <span className="font-black text-3xl text-primary drop-shadow-sm">₹{cart.subtotal}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Taxes included. Delivery calculated at checkout.</p>
              </div>
              
              <Button 
                className="w-full py-7 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all group bg-gradient-to-r from-primary to-secondary" 
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
