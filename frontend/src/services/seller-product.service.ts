import { api } from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { PaginatedResponse, Product } from '@/types/marketplace.types';

export const sellerProductService = {
  getProducts: async (page = 1, perPage = 10): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(`/v1/seller/products?page=${page}&per_page=${perPage}`);
    return response.data.data as unknown as PaginatedResponse<Product>;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/v1/seller/products/${id}`);
    return response.data.data as unknown as Product;
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/v1/seller/products', data);
    return response.data.data as unknown as Product;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/v1/seller/products/${id}`, data);
    return response.data.data as unknown as Product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/v1/seller/products/${id}`);
  },

  publishProduct: async (id: string): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>(`/v1/seller/products/${id}/publish`);
    return response.data.data as unknown as Product;
  },

  archiveProduct: async (id: string): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>(`/v1/seller/products/${id}/archive`);
    return response.data.data as unknown as Product;
  },

  uploadImage: async (id: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);
    
    // api helper might stringify body unless we skip it or use standard fetch
    // To handle FormData correctly with api helper:
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/seller/products/${id}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    
    if (!res.ok) throw new Error('Image upload failed');
    const json = await res.json();
    return json.data;
  },

  deleteImage: async (id: string, imageId: string): Promise<void> => {
    await api.delete(`/v1/seller/products/${id}/images/${imageId}`);
  }
};
