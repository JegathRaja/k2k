import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'guest' | 'consumer' | 'seller' | 'admin' | 'super_admin';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: Role;
  roles?: { id: number | string; name: string }[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const TOKEN_KEY = 'api_token';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, token);
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'kadal-auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, state.token);
        }
      },
    }
  )
);
