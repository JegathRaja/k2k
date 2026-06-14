'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { useAdminProducts } from '@/shared/api/hooks/useAdminProducts';
import { AddProductDialog } from './components/AddProductDialog';

export default function AdminProductsPage() {
  const { data, isLoading } = useAdminProducts(1, 20);
  const products = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 font-heading font-bold text-foreground">Inventory Management</h1>
          <p className="text-bodyMedium text-muted-foreground mt-1">Manage global product catalog and stock levels.</p>
        </div>
        <AddProductDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-muted/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search inventory by name or SKU..." className="pl-9 h-9 bg-background" />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10">
                <TableHead className="w-[50px]"><input type="checkbox" className="rounded border-input" /></TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No products found. Click "Add Product" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => {
                  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
                  const imgSrc = product.images?.[0]?.image_url
                    ? `${BACKEND}${product.images[0].image_url}`
                    : null;

                  return (
                  <TableRow key={product.id}>
                    <TableCell><input type="checkbox" className="rounded border-input" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-muted border border-border flex items-center justify-center shrink-0 text-muted-foreground text-xs">
                            No img
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground leading-tight">{product.name}</p>
                          {product.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.tags.slice(0, 3).map((tag: any) => (
                                <span key={tag.id} className="text-xs px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell className={product.available_quantity === 0 ? "text-error-600 font-medium" : ""}>
                      {product.available_quantity} {product.weight_unit}
                    </TableCell>
                    <TableCell>
                      {product.available_quantity > 0 ? (
                        <Badge variant="outline" className="border-success-500 text-success-700 bg-success-50">In Stock</Badge>
                      ) : (
                        <Badge variant="outline" className="border-error-500 text-error-700 bg-error-50">Out of Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          
          <div className="p-4 border-t border-border flex items-center justify-between text-bodySmall text-muted-foreground bg-muted/10">
            <p>Showing {products.length} items</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
