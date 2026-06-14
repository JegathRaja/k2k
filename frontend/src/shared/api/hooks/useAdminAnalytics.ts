import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface AdminDashboardStats {
  total_users: number;
  total_sellers: number;
  total_products: number;
  total_orders: number;
  total_revenue?: string;
  recent_orders?: any[];
  recent_activity?: any[];
}

export function useAdminAnalytics() {
  return useQuery<AdminDashboardStats>({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      // Depending on whether it exists, we'll try fetching. The backend has /v1/admin/dashboard mapping to ConsumerController::dashboard
      const res = await apiClient.get('/v1/admin/dashboard');
      return (res as unknown as { data: AdminDashboardStats }).data;
    },
  });
}
