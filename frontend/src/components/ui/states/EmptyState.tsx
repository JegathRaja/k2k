import React from 'react';
import { SearchX, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-muted/20", className)}>
      <div className="h-20 w-20 rounded-full bg-primary-50 flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-primary-400" />
      </div>
      <h3 className="font-heading text-h5 font-bold text-foreground mb-2">{title}</h3>
      <p className="text-bodyMedium text-muted-foreground max-w-sm mx-auto mb-8">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
