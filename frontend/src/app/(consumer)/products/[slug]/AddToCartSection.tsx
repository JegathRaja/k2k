'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useAddToCart } from '@/shared/api/hooks/useCart';

export function AddToCartSection({ productId, initialQuantity = 1 }: { productId: string; initialQuantity?: number }) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      product_id: productId,
      quantity,
    });
  };

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity((q) => q + 1);

  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="flex items-center border rounded-md">
        <button 
          onClick={handleDecrease}
          disabled={quantity <= 1 || addToCartMutation.isPending}
          className="px-4 py-3 hover:bg-muted text-lg disabled:opacity-50"
        >
          -
        </button>
        <span className="px-4 font-medium min-w-[3ch] text-center">{quantity}</span>
        <button 
          onClick={handleIncrease}
          disabled={addToCartMutation.isPending}
          className="px-4 py-3 hover:bg-muted text-lg disabled:opacity-50"
        >
          +
        </button>
      </div>
      <Button 
        size="lg" 
        className="flex-1 h-auto text-lg gap-2"
        onClick={handleAddToCart}
        disabled={addToCartMutation.isPending}
      >
        {addToCartMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
        {addToCartMutation.isPending ? 'Adding to Cart...' : 'Add to Cart'}
      </Button>
    </div>
  );
}
