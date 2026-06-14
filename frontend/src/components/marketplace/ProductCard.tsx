import Link from 'next/link';
import { Product } from '@/types/marketplace.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Anchor } from 'lucide-react';
import { assetUrl } from '@/lib/asset-url';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const rawImage = product.images?.find(i => i.is_primary)?.image_url || product.images?.[0]?.image_url;
  const primaryImage = assetUrl(rawImage);

  return (
    <div className="group flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Image Area */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center">
        {product.is_popular && (
          <Badge className="absolute top-3 left-3 z-10 bg-accent text-white border-none shadow-md">Popular Catch</Badge>
        )}
        {product.sale_price && (
          <Badge className="absolute top-3 right-3 z-10 bg-red-500 text-white border-none shadow-md">Sale</Badge>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

        {primaryImage ? (
          <img 
            src={primaryImage} 
            alt={product.name} 
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-primary/30 group-hover:scale-110 transition-transform duration-500">
            <Anchor className="w-16 h-16 mb-2" />
          </div>
        )}

        {/* Quick Add Button (Visible on Hover) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <Button size="sm" className="bg-white/90 text-primary-900 hover:bg-white backdrop-blur-sm shadow-lg rounded-full font-semibold px-6">
            Quick View
          </Button>
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-5 relative">
        <Link href={`/categories/${product.category.slug}`} className="text-xs font-semibold text-accent hover:text-primary transition-colors mb-2 tracking-wide uppercase">
          {product.category.name}
        </Link>
        
        <Link href={`/products/${product.slug}`} className="font-heading font-bold text-lg text-foreground hover:text-primary line-clamp-2 mb-2 flex-1 leading-snug">
          {product.name}
        </Link>
        
        <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 opacity-80">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span>Sourced from {product.seller?.first_name} {product.seller?.last_name}</span>
        </div>

        <div className="flex items-end justify-between mt-auto pt-4 border-t border-border/50">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Per {product.weight_unit}</div>
            {product.sale_price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-primary">₹{product.sale_price}</span>
                <span className="text-sm font-medium text-muted-foreground line-through">₹{product.price}</span>
              </div>
            ) : (
              <span className="text-xl font-black text-foreground">₹{product.price}</span>
            )}
          </div>
          
          <Button size="icon" className="bg-primary hover:bg-secondary text-white rounded-xl shadow-md transform hover:scale-105 transition-all w-10 h-10 flex-shrink-0" aria-label="Add to cart">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
