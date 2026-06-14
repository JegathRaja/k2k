'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Users, LogIn } from 'lucide-react';

export default function AdminConsumersPage() {
  const [search, setSearch] = React.useState('');

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['admin', 'consumers', search],
    queryFn: async () => {
      const res = await api.get('/v1/admin/consumers', { params: { search } });
      return res;
    }
  });

  const consumers = responseData?.data?.data || [];
  const totalConsumers = responseData?.meta?.total_consumers || 0;
  const totalLoggedInConsumers = responseData?.meta?.total_logged_in_consumers || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Consumers</h1>
        <p className="text-muted-foreground mt-1">Manage and view all registered consumers.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Registered Customers</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{isLoading ? '...' : totalConsumers}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Customers Logged In</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{isLoading ? '...' : totalLoggedInConsumers}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
            <LogIn className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search consumers by name, email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>State</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Total Logins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">Loading consumers...</TableCell>
              </TableRow>
            ) : consumers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No consumers found.</TableCell>
              </TableRow>
            ) : (
              consumers.map((consumer: any) => (
                <TableRow key={consumer.id}>
                  <TableCell className="font-medium">{consumer.first_name}</TableCell>
                  <TableCell>{consumer.last_name || '-'}</TableCell>
                  <TableCell>{consumer.email}</TableCell>
                  <TableCell>{consumer.contact_number}</TableCell>
                  <TableCell>{consumer.state || '-'}</TableCell>
                  <TableCell>{consumer.district}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {consumer.consumer_profile?.total_logins ?? 0}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
