'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/axios';
import { assetUrl } from '@/lib/asset-url';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart, ShieldCheck, Anchor, Star, MapPin, Clock,
  ChevronRight, Minus, Plus, Loader2, Check, Tag, Package,
  Truck, Award, Fish, RefreshCw, ArrowLeft
} from 'lucide-react';
import { useAddToCart } from '@/shared/api/hooks/useCart';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const addToCartMutation = useAddToCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await apiClient.get(`/v1/marketplace/products/${slug}`);
      return (res as any).data;
    },
    enabled: !!slug,
    retry: 1,
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate(
      { product_id: product.id, quantity },
      {
        onSuccess: () => toast.success(`${product.name} added to cart!`),
        onError: () => toast.error('Please log in to add items to cart'),
      }
    );
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 animate-pulse">
            <div className="aspect-square rounded-3xl bg-muted"></div>
            <div className="space-y-6 pt-4">
              <div className="h-4 w-24 bg-muted rounded-full"></div>
              <div className="h-12 w-3/4 bg-muted rounded-xl"></div>
              <div className="h-6 w-1/2 bg-muted rounded-full"></div>
              <div className="h-20 bg-muted rounded-2xl"></div>
              <div className="h-14 bg-muted rounded-2xl"></div>
              <div className="h-14 bg-muted rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error / Not Found
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Fish className="h-12 w-12 text-primary/40" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Product Not Found</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            This catch seems to have swum away. Try browsing our fresh catalog instead.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
            <Link href="/products"><Button>Browse Products</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const currentImageUrl = assetUrl(images[selectedImage]?.image_url);
  const variants: string[] = product.variants || [];
  const tags = product.tags || [];
  const inStock = (product.available_quantity ?? 0) > 0;
  const effectivePrice = product.sale_price ?? product.price;
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-primary transition-colors">
                {product.category.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            </>
          )}
          <span className="text-foreground font-medium truncate max-w-[180px]">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">

          {/* ── LEFT: Image Gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 border border-border/50 shadow-2xl aspect-square flex items-center justify-center group">
              {/* Badges */}
              {product.is_popular && (
                <Badge className="absolute top-5 left-5 z-20 bg-amber-500 text-white border-none shadow-lg text-xs px-3 py-1 font-bold">
                  🔥 Popular Catch
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="absolute top-5 right-5 z-20 bg-red-500 text-white border-none shadow-lg text-xs px-3 py-1 font-bold">
                  -{discount}% OFF
                </Badge>
              )}

              {/* In/Out Stock indicator */}
              <div className={`absolute bottom-5 left-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${inStock ? 'bg-green-500/20 text-green-700 border-green-300/50' : 'bg-red-500/20 text-red-700 border-red-300/50'}`}>
                <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </div>

              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-primary/20">
                  <Fish className="w-28 h-28 mb-3" />
                  <span className="text-sm text-muted-foreground">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img: any, idx: number) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === idx ? 'border-primary shadow-md shadow-primary/20 scale-105' : 'border-border/50 hover:border-primary/50 opacity-70 hover:opacity-100'}`}
                  >
                    <img
                      src={assetUrl(img.image_url) || ''}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { icon: <Truck className="h-4 w-4" />, text: 'Fast Delivery', sub: 'Same day' },
                { icon: <RefreshCw className="h-4 w-4" />, text: 'Fresh Guarantee', sub: '100% fresh' },
                { icon: <Award className="h-4 w-4" />, text: 'Quality Assured', sub: 'Verified' },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center gap-1.5 text-center p-3 rounded-2xl bg-muted/40 border border-border/30">
                  <span className="text-primary">{item.icon}</span>
                  <span className="text-xs font-semibold text-foreground leading-tight">{item.text}</span>
                  <span className="text-[10px] text-muted-foreground">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="flex flex-col">

            {/* Category Badge */}
            {product.category && (
              <Link href={`/categories/${product.category.slug}`}>
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer transition-colors">
                  {product.category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground leading-tight mb-3">
              {product.name}
            </h1>

            {/* Short description */}
            {product.short_description && (
              <p className="text-muted-foreground text-base leading-relaxed mb-5">
                {product.short_description}
              </p>
            )}

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-5 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} fill="currentColor" className="w-4 h-4 text-amber-400" />
                ))}
                <Star className="w-4 h-4 text-amber-200" fill="currentColor" />
                <span className="text-sm text-muted-foreground ml-2 font-medium">4.0 · {product.view_count || 0} views</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-5 mb-6">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Price per {product.weight_unit}</p>
              {product.sale_price ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-primary">₹{product.sale_price}</span>
                  <span className="text-xl text-muted-foreground line-through font-medium">₹{product.price}</span>
                  <Badge className="bg-red-100 text-red-600 border-red-200 font-bold text-xs">Save {discount}%</Badge>
                </div>
              ) : (
                <span className="text-4xl font-black text-foreground">₹{product.price}</span>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {product.available_quantity} {product.weight_unit} available
                {product.minimum_order_quantity > 1 && ` · Min order: ${product.minimum_order_quantity} ${product.weight_unit}`}
              </p>
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Available As</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(selectedVariant === v ? null : v)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${selectedVariant === v
                        ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105'
                        : 'bg-background text-foreground border-border hover:border-primary hover:text-primary'
                        }`}
                    >
                      {selectedVariant === v && <Check className="h-3.5 w-3.5" />}
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background shadow-sm h-14">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-4 h-full text-lg font-bold hover:bg-muted transition-colors disabled:opacity-30 text-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 font-bold text-lg text-foreground min-w-[3ch] text-center select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 h-full text-lg font-bold hover:bg-muted transition-colors text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="flex-1 h-14 text-base font-bold gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || !inStock}
              >
                {addToCartMutation.isPending ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Adding...</>
                ) : (
                  <><ShoppingCart className="h-5 w-5" /> {inStock ? 'Add to Cart' : 'Out of Stock'}</>
                )}
              </Button>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {tags.map((tag: any) => (
                  <span key={tag.id} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: <MapPin className="h-4 w-4" />, label: 'Origin', value: product.origin_location || 'Local Harbors', color: 'text-primary' },
                { icon: <Clock className="h-4 w-4" />, label: 'Freshness', value: `Up to ${product.freshness_hours || 24}h`, color: 'text-amber-500' },
                { icon: <Package className="h-4 w-4" />, label: 'Unit', value: product.weight_unit, color: 'text-secondary' },
                { icon: <ShieldCheck className="h-4 w-4" />, label: 'Min. Order', value: `${product.minimum_order_quantity || 1} ${product.weight_unit}`, color: 'text-green-600' },
              ].map((spec) => (
                <div key={spec.label} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card">
                  <span className={spec.color}>{spec.icon}</span>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{spec.label}</p>
                    <p className="text-sm font-bold text-foreground">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seller Card */}
            {product.seller && (
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                  {product.seller?.first_name?.charAt(0) || 'K'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Sourced By</p>
                  <p className="font-bold text-foreground">{product.seller?.first_name} {product.seller?.last_name}</p>
                  <p className="text-xs text-muted-foreground">Verified Fisherman ✓</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-semibold shrink-0">Verified</Badge>
              </div>
            )}
          </div>
        </div>

        {/* ── FULL DESCRIPTION SECTION ── */}
        <div className="border-t border-border/50 pt-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-heading font-bold text-foreground">About This Catch</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed text-base bg-muted/30 rounded-2xl p-6 border border-border/30">
              {product.full_description || product.short_description || (
                <p>Premium quality fresh seafood sourced directly from the coast. Enjoy the rich taste and nutrients of the ocean in every bite. Our fishermen ensure the highest standards of freshness and quality are maintained from harbor to your kitchen.</p>
              )}
            </div>

            {/* Variants detail */}
            {variants.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Available Processing Options</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {variants.map((v) => (
                    <div key={v} className="flex items-center gap-3 p-4 bg-card border border-border/50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Specifications sidebar */}
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-foreground">Specifications</h2>
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm divide-y divide-border/50">
              {[
                { label: 'Category', value: product.category?.name || '—' },
                { label: 'Weight Unit', value: product.weight_unit },
                { label: 'Available Qty', value: `${product.available_quantity} ${product.weight_unit}` },
                { label: 'Min Order', value: `${product.minimum_order_quantity || 1} ${product.weight_unit}` },
                { label: 'Max Order', value: product.maximum_order_quantity ? `${product.maximum_order_quantity} ${product.weight_unit}` : 'No limit' },
                { label: 'Origin', value: product.origin_location || 'Local Harbors' },
                { label: 'Freshness', value: `Up to ${product.freshness_hours || 24} hours` },
                { label: 'Stock Status', value: inStock ? '✓ In Stock' : '✗ Out of Stock' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm text-muted-foreground font-medium">{row.label}</span>
                  <span className="text-sm font-semibold text-foreground text-right max-w-[180px] truncate">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Re-order sticky CTA */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white shadow-xl shadow-primary/20">
              <p className="font-bold text-lg mb-1">Ready to Order?</p>
              <p className="text-white/80 text-sm mb-4">Fresh catch delivered to your door.</p>
              <Button
                className="w-full bg-white text-primary font-bold hover:bg-white/90 rounded-xl"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || !inStock}
              >
                {addToCartMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                Add {quantity} to Cart — ₹{(effectivePrice * quantity).toFixed(2)}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
