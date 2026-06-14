import React from 'react';
import { Container } from '@/components/layout/shared/Container';
import { Grid } from '@/components/layout/shared/Grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/domain/product/ProductCard';
import { OrderTimeline } from '@/components/domain/order/OrderTimeline';
import { MetricWidget } from '@/components/domain/dashboard/MetricWidget';
import { AlertTriangle, TrendingUp, CheckCircle, Search, Mail, Fish } from 'lucide-react';
import { EmptyState } from '@/components/ui/states/EmptyState';
import { ErrorState } from '@/components/ui/states/ErrorState';

export default function ShowcasePage() {
  return (
    <Container className="py-12 space-y-16">
      <div className="space-y-4">
        <h1 className="text-h2 font-heading font-bold">Component Showcase</h1>
        <p className="text-bodyLarge text-muted-foreground">The official Kadal2Kadaai enterprise UI system.</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-h4 font-heading font-semibold border-b border-border pb-2">1. Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Action</Button>
          <Button variant="default" disabled>Disabled State</Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h4 font-heading font-semibold border-b border-border pb-2">2. Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-bodySmall font-medium">Standard Text</label>
            <Input placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <label className="text-bodySmall font-medium">With Icon</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Email Address" className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-bodySmall font-medium">Search Context</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search catalog..." className="pl-9 bg-muted/50 border-transparent focus:bg-background" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h4 font-heading font-semibold border-b border-border pb-2">3. Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">New Arrival</Badge>
          <Badge variant="secondary">Freshwater</Badge>
          <Badge variant="outline">In Stock</Badge>
          <Badge variant="destructive">Sold Out</Badge>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h4 font-heading font-semibold border-b border-border pb-2">4. Domain: Products</h2>
        <Grid cols="responsive-cards" gap="lg">
          <ProductCard 
            id="p1" 
            slug="premium-king-fish"
            name="Premium King Fish (Seer/Vanjiram)" 
            price={1200} 
            weight="1kg" 
            category="Seawater Fish" 
          />
          <ProductCard 
            id="p2" 
            slug="tiger-prawns"
            name="Tiger Prawns" 
            price={850} 
            weight="500g" 
            category="Shellfish" 
            isAvailable={false}
          />
          <ProductCard 
            id="p3" 
            slug="fresh-mud-crab"
            name="Fresh Mud Crab" 
            price={600} 
            weight="1kg" 
            category="Crabs" 
          />
        </Grid>
      </section>

      <section className="space-y-6">
        <h2 className="text-h4 font-heading font-semibold border-b border-border pb-2">5. Domain: Dashboard & Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-bodyMedium font-medium text-muted-foreground">Order Timeline Tracker</h3>
            <OrderTimeline status="SHIPPED" />
          </div>
          <div className="space-y-4">
            <h3 className="text-bodyMedium font-medium text-muted-foreground">KPI Metric Widgets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricWidget 
                title="Total Revenue" 
                value="₹24,500" 
                icon={TrendingUp} 
                trend={12.5} 
              />
              <MetricWidget 
                title="Active Orders" 
                value="48" 
                icon={CheckCircle} 
                trend={-2.4} 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h4 font-heading font-semibold border-b border-border pb-2">6. UI States</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EmptyState 
            icon={Fish}
            title="Nothing Catching" 
            description="We couldn't find any fresh catches matching your criteria. Try adjusting your filters or changing your location." 
            action={<Button>Clear Filters</Button>}
          />
          <ErrorState 
            type="api" 
            action={<Button variant="outline">Retry Connection</Button>}
          />
        </div>
      </section>

    </Container>
  );
}
