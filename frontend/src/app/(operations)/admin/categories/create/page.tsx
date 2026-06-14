'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCategory } from '@/shared/api/hooks/useAdminCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'sort_order' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Category Name is required');
      return;
    }

    const payload = {
      ...formData,
      image: imagePreview || undefined,
    };

    createCategory.mutate(payload, {
      onSuccess: () => {
        toast.success('Category created successfully');
        router.push('/admin/categories');
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to create category');
      }
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/categories">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary-900">Create Category</h1>
          <p className="text-muted-foreground mt-1">Add a new category to the marketplace.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-lg shadow-sm p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Seawater Fish" 
                required 
              />
              <p className="text-xs text-muted-foreground">Slug will be auto-generated from name.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Brief description of the category..." 
                className="w-full flex min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input 
                  id="sort_order" 
                  name="sort_order" 
                  type="number" 
                  value={formData.sort_order} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2 flex flex-col justify-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    checked={formData.is_active} 
                    onChange={handleChange} 
                    className="w-4 h-4 rounded border-slate-300 text-accent-600 focus:ring-accent-600"
                  />
                  <span className="text-sm font-medium">Active (Visible)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Category Image</Label>
            
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center h-[260px] relative bg-slate-50 transition-colors hover:bg-slate-100">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md absolute inset-0 p-1" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => setImagePreview(null)} className="h-8 w-8 rounded-full opacity-90 hover:opacity-100">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Click to upload image</p>
                  <p className="text-xs text-slate-500 mb-4">SVG, PNG, JPG or GIF (max. 2MB)</p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleImageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end gap-4">
          <Link href="/admin/categories">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={createCategory.isPending} className="bg-accent-600 hover:bg-accent-700 text-white min-w-[120px]">
            {createCategory.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Create Category
          </Button>
        </div>

      </form>
    </div>
  );
}
