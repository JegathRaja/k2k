import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface SiteSettings {
  [key: string]: any;
}

export function usePublicSettings() {
  return useQuery<SiteSettings>({
    queryKey: ['settings', 'public'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: SiteSettings }>('/v1/marketplace/settings');
      return (res as unknown as { data: SiteSettings }).data;
    },
    staleTime: 60_000 * 5, // 5 minutes
  });
}

export function useAdminSettings() {
  return useQuery<SiteSettings>({
    queryKey: ['settings', 'admin'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: SiteSettings }>('/v1/admin/settings');
      return (res as unknown as { data: SiteSettings }).data;
    },
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      const res = await apiClient.post('/v1/admin/settings', { settings });
      return (res as unknown as { data: SiteSettings }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}
