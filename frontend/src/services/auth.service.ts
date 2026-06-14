import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { AuthResponse, User } from '@/types/auth.types';

export const authService = {
  async me(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/v1/auth/me');
    return (res as unknown as ApiResponse<User>).data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/v1/auth/logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('api_token');
    }
  },
};
