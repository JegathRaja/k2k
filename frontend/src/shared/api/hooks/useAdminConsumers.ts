import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface Consumer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  status: string;
  created_at: string;
  consumer_profile?: {
    lifetime_orders: number;
    lifetime_spending: string;
  };
}

export function useAdminConsumers(page = 1, search = '') {
  return useQuery<{ data: Consumer[]; current_page: number; last_page: number; total: number }>({
    queryKey: ['admin', 'consumers', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString() });
      if (search) params.append('search', search);
      
      const res = await apiClient.get(`/v1/admin/consumers?${params.toString()}`);
      return (res as unknown as { data: { data: Consumer[]; current_page: number; last_page: number; total: number } }).data;
    },
  });
}

export function useAdminConsumer(id: string) {
  return useQuery<Consumer>({
    queryKey: ['admin', 'consumers', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiClient.get(`/v1/admin/consumers/${id}`);
      return (res as unknown as { data: { data: Consumer } }).data.data;
    },
  });
}

// Since backend might not have suspend explicitly yet, we just mock the hook pattern
// so we can call it. If it doesn't exist, we'll patch it later.
export function useSuspendConsumer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      // using patch status endpoint assuming it exists, or just PUT
      const res = await apiClient.patch(`/v1/admin/consumers/${id}/status`, { status: 'suspended', reason });
      return res;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'consumers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'consumers', id] });
    },
  });
}

export function useActivateConsumer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch(`/v1/admin/consumers/${id}/status`, { status: 'active' });
      return res;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'consumers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'consumers', id] });
    },
  });
}
