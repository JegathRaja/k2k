import { api } from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { PaginatedResponse, Product } from '@/types/marketplace.types';

export const adminProductService = {
  getProducts: async (page = 1, perPage = 20): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(`/v1/admin/products?page=${page}&per_page=${perPage}`);
    return response.data.data as unknown as PaginatedResponse<Product>;
  },

  updateStatus: async (id: string, product_status?: string, is_featured?: boolean): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(`/v1/admin/products/${id}/status`, {
      product_status,
      is_featured,
    });
    return response.data.data as unknown as Product;
  }
};
