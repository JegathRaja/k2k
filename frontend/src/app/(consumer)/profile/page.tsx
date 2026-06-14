'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/v1/auth/me');
      return response.data;
    }
  });

  const handleLogout = async () => {
    try {
      await api.post('/v1/auth/logout');
      localStorage.removeItem('api_token');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-destructive">Failed to load profile. Are you logged in?</div>;

  return (
    <div className="min-h-screen bg-muted/10 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold">My Profile</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-card border rounded-xl p-6 shadow-sm">
            <div className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
              {data?.first_name?.charAt(0)}{data?.last_name?.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-center">{data?.first_name} {data?.last_name}</h2>
            <p className="text-muted-foreground text-center text-sm mb-6">{data?.email}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-medium">{data?.contact_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{data?.district}, {data?.state} {data?.pincode ? `- ${data?.pincode}` : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Joined:</span>
                <span className="font-medium">{new Date(data?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Marketplace Stats</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Lifetime Orders</p>
                <p className="text-2xl font-bold">{data?.consumer_profile?.lifetime_orders || 0}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-2xl font-bold">₹{data?.consumer_profile?.lifetime_spending || '0.00'}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Loyalty Points</p>
                <p className="text-2xl font-bold">{data?.consumer_profile?.loyalty_points || 0}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Logins</p>
                <p className="text-2xl font-bold">{data?.consumer_profile?.total_logins || 0}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="p-6 border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary transition-colors text-center"
                onClick={() => router.push('/orders')}
              >
                <div className="font-bold text-lg mb-1">My Orders</div>
                <div className="text-sm text-muted-foreground">Track, return, or buy things again</div>
              </div>
              <div 
                className="p-6 border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary transition-colors text-center"
                onClick={() => router.push('/addresses')}
              >
                <div className="font-bold text-lg mb-1">My Addresses</div>
                <div className="text-sm text-muted-foreground">Edit delivery addresses for orders</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
