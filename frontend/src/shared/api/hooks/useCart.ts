import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  weight_unit: string;
  stock_status: string;
  image: string | null;
  category: { id: string; name: string; slug: string } | null;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: CartProduct;
}

export interface Cart {
  id: string;
  subtotal: number;
  total_items: number;
  items: CartItem[];
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useCart() {
  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Cart }>('/v1/cart');
      return (res as unknown as { data: Cart }).data;
    },
    staleTime: 30_000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { product_id: string; quantity: number }) => {
      const res = await apiClient.post('/v1/cart/items', payload);
      return (res as unknown as { data: Cart }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const res = await apiClient.put(`/v1/cart/items/${id}`, { quantity });
      return (res as unknown as { data: Cart }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/v1/cart/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete('/v1/cart');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
