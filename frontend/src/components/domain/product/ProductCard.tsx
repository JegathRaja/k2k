'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Anchor, ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAddToCart } from '@/shared/api/hooks/useCart';
import Link from 'next/link';
import { assetUrl } from '@/lib/asset-url';

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency?: string;
  weight: string;
  image?: string | null;
  category: string;
  isAvailable?: boolean;
  className?: string;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  currency = '₹',
  weight,
  image,
  category,
  isAvailable = true,
  className
}: ProductCardProps) {
  const addToCartMutation = useAddToCart();
  const resolvedImage = assetUrl(image);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartMutation.mutate({
      product_id: id,
      quantity: 1,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className={cn("overflow-hidden group h-full flex flex-col rounded-2xl border border-border/60 bg-card hover:shadow-xl transition-all duration-300 relative", className)}>
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <Link href={`/products/${slug}`} className="flex-1 flex flex-col z-10">
          <div className="aspect-[4/3] bg-muted/20 relative flex items-center justify-center p-4 overflow-hidden border-b border-border/40">
            {/* Dark overlay on hover for better image contrast */}
            <div className="absolute inset-0 bg-primary-900/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

            {resolvedImage ? (
              <img src={resolvedImage} alt={name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out z-10 relative" />
            ) : (
              <Anchor className="h-12 w-12 text-primary/20 dark:text-primary/40 group-hover:scale-110 transition-transform duration-700 z-10 relative" />
            )}
            
            <div className="absolute top-3 left-3 z-20">
              <Badge className="bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 backdrop-blur-md shadow-sm border border-border/50 font-semibold uppercase tracking-wider text-[9px] px-2 py-0.5">
                {category}
              </Badge>
            </div>
            
            {!isAvailable && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-30">
                <Badge variant="destructive" className="text-xs px-3 py-1 shadow-lg shadow-red-500/20">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-4 flex-1 flex flex-col justify-between relative bg-card">
            <div>
              <h4 className="font-semibold text-sm md:text-base text-foreground line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors leading-snug" title={name}>{name}</h4>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Per {weight}</p>
                <p className="text-lg sm:text-xl font-bold text-primary dark:text-primary-400">
                  {currency}{price}
                </p>
              </div>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-4 pt-0 z-10 bg-card relative">
          <Button 
            className="w-full bg-primary hover:bg-primary-600 text-white rounded-lg h-10 font-semibold text-sm shadow-md shadow-primary/10 transition-colors" 
            disabled={!isAvailable || addToCartMutation.isPending}
            onClick={handleAddToCart}
          >
            {addToCartMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
            {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

