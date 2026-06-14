import React from 'react';
import { OperationsSidebar } from '@/components/layout/operations/Sidebar';
import { OperationsHeader } from '@/components/layout/operations/Header';
import { AdminGuard } from '@/components/guards/AdminGuard';

export default function OperationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <div className="flex h-screen w-full bg-muted/10 overflow-hidden">
        <OperationsSidebar />
        <div className="flex flex-col flex-1 overflow-hidden w-full">
          <OperationsHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
