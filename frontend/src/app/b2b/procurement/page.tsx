import React from 'react';
import { Container } from '@/components/layout/shared/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ShoppingCart } from 'lucide-react';

export default function ProcurementCatalogPage() {
  return (
    <Container className="py-8 space-y-6 min-h-[calc(100vh-160px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 font-heading font-bold text-foreground">Bulk Wholesale Catalog</h1>
          <p className="text-bodyMedium text-muted-foreground mt-1">High-density procurement view. Prices are indicative and exclude GST.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-muted/20">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search catalog by species or SKU..." className="pl-9 h-10 bg-background" />
            </div>
            <Button variant="outline" className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 text-bodySmall uppercase tracking-wider">
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>MOQ</TableHead>
                <TableHead>Lead Time</TableHead>
                <TableHead>Wholesale Price</TableHead>
                <TableHead className="w-[180px]">Quantity (kg)</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <p className="font-semibold text-foreground">Premium King Fish (Vanjiram)</p>
                  <p className="text-caption text-muted-foreground flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] py-0">Verified Supplier</Badge>
                  </p>
                </TableCell>
                <TableCell>Seawater</TableCell>
                <TableCell className="font-medium">50 kg</TableCell>
                <TableCell>24 Hours</TableCell>
                <TableCell>
                  <p className="font-bold text-primary-600">₹1,100 / kg</p>
                  <p className="text-[10px] text-muted-foreground line-through">Retail: ₹1,250</p>
                </TableCell>
                <TableCell>
                  <Input type="number" defaultValue={50} min={50} className="w-24 h-9" />
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" className="bg-accent-600 hover:bg-accent-700 text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add
                  </Button>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <p className="font-semibold text-foreground">Tiger Prawns (Large)</p>
                  <p className="text-caption text-muted-foreground flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] py-0">Top Rated</Badge>
                  </p>
                </TableCell>
                <TableCell>Shellfish</TableCell>
                <TableCell className="font-medium">100 kg</TableCell>
                <TableCell>48 Hours</TableCell>
                <TableCell>
                  <p className="font-bold text-primary-600">₹750 / kg</p>
                  <p className="text-[10px] text-muted-foreground line-through">Retail: ₹850</p>
                </TableCell>
                <TableCell>
                  <Input type="number" defaultValue={100} min={100} className="w-24 h-9" />
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" className="bg-accent-600 hover:bg-accent-700 text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add
                  </Button>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}
