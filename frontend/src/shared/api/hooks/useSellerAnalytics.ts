import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface SellerDashboardStats {
  total_products: number;
  total_orders: number;
  pending_orders: number;
  // Let's assume these might be added eventually or we can calculate them
  revenue_today?: string;
  total_revenue?: string;
}

export function useSellerAnalytics() {
  return useQuery<SellerDashboardStats>({
    queryKey: ['seller', 'dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/seller/dashboard');
      return (res as unknown as { data: { data: SellerDashboardStats } }).data.data;
    },
  });
}
