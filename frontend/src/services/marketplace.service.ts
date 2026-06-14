import { api } from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { Category, PaginatedResponse, Product } from '@/types/marketplace.types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const res = await api.get<ApiResponse<Category[]>>('/marketplace/categories');
    return (res as any).data;
  },

  async getBySlug(slug: string): Promise<Category> {
    const res = await api.get<ApiResponse<Category>>(`/marketplace/categories/${slug}`);
    return (res as any).data;
  }
};

export const productService = {
  async getAll(params?: Record<string, any>): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams(params as any).toString();
    const res = await api.get<ApiResponse<PaginatedResponse<Product>>>(`/marketplace/products?${query}`);
    return (res as any).data;
  },

  async getFeatured(): Promise<Product[]> {
    const res = await api.get<ApiResponse<Product[]>>('/marketplace/products/featured');
    return (res as any).data;
  },

  async getPopular(): Promise<Product[]> {
    const res = await api.get<ApiResponse<Product[]>>('/marketplace/products/popular');
    return (res as any).data;
  },

  async getBySlug(slug: string): Promise<Product> {
    const res = await api.get<ApiResponse<Product>>(`/marketplace/products/${slug}`);
    return (res as any).data;
  }
};

export const searchService = {
  async search(query: string, page = 1): Promise<{
    query: string;
    products: PaginatedResponse<Product>;
    categories: Category[];
    total_results: number;
  }> {
    const res = await api.get<ApiResponse<any>>(`/marketplace/search?q=${encodeURIComponent(query)}&page=${page}`);
    return (res as any).data;
  }
};
