'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/shared/Container';
import { Grid } from '@/components/layout/shared/Grid';
import { ProductCard } from '@/components/domain/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Loader2, Anchor } from 'lucide-react';
import { useProducts } from '@/shared/api/hooks/useProducts';
import { useCategories } from '@/shared/api/hooks/useCategories';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [sort, setSort] = useState<'popular' | 'newest' | 'price_asc' | 'price_desc'>('popular');

  const { data: categories } = useCategories();
  const { data: productsData, isLoading } = useProducts({
    search: searchTerm,
    category: activeCategory,
    sort,
    per_page: 24,
  });

  const products = productsData?.data || [];

  return (
    <div className="py-12 bg-background min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Page Header & Filtering */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-white/10">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground drop-shadow-sm">Fresh Catch Catalog</h1>
            <p className="text-lg text-muted-foreground mt-2">Showing all available landings from our harbor network.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-72 shadow-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search catalog..." 
                className="pl-11 h-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 dark:border-white/10 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-base text-foreground" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select value={sort} onValueChange={(val: any) => setSort(val)}>
                <SelectTrigger className="w-[180px] h-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 dark:border-white/10 rounded-xl font-medium text-foreground">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/40 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-foreground">
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Freshly Landed</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="shrink-0 md:hidden h-12 w-12 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 dark:border-white/10 text-foreground">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
            <div className="glass-panel rounded-3xl p-6 sticky top-24 border border-white/10 shadow-sm flex flex-col max-h-[calc(100vh-120px)]">
              <h3 className="font-heading font-bold text-xl mb-6 pb-4 border-b border-border/50 text-foreground shrink-0">Categories</h3>
              <ul className="space-y-2 overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <li className="font-medium">
                  <button 
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${!activeCategory ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-white/40 hover:text-foreground'}`}
                    onClick={() => setActiveCategory(undefined)}
                  >
                    All Catch
                  </button>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeCategory === cat.slug ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-white/40 hover:text-foreground'}`}
                      onClick={() => setActiveCategory(cat.slug)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-80 glass-panel rounded-3xl text-center">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Fetching fresh catch...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
                {products.map((product: any) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id.toString()}
                    slug={product.slug}
                    name={product.name} 
                    price={product.sale_price || product.price} 
                    weight={product.weight_unit || "1kg"} 
                    category={product.category?.name || "Uncategorized"}
                    image={product.images?.[0]?.image_url}
                    isAvailable={product.available_quantity > 0}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 glass-panel rounded-3xl text-center p-8 border border-white/10">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Anchor className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No Catch Matching Your Criteria</h3>
                <p className="text-muted-foreground max-w-md">Try adjusting your filters or search terms to see what our fishermen brought in today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
