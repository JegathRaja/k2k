'use client';

import React from 'react';
import { useAdminAnalytics } from '@/shared/api/hooks/useAdminAnalytics';
import { MetricWidget } from '@/components/domain/dashboard/MetricWidget';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, Users, ShoppingCart, Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h3 font-heading font-bold text-foreground">Command Center</h1>
        <p className="text-bodyMedium text-muted-foreground mt-1">Platform overview and operational health metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricWidget title="Total Consumers" value={data?.total_users?.toString() || '0'} icon={Users} />
        <MetricWidget title="Total Sellers" value={data?.total_sellers?.toString() || '0'} icon={Users} />
        <MetricWidget title="Total Products" value={data?.total_products?.toString() || '0'} icon={Package} />
        <MetricWidget title="Total Orders" value={data?.total_orders?.toString() || '0'} icon={ShoppingCart} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recent_orders && data.recent_orders.length > 0 ? (
                  data.recent_orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.order_number}</TableCell>
                      <TableCell>{order.consumer?.first_name} {order.consumer?.last_name}</TableCell>
                      <TableCell>₹{order.total}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No recent orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recent_activity && data.recent_activity.length > 0 ? (
                data.recent_activity.map((activity: any) => (
                  <div key={activity.id} className="flex flex-col pb-3 border-b border-muted last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-foreground">{activity.description}</p>
                    <span className="text-xs text-muted-foreground">
                      {activity.created_at ? new Date(activity.created_at).toLocaleTimeString() : ''}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No recent activity logs found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
