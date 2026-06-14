import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, ShieldCheck, Truck, BarChart3, ArrowRight } from 'lucide-react';

export default function B2BHomepage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Enterprise Hero */}
      <section className="bg-primary-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/b2b-hero.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <Container className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="outline" className="border-accent-500/50 text-accent-300 bg-accent-500/10 uppercase tracking-widest text-caption">
            Wholesale Procurement Platform
          </Badge>
          <h1 className="text-display font-heading font-bold leading-tight">
            Enterprise Seafood Procurement, <br/> Simplified.
          </h1>
          <p className="text-h6 text-primary-200 font-light max-w-2xl mx-auto">
            Source bulk quantities directly from verified coastal suppliers. Consistent pricing, guaranteed cold-chain delivery, and GST-ready invoicing for restaurants, hotels, and exporters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/procurement">
              <Button size="lg" className="w-full sm:w-auto bg-accent-500 hover:bg-accent-600 text-white border-none px-8">
                Access Catalog <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary-900 px-8">
                Create Institutional Account
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-background border-b border-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-h6">Volume Pricing</h3>
              <p className="text-bodyMedium text-muted-foreground">Dynamic pricing tiers based on minimum order quantities (MOQ).</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-success-50 rounded-lg flex items-center justify-center text-success-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-h6">GST Invoicing</h3>
              <p className="text-bodyMedium text-muted-foreground">Automated tax documentation and input tax credit ready invoices.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-accent-50 rounded-lg flex items-center justify-center text-accent-600">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-h6">Cold Chain Logistics</h3>
              <p className="text-bodyMedium text-muted-foreground">Temperature-controlled fleets ensuring 100% freshness upon delivery.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-h6">Spend Analytics</h3>
              <p className="text-bodyMedium text-muted-foreground">Track procurement spend, supplier performance, and order history easily.</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
