'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { sellerProductService } from '@/services/seller-product.service';

export default function CreateProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    short_description: '',
    full_description: '',
    price: '',
    sale_price: '',
    weight_unit: 'kg',
    minimum_order_quantity: '1',
    available_quantity: '0',
    origin_location: '',
    product_status: 'DRAFT',
  });

  const [images, setImages] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Create Product
      const product = await sellerProductService.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        minimum_order_quantity: parseFloat(formData.minimum_order_quantity),
        available_quantity: parseFloat(formData.available_quantity),
        product_status: formData.product_status as any,
      });

      // 2. Upload Images
      for (const image of images) {
        await sellerProductService.uploadImage(product.id, image);
      }

      // 3. If selected Publish
      if (formData.product_status === 'PUBLISHED') {
        await sellerProductService.publishProduct(product.id);
      }

      router.push('/seller/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while creating the product.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Add New Product</h1>
        <div className="flex items-center gap-2 mt-4 text-sm font-medium">
          <span className={step >= 1 ? 'text-primary' : 'text-slate-400'}>1. Basic Info</span>
          <span className="text-slate-300">→</span>
          <span className={step >= 2 ? 'text-primary' : 'text-slate-400'}>2. Pricing & Inventory</span>
          <span className="text-slate-300">→</span>
          <span className={step >= 3 ? 'text-primary' : 'text-slate-400'}>3. Media</span>
          <span className="text-slate-300">→</span>
          <span className={step >= 4 ? 'text-primary' : 'text-slate-400'}>4. Publish</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Product Name</label>
              <input 
                name="name" value={formData.name} onChange={handleInputChange}
                className="w-full p-2 border rounded-md" placeholder="e.g. Fresh Seer Fish (Vanjiram)"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Category ID (Use Seeded ID for now: 8c893918-0f53-44d3-836e-3ad627b3c9ba)</label>
              <input 
                name="category_id" value={formData.category_id} onChange={handleInputChange}
                className="w-full p-2 border rounded-md" placeholder="Category UUID"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Origin Location</label>
              <input 
                name="origin_location" value={formData.origin_location} onChange={handleInputChange}
                className="w-full p-2 border rounded-md" placeholder="e.g. Kasimedu Harbor"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Short Description</label>
              <textarea 
                name="short_description" value={formData.short_description} onChange={handleInputChange}
                className="w-full p-2 border rounded-md" rows={3}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} disabled={!formData.name || !formData.category_id}>Next Step</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Regular Price (₹)</label>
                <input 
                  type="number" name="price" value={formData.price} onChange={handleInputChange}
                  className="w-full p-2 border rounded-md" placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Sale Price (₹) - Optional</label>
                <input 
                  type="number" name="sale_price" value={formData.sale_price} onChange={handleInputChange}
                  className="w-full p-2 border rounded-md" placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Weight Unit</label>
                <select 
                  name="weight_unit" value={formData.weight_unit} onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="kg">KG</option>
                  <option value="gram">Gram</option>
                  <option value="piece">Piece</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Minimum Order Qty</label>
                <input 
                  type="number" name="minimum_order_quantity" value={formData.minimum_order_quantity} onChange={handleInputChange}
                  className="w-full p-2 border rounded-md" step="0.1"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Available Inventory (Current Stock)</label>
              <input 
                type="number" name="available_quantity" value={formData.available_quantity} onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={!formData.price || !formData.available_quantity}>Next Step</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Product Images</h2>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-slate-50">
              <div className="text-4xl mb-4">📸</div>
              <p className="text-muted-foreground mb-4">Drag and drop images here, or click to select</p>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setImages(Array.from(e.target.files));
                  }
                }}
                className="max-w-xs mx-auto"
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-slate-100 border">
                    <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Next Step</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Review & Publish</h2>
            
            <div className="bg-slate-50 p-6 rounded-lg space-y-4">
              <h3 className="font-bold text-lg">{formData.name}</h3>
              <p className="text-muted-foreground">{formData.short_description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Price:</strong> ₹{formData.price}/{formData.weight_unit}</div>
                <div><strong>Stock:</strong> {formData.available_quantity} {formData.weight_unit}</div>
              </div>
            </div>

            <div className="grid gap-2 mt-6">
              <label className="text-sm font-medium">Publishing Action</label>
              <select 
                name="product_status" value={formData.product_status} onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="DRAFT">Save as Draft (Private)</option>
                <option value="PUBLISHED">Publish immediately (Live)</option>
              </select>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} disabled={loading}>Back</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Processing...' : 'Complete & Save Product'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
