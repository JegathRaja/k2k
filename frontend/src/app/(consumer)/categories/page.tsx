'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/shared/Container';
import { Grid } from '@/components/layout/shared/Grid';
import { Card, CardContent } from '@/components/ui/card';
import { Fish, Waves, Loader2 } from 'lucide-react';
import { useCategories } from '@/shared/api/hooks/useCategories';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="py-16 bg-muted/20 min-h-[calc(100vh-80px)]">
      <Container>
        <div className="max-w-2xl mb-12">
          <h1 className="text-h2 font-heading font-bold text-foreground mb-4">Explore Categories</h1>
          <p className="text-bodyLarge text-muted-foreground">
            Browse our extensive collection of premium seafood. Everything is sourced directly from verified local fishermen to ensure maximum freshness.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Loading fresh categories...</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <Grid cols="responsive-cards" gap="lg">
            {categories.map((cat) => {
              return (
                <Link href={`/products?category=${cat.slug}`} key={cat.id}>
                  <Card className="group cursor-pointer hover:border-accent-500 hover:shadow-md transition-all h-full">
                    <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                      <div className="h-24 w-24 rounded-full bg-primary-50 group-hover:bg-accent-50 text-primary-600 group-hover:text-accent-600 flex items-center justify-center transition-colors overflow-hidden border">
                        {cat.image || cat.icon ? (
                          <img src={cat.image || cat.icon || ''} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <Fish className="h-10 w-10 text-primary-400 group-hover:text-accent-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-h4 text-foreground mb-2">{cat.name}</h3>
                        <p className="text-bodyMedium text-muted-foreground mb-4 line-clamp-2">
                          {cat.description || 'Premium seafood sourced directly from local fishermen.'}
                        </p>
                        <span className="inline-block px-3 py-1 rounded-full bg-muted text-caption font-medium text-foreground group-hover:bg-accent-100 group-hover:text-accent-700 transition-colors">
                          {cat.products_count ? `${cat.products_count} items` : 'View Products'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </Grid>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border">
            <Waves className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No Categories Found</h3>
            <p className="text-slate-500 mt-2">Check back later for fresh catch categories.</p>
          </div>
        )}
      </Container>
    </div>
  );
}
