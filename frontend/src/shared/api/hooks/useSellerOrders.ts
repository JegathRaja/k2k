import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface SellerOrder {
  id: string;
  order_number: string;
  status: string;
  subtotal: string;
  total: string;
  created_at: string;
  address?: { street: string; city: string; state: string; pincode: string };
  consumer?: { first_name: string; last_name: string; contact_number: string };
  items: { id: string; product_id: string; quantity: number; unit_price: string; total_price: string; product_snapshot: any }[];
}

export function useSellerOrders(page = 1) {
  return useQuery<{ data: SellerOrder[]; current_page: number; last_page: number; total: number }>({
    queryKey: ['seller', 'orders', page],
    queryFn: async () => {
      const res = await apiClient.get(`/v1/seller/orders?page=${page}`);
      return (res as unknown as { data: { data: SellerOrder[]; current_page: number; last_page: number; total: number } }).data;
    },
  });
}

export function useSellerOrder(id: string) {
  return useQuery<SellerOrder>({
    queryKey: ['seller', 'orders', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiClient.get(`/v1/seller/orders/${id}`);
      return (res as unknown as { data: { data: SellerOrder } }).data.data;
    },
  });
}

export function useApproveSellerOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch(`/v1/seller/orders/${id}/approve`);
      return res;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders', id] });
    },
  });
}

export function useRejectSellerOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await apiClient.patch(`/v1/seller/orders/${id}/reject`, { reason });
      return res;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders', id] });
    },
  });
}

export function useUpdateSellerOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiClient.patch(`/v1/seller/orders/${id}/status`, { status });
      return res;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders', id] });
    },
  });
}
