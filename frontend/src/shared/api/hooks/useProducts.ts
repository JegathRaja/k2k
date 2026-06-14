import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../axios';
import { Product, PaginatedResponse } from '@/types/marketplace.types';

export interface UseProductsFilters {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
  sort?: 'popular' | 'newest' | 'price_asc' | 'price_desc';
}

export function useProducts(filters?: UseProductsFilters) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters?.category) params.category = filters.category;
      if (filters?.search)   params.search   = filters.search;
      if (filters?.page)     params.page      = filters.page;
      if (filters?.per_page) params.per_page  = filters.per_page;
      if (filters?.sort)     params.sort      = filters.sort;

      const { data } = await apiClient.get('/v1/marketplace/products', { params });
      // Backend returns: { success, message, data: { current_page, data: [...], ... } }
      return data.data as PaginatedResponse<Product>;
    },
    staleTime: 30_000,
  });
}

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ['product', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/marketplace/products/${slug}`);
      return data.data as Product;
    },
    staleTime: 60_000,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await apiClient.get('/v1/marketplace/products/featured');
      return data.data as Product[];
    },
    staleTime: 60_000,
  });
}

export function usePopularProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'popular'],
    queryFn: async () => {
      const { data } = await apiClient.get('/v1/marketplace/products/popular');
      return data.data as Product[];
    },
    staleTime: 60_000,
  });
}
