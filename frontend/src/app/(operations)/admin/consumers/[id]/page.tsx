'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';

export default function ConsumerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-consumer', id],
    queryFn: async () => {
      const response = await api.get(`/v1/admin/consumers/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8">Loading consumer details...</div>;
  if (error) return <div className="p-8 text-destructive">Failed to load consumer details.</div>;

  const { user, analytics } = data || {};

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/consumers">
          <Button variant="outline" size="sm">← Back to Consumers</Button>
        </Link>
        <h1 className="text-3xl font-heading font-bold">Consumer Detail</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Consumer Info Card */}
        <div className="lg:col-span-1 bg-card border rounded-xl p-6 shadow-sm">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-4 mx-auto">
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-center mb-1">{user?.first_name} {user?.last_name}</h2>
          <p className="text-muted-foreground text-sm text-center mb-6">{user?.email}</p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact</span>
              <span className="font-medium">{user?.contact_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">District</span>
              <span className="font-medium">{user?.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pincode</span>
              <span className="font-medium">{user?.pincode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium capitalize ${user?.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                {user?.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined</span>
              <span className="font-medium">{new Date(user?.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Login</span>
              <span className="font-medium">
                {user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Consumer Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Lifetime Orders', value: analytics?.lifetime_orders || 0 },
                { label: 'Lifetime Spending', value: `₹${Number(analytics?.lifetime_spending || 0).toFixed(2)}` },
                { label: 'Avg Order Value', value: `₹${Number(analytics?.average_order_value || 0).toFixed(2)}` },
                { label: 'Total Logins', value: analytics?.login_count || 0 },
                { label: 'Days Since Join', value: analytics?.days_since_registration || 0 },
                { label: 'Last Login', value: analytics?.last_login ? new Date(analytics.last_login).toLocaleDateString() : 'Never' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Order History</h3>
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
              Order history will appear here in Phase 3 (Order Management).
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Saved Addresses</h3>
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
              Address management coming soon.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
