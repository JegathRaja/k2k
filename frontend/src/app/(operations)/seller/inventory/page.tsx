'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSellerProducts, useUpdateSellerProduct } from '@/shared/api/hooks/useSellerProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Edit2, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SellerInventoryDashboard() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerProducts(page);
  const updateProduct = useUpdateSellerProduct();
  
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);

  const products = data?.data || [];

  const handleSaveStock = (id: string) => {
    if (newStock < 0) return;
    updateProduct.mutate({ id, payload: { available_quantity: newStock } }, {
      onSuccess: () => {
        setEditingStock(null);
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Inventory Management</h1>
        <p className="text-muted-foreground">Monitor and update your product stock levels in real-time.</p>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Loading inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No products found. Add products to manage inventory.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU / Unit</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => {
                  const qty = Number(product.available_quantity);
                  const isLow = qty > 0 && qty <= 5;
                  const isOut = qty === 0;

                  return (
                    <tr key={product.id} className={`hover:bg-slate-50/50 transition-colors ${isOut ? 'bg-red-50/20' : isLow ? 'bg-orange-50/20' : ''}`}>
                      <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                      <td className="px-6 py-4">{product.weight_unit}</td>
                      <td className="px-6 py-4">
                        {editingStock === product.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              min="0"
                              value={newStock}
                              onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border rounded"
                            />
                            <Button size="sm" onClick={() => handleSaveStock(product.id)} disabled={updateProduct.isPending && updateProduct.variables?.id === product.id}>
                              {updateProduct.isPending && updateProduct.variables?.id === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingStock(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <div className="text-lg font-semibold">{qty}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isOut ? (
                          <Badge variant="destructive" className="flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3" /> Out of Stock</Badge>
                        ) : isLow ? (
                          <Badge variant="outline" className="text-orange-600 border-orange-600 flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3" /> Low Stock</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-green-600 bg-green-100 flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> In Stock</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingStock !== product.id && (
                          <Button variant="ghost" size="sm" onClick={() => { setEditingStock(product.id); setNewStock(qty); }}>
                            <Edit2 className="w-4 h-4 mr-2" /> Update Stock
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
