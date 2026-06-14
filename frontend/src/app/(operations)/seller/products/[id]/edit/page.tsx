'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { sellerProductService } from '@/services/seller-product.service';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    price: '',
    available_quantity: '',
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const product = await sellerProductService.getProduct(id);
      setFormData({
        name: product.name,
        short_description: product.short_description || '',
        price: product.price.toString(),
        available_quantity: product.available_quantity.toString(),
      });
    } catch (err) {
      setError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await sellerProductService.updateProduct(id, {
        name: formData.name,
        short_description: formData.short_description,
        price: parseFloat(formData.price),
        available_quantity: parseFloat(formData.available_quantity),
      });
      router.push('/seller/products');
    } catch (err) {
      setError('Failed to update product.');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading product...</div>;

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold font-heading mb-8">Edit Product</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 shadow-sm space-y-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Product Name</label>
          <input 
            name="name" value={formData.name} onChange={handleInputChange} required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Short Description</label>
          <textarea 
            name="short_description" value={formData.short_description} onChange={handleInputChange}
            className="w-full p-2 border rounded-md" rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Price (₹)</label>
            <input 
              type="number" name="price" value={formData.price} onChange={handleInputChange} required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Available Stock</label>
            <input 
              type="number" name="available_quantity" value={formData.available_quantity} onChange={handleInputChange} required
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" type="button" onClick={() => router.push('/seller/products')} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
