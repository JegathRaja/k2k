import React from 'react';
import { ConsumerHeader } from '@/components/layout/consumer/Header';
import { ConsumerFooter } from '@/components/layout/consumer/Footer';

export default function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="consumer-theme flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <ConsumerHeader />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <ConsumerFooter />
    </div>
  );
}
