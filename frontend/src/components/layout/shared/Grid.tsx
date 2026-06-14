import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 'responsive-cards' | 'responsive-products';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Grid({
  className,
  as: Component = 'div',
  cols = 'responsive-cards',
  gap = 'md',
  children,
  ...props
}: GridProps) {
  const gapClasses = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-12',
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    'responsive-cards': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    'responsive-products': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  };

  return (
    <Component
      className={cn(
        'grid',
        gapClasses[gap],
        colClasses[cols],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
