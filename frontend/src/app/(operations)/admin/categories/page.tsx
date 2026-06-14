'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminCategories, useDeleteCategory } from '@/shared/api/hooks/useAdminCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2, Edit2, Search, Filter } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const deleteCategory = useDeleteCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All associated products may be affected.')) return;
    deleteCategory.mutate(id);
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cat.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : 
                          (statusFilter === 'active' ? cat.is_active : !cat.is_active);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary-900">Category Management</h1>
          <p className="text-muted-foreground mt-1">Manage global product categories for the consumer marketplace.</p>
        </div>
        <Link href="/admin/categories/create">
          <Button className="gap-2 bg-accent-600 hover:bg-accent-700 text-white">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search categories by name or slug..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select 
              className="border rounded-md px-3 py-2 text-sm bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-600" />
            <p>Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No categories found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-xs uppercase text-slate-600 border-b">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  <th className="px-6 py-4 w-16 text-center">Image</th>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {cat.image || cat.icon ? (
                        <img src={cat.image || cat.icon || ''} alt={cat.name} className="w-10 h-10 object-cover rounded-md mx-auto bg-slate-100 border" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-md mx-auto flex items-center justify-center border">
                          <span className="text-slate-400 text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{cat.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">{cat.description || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cat.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/categories/${cat.id}/edit`}>
                          <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-red-50"
                          onClick={() => handleDelete(cat.id)} 
                          disabled={deleteCategory.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
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
