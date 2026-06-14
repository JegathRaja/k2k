'use client';

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setToken: (token: string) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [hasToken, setHasToken] = React.useState<boolean>(false);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHasToken(!!localStorage.getItem('api_token'));
    setIsInitialized(true);

    const handleUnauthorized = () => {
      setHasToken(false);
      queryClient.setQueryData(['me'], null);
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, [queryClient]);

  const { data: user, isLoading: isQueryLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.me(),
    enabled: hasToken,
    retry: false,
  });

  const isLoading = hasToken && isQueryLoading;

  const logout = async () => {
    try {
      if (hasToken) await authService.logout();
    } finally {
      localStorage.removeItem('api_token');
      setHasToken(false);
      queryClient.setQueryData(['me'], null);
    }
  };

  const setToken = (token: string) => {
    localStorage.setItem('api_token', token);
    setHasToken(true);
    queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  const value = {
    user: user ?? null,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    logout,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
