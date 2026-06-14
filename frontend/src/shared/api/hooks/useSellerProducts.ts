import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface SellerProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  sale_price: string | null;
  weight_unit: string;
  available_quantity: number;
  status: string;
  category_id: string;
  images: { id: string; image_url: string; is_primary: boolean }[];
  category?: { id: string; name: string };
}

export function useSellerProducts(page = 1) {
  return useQuery<{ data: SellerProduct[]; current_page: number; last_page: number; total: number }>({
    queryKey: ['seller', 'products', page],
    queryFn: async () => {
      const res = await apiClient.get(`/v1/seller/products?page=${page}`);
      return (res as unknown as { data: { data: SellerProduct[]; current_page: number; last_page: number; total: number } }).data;
    },
  });
}

export function useSellerProduct(id: string) {
  return useQuery<SellerProduct>({
    queryKey: ['seller', 'products', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiClient.get(`/v1/seller/products/${id}`);
      return (res as unknown as { data: { data: SellerProduct } }).data.data;
    },
  });
}

export function useCreateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post('/v1/seller/products', payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
    },
  });
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await apiClient.put(`/v1/seller/products/${id}`, payload);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['seller', 'products', variables.id] });
    },
  });
}

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/v1/seller/products/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
    },
  });
}

export function usePublishSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/v1/seller/products/${id}/publish`);
      return res;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['seller', 'products', id] });
    },
  });
}

export function useArchiveSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/v1/seller/products/${id}/archive`);
      return res;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['seller', 'products', id] });
    },
  });
}
