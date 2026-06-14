import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, Package, Truck, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OrderTimelineProps {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  className?: string;
}

export function OrderTimeline({ status, className }: OrderTimelineProps) {
  const steps = [
    { id: 'PENDING', label: 'Order Placed', icon: Clock },
    { id: 'PROCESSING', label: 'Processing', icon: Package },
    { id: 'SHIPPED', label: 'Shipped', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentIndex = steps.findIndex(s => s.id === status);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-h6 font-heading flex items-center gap-2">
          <Navigation className="h-5 w-5 text-accent-500" />
          Order Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex justify-between">
          {/* Connecting Line */}
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-muted z-0">
            <div 
              className="absolute top-0 left-0 h-full bg-accent-500 transition-all duration-500 ease-in-out" 
              style={{ width: `${(Math.max(currentIndex, 0) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <div 
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center border-2 bg-background transition-colors",
                    isCompleted ? "border-accent-500 text-accent-600" : "border-muted text-muted-foreground",
                    isCurrent && "ring-4 ring-accent-500/20"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-caption font-medium text-center",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
