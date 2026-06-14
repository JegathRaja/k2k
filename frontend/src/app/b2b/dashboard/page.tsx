import React from 'react';
import { Container } from '@/components/layout/shared/Container';
import { MetricWidget } from '@/components/domain/dashboard/MetricWidget';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Truck, FileText, Download } from 'lucide-react';

export default function B2BProcurementDashboard() {
  return (
    <Container className="py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-heading font-bold text-foreground">Procurement Dashboard</h1>
          <p className="text-bodyMedium text-muted-foreground mt-1">Manage bulk orders, RFQs, and account spend.</p>
        </div>
        <Button className="bg-primary-900 hover:bg-primary-800">New Bulk Order</Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricWidget title="Monthly Spend (MTD)" value="₹4,85,000" icon={TrendingUp} trend={8.5} />
        <MetricWidget title="Pending Deliveries" value="3" icon={Truck} />
        <MetricWidget title="Active RFQs" value="12" icon={FileText} />
        <MetricWidget title="YTD Savings" value="₹1,24,500" icon={TrendingUp} trendLabel="via volume discounts" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Invoices & Orders */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Procurements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">PO-2026-881</TableCell>
                  <TableCell>Today</TableCell>
                  <TableCell>250 kg</TableCell>
                  <TableCell>₹1,85,000</TableCell>
                  <TableCell><Badge variant="outline" className="border-accent-500 text-accent-700 bg-accent-50">In Transit</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">PO-2026-880</TableCell>
                  <TableCell>Jun 04</TableCell>
                  <TableCell>100 kg</TableCell>
                  <TableCell>₹45,000</TableCell>
                  <TableCell><Badge variant="outline" className="border-success-500 text-success-700 bg-success-50">Delivered</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active RFQs */}
        <Card>
          <CardHeader>
            <CardTitle>Active RFQs (Negotiation)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex justify-between items-start">
                  <p className="text-bodySmall font-semibold">Tiger Prawns (500kg)</p>
                  <Badge variant="outline" className="bg-background">3 Bids</Badge>
                </div>
                <p className="text-caption text-muted-foreground">Target Price: ₹800/kg</p>
                <Button variant="outline" size="sm" className="w-full mt-2">Review Bids</Button>
              </div>
              <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex justify-between items-start">
                  <p className="text-bodySmall font-semibold">King Fish (1000kg)</p>
                  <Badge variant="outline" className="bg-background">Pending</Badge>
                </div>
                <p className="text-caption text-muted-foreground">Awaiting supplier responses...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
