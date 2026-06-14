import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface Seller {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  status: string;
  created_at: string;
}

export function useAdminSellers(page = 1, search = '') {
  return useQuery<{ data: Seller[]; current_page: number; last_page: number; total: number }>({
    queryKey: ['admin', 'sellers', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString() });
      if (search) params.append('search', search);
      
      // Fallback to consumers endpoint filtered by role if sellers endpoint doesn't exist yet
      // The implementation plan mentions this might need backend work. We'll map it to a reasonable path.
      const res = await apiClient.get(`/v1/admin/sellers?${params.toString()}`);
      return (res as unknown as { data: { data: Seller[]; current_page: number; last_page: number; total: number } }).data;
    },
  });
}

export function useAdminSeller(id: string) {
  return useQuery<Seller>({
    queryKey: ['admin', 'sellers', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiClient.get(`/v1/admin/sellers/${id}`);
      return (res as unknown as { data: { data: Seller } }).data.data;
    },
  });
}

export function useApproveSeller() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch(`/v1/admin/sellers/${id}/approve`);
      return res;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers', id] });
    },
  });
}

export function useSuspendSeller() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await apiClient.patch(`/v1/admin/sellers/${id}/suspend`, { reason });
      return res;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers', id] });
    },
  });
}
