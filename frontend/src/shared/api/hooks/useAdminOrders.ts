import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  total: string;
  created_at: string;
  consumer: { id: string; first_name: string; last_name: string };
  seller: { id: string; first_name: string; last_name: string };
  items: any[];
}

export function useAdminOrders(page = 1, filters: { status?: string; search?: string } = {}) {
  return useQuery<{ data: AdminOrder[]; current_page: number; last_page: number; total: number }>({
    queryKey: ['admin', 'orders', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString() });
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const res = await apiClient.get(`/v1/admin/orders?${params.toString()}`);
      return (res as unknown as { data: { data: AdminOrder[]; current_page: number; last_page: number; total: number } }).data;
    },
  });
}

export function useAdminOrder(id: string) {
  return useQuery<AdminOrder>({
    queryKey: ['admin', 'orders', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiClient.get(`/v1/admin/orders/${id}`);
      return (res as unknown as { data: { data: AdminOrder } }).data.data;
    },
  });
}
