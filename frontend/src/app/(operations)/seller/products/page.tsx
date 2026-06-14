'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSellerProducts, useDeleteSellerProduct, usePublishSellerProduct, useArchiveSellerProduct } from '@/shared/api/hooks/useSellerProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye, Power, Loader2, PlayCircle, PauseCircle } from 'lucide-react';
import { assetUrl } from '@/lib/asset-url';

export default function SellerProductsDashboard() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerProducts(page);
  const deleteProduct = useDeleteSellerProduct();
  const publishProduct = usePublishSellerProduct();
  const archiveProduct = useArchiveSellerProduct();

  const products = data?.data || [];

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    deleteProduct.mutate(id);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    if (currentStatus === 'published') {
      archiveProduct.mutate(id);
    } else {
      publishProduct.mutate(id);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">My Products</h1>
          <p className="text-muted-foreground">Manage your marketplace inventory and listings.</p>
        </div>
        <Link href="/seller/products/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Loading your products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🐟</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">You haven't listed any products. Click the button above to create your first listing and start selling.</p>
            <Link href="/seller/products/create">
              <Button>Create Product</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Inventory</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center shrink-0">
                          {product.images?.[0] ? (
                            <img src={assetUrl(product.images[0].image_url) || ''} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">🐟</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.category?.name || 'Uncategorized'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">₹{product.price} / {product.weight_unit}</div>
                      {product.sale_price && (
                        <div className="text-xs text-green-600">Sale: ₹{product.sale_price}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div><span className="font-medium text-slate-900">{product.available_quantity}</span> available</div>
                      {Number(product.available_quantity) <= 5 && (
                        <div className="text-xs text-orange-600 font-medium">Low Stock</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/products/${product.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" type="button" title="View in marketplace">
                            <Eye className="w-4 h-4 text-slate-500" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          disabled={publishProduct.isPending || archiveProduct.isPending}
                          title={product.status === 'published' ? 'Pause Product' : 'Activate Product'}
                        >
                          {product.status === 'published' ? (
                            <PauseCircle className="w-4 h-4 text-orange-500" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                        <Link href={`/seller/products/${product.id}/edit`}>
                          <Button variant="ghost" size="icon" type="button" title="Edit">
                            <Edit className="w-4 h-4 text-blue-500" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteProduct.isPending}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
