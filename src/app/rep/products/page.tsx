'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/cards/ProductCard';
import { mockProducts, mockManufacturers } from '@/lib/mock-data';
import { Search, Package, Filter } from 'lucide-react';

export default function ProductsViewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState('all');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesManufacturer = filterManufacturer === 'all' || product.manufacturerRef === filterManufacturer;
    return matchesSearch && matchesManufacturer;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Products" 
        description="Browse product list, price information, and market analysis." 
        icon={Package}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select value={filterManufacturer} onValueChange={setFilterManufacturer}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by manufacturer..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            {mockManufacturers.map(manu => (
              <SelectItem key={manu.manufacturerId} value={manu.manufacturerId}>{manu.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.productId} product={product} role="sales_rep" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">No products found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
