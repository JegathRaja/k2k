'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminSellers, useApproveSeller, useSuspendSeller } from '@/shared/api/hooks/useAdminSellers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Ban, CheckCircle, Search, Eye, Store } from 'lucide-react';

export default function AdminSellersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useAdminSellers(page, search);
  const approveSeller = useApproveSeller();
  const suspendSeller = useSuspendSeller();

  const handleSuspend = (id: string) => {
    if (!prompt('Enter reason for suspension:')) return;
    suspendSeller.mutate({ id, reason: 'Admin suspended' });
  };

  const handleApprove = (id: string) => {
    approveSeller.mutate(id);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Seller Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage marketplace vendors.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, business..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Seller Name</th>
                <th className="px-6 py-4 font-medium">Contact Info</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    Loading sellers...
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No sellers found.</td></tr>
              ) : (
                data?.data?.map((seller: any) => (
                  <tr key={seller.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{seller.first_name} {seller.last_name}</div>
                          <div className="text-xs text-muted-foreground">{seller.business_name || 'Individual Seller'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{seller.contact_number || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">{seller.email}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(seller.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {seller.status === 'suspended' ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : seller.status === 'pending' ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Pending Review</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {seller.status === 'pending' ? (
                          <Button variant="outline" size="sm" onClick={() => handleApprove(seller.id)} disabled={approveSeller.isPending} className="text-green-600 border-green-200 hover:bg-green-50">
                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                          </Button>
                        ) : seller.status === 'suspended' ? (
                          <Button variant="outline" size="sm" onClick={() => handleApprove(seller.id)} disabled={approveSeller.isPending} className="text-green-600 border-green-200 hover:bg-green-50">
                            <CheckCircle className="w-4 h-4 mr-1" /> Reactivate
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleSuspend(seller.id)} disabled={suspendSeller.isPending} className="text-red-600 border-red-200 hover:bg-red-50">
                            <Ban className="w-4 h-4 mr-1" /> Suspend
                          </Button>
                        )}
                        <Link href={`/admin/sellers/${seller.id}`}>
                          <Button variant="ghost" size="icon" title="View Store">
                            <Eye className="w-4 h-4 text-slate-500" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data && data.last_page > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Page {data.current_page} of {data.last_page}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={data.current_page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={data.current_page === data.last_page} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
