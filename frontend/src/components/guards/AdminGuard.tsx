'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
