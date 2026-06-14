import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  available_quantity: number;
  weight_unit: string;
  stock_status: string;
  product_status: string;
  category: { id: string; name: string; slug: string };
  seller: { id: string; first_name: string; last_name: string };
  is_featured: boolean;
  is_popular: boolean;
}

export function useAdminProducts(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['admin-products', page, perPage],
    queryFn: async () => {
      const { data } = await apiClient.get('/v1/admin/products', {
        params: { page, per_page: perPage },
      });
      return {
        data: data.data.data as AdminProduct[],
        meta: {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          total: data.data.total,
        },
      };
    },
  });
}

export interface CreateProductPayload {
  seller_id: string;
  category_id: string;
  name: string;
  slug: string;
  price: number;
  available_quantity: number;
  weight_unit: string;
  stock_status: string;
  product_status: string;
  short_description?: string;
  variants?: string[];
  tags?: string[];
  image?: File | null;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const formData = new FormData();

      // Append scalar fields
      const scalarFields: (keyof CreateProductPayload)[] = [
        'seller_id', 'category_id', 'name', 'slug', 'price',
        'available_quantity', 'weight_unit', 'stock_status', 'product_status',
        'short_description',
      ];

      for (const key of scalarFields) {
        const value = payload[key];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }

      // Append variants array
      if (payload.variants && payload.variants.length > 0) {
        payload.variants.forEach((v) => formData.append('variants[]', v));
      }

      // Append tags array (by name — backend creates if not exist)
      if (payload.tags && payload.tags.length > 0) {
        payload.tags.forEach((t) => formData.append('tags[]', t));
      }

      // Append image file
      if (payload.image) {
        formData.append('image', payload.image);
      }

      const { data } = await apiClient.post('/v1/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/v1/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
