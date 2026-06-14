'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/shared/api/hooks/useCategories';
import { useCreateProduct, CreateProductPayload } from '@/shared/api/hooks/useAdminProducts';
import { useAuth } from '@/providers/AuthProvider';
import { Plus, Loader2, Upload, X, Tag, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

// Predefined variant options for seafood
const PRESET_VARIANTS = [
  'Fresh', 'Frozen', 'Live', 'Cleaned', 'Cut', 'Whole', 'Dried', 'Smoked',
];

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { user } = useAuth();

  // Image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Variants
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [customVariantInput, setCustomVariantInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    available_quantity: '',
    weight_unit: 'kg',
    stock_status: 'IN_STOCK',
    product_status: 'PUBLISHED',
    short_description: '',
  });

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const toggleVariant = (variant: string) => {
    setSelectedVariants(prev =>
      prev.includes(variant)
        ? prev.filter(v => v !== variant)
        : [...prev, variant]
    );
  };

  const addCustomVariant = () => {
    const trimmed = customVariantInput.trim();
    if (trimmed && !selectedVariants.includes(trimmed)) {
      setSelectedVariants([...selectedVariants, trimmed]);
    }
    setCustomVariantInput('');
  };

  const reset = () => {
    setFormData({ name: '', category_id: '', price: '', available_quantity: '', weight_unit: 'kg', stock_status: 'IN_STOCK', product_status: 'PUBLISHED', short_description: '' });
    setTags([]);
    setTagInput('');
    setSelectedVariants([]);
    setCustomVariantInput('');
    removeImage();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: CreateProductPayload = {
      seller_id: user.id,
      category_id: formData.category_id,
      name: formData.name,
      slug: generateSlug(formData.name),
      price: parseFloat(formData.price),
      available_quantity: parseFloat(formData.available_quantity),
      weight_unit: formData.weight_unit,
      stock_status: formData.stock_status,
      product_status: formData.product_status,
      short_description: formData.short_description,
      variants: selectedVariants,
      tags,
      image: imageFile,
    };

    createProduct(payload, {
      onSuccess: () => {
        toast.success('Product created successfully!');
        setOpen(false);
        reset();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to create product');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger render={<Button className="shrink-0 bg-primary-900 hover:bg-primary-800" />}>
        <Plus className="h-4 w-4 mr-2" />
        Add Product
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">

          {/* ── IMAGE UPLOAD ── */}
          <div className="grid gap-2">
            <Label>Product Image</Label>
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Click to upload image</span>
                <span className="text-xs">PNG, JPG, WEBP up to 5MB</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* ── BASIC INFO ── */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium King Fish"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Textarea
                id="short_description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Briefly describe the product..."
                className="h-20 resize-none"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="" disabled>Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── PRICING & STOCK ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" type="number" min="0" step="0.01" required value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="qty">Available Qty *</Label>
              <Input id="qty" type="number" min="0" required value={formData.available_quantity}
                onChange={(e) => setFormData({ ...formData, available_quantity: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight_unit">Weight Unit</Label>
              <select id="weight_unit" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.weight_unit} onChange={(e) => setFormData({ ...formData, weight_unit: e.target.value })}>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.product_status} onChange={(e) => setFormData({ ...formData, product_status: e.target.value })}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          {/* ── VARIANTS ── */}
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <Label className="text-base font-semibold">Product Variants</Label>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">Toggle how this product can be sold. Selected variants show on the product page.</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_VARIANTS.map((variant) => {
                const active = selectedVariants.includes(variant);
                return (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => toggleVariant(variant)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {variant}
                  </button>
                );
              })}
            </div>
            {/* Custom variant input */}
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Add custom variant (e.g., Marinated)..."
                value={customVariantInput}
                onChange={(e) => setCustomVariantInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomVariant(); } }}
                className="text-sm"
              />
              <Button type="button" variant="outline" size="sm" onClick={addCustomVariant}>Add</Button>
            </div>
            {/* Show custom variants */}
            {selectedVariants.filter(v => !PRESET_VARIANTS.includes(v)).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedVariants.filter(v => !PRESET_VARIANTS.includes(v)).map((v) => (
                  <span key={v} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-accent text-accent-foreground border border-accent">
                    {v}
                    <button type="button" onClick={() => toggleVariant(v)} className="hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── CUSTOM TAGS ── */}
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <Label className="text-base font-semibold">Custom Tags</Label>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">Tags help customers find products. Press Enter or click Add to create.</p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Coastal Catch, Premium, Festival..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className="text-sm"
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-primary-900 hover:bg-primary-800 min-w-28">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
