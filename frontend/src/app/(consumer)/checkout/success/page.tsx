import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Anchor } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="py-24 bg-background min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <Container className="relative z-10 flex justify-center">
        <div className="max-w-lg w-full text-center glass-panel border border-white/20 rounded-[3rem] p-10 md:p-14 shadow-2xl">
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="h-28 w-28 bg-gradient-to-tr from-primary to-emerald-400 rounded-full flex items-center justify-center shadow-inner relative z-10">
              <CheckCircle2 className="h-14 w-14 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md z-20">
              <Anchor className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 text-foreground drop-shadow-sm">Catch Secured!</h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Thank you for choosing Kadal2Kadaai. Your order has been cast and is being processed by our network of local fishermen. Prepare for a fresh delivery!
          </p>
          
          <div className="space-y-4">
            <Link href="/orders" className="block">
              <Button className="w-full h-14 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-secondary">
                Track My Order
              </Button>
            </Link>
            <Link href="/products" className="block">
              <Button variant="outline" className="w-full h-14 text-lg rounded-2xl font-bold border-border/50 hover:bg-white/5 transition-colors text-foreground">
                Return to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
