import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  image_url?: string;
  products_count?: number;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/v1/marketplace/categories');
      return data.data as Category[];
    },
  });
}
