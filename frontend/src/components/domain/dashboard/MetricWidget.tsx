import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricWidgetProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function MetricWidget({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs last month",
  className
}: MetricWidgetProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-bodySmall font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-h3 font-bold text-foreground">{value}</h3>
          
          {trend !== undefined && (
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 text-caption font-medium px-2 py-0.5 rounded-full",
                isPositive ? "bg-success-50 text-success-700" : "",
                isNegative ? "bg-error-50 text-error-700" : "",
                !isPositive && !isNegative ? "bg-muted text-muted-foreground" : ""
              )}>
                {isPositive && <TrendingUp className="h-3 w-3" />}
                {isNegative && <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend)}%
              </div>
              <span className="text-caption text-muted-foreground">{trendLabel}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
