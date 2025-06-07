'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaterialCard } from '@/components/cards/MaterialCard';
import { mockPromotionalMaterials, mockManufacturers } from '@/lib/mock-data';
import type { PromotionalMaterial } from '@/types';
import { Search, Presentation, Filter } from 'lucide-react';

export default function PromotionalMaterialsViewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterManufacturer, setFilterManufacturer] = useState('all');

  const filteredMaterials = mockPromotionalMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || material.type === filterType;
    const matchesManufacturer = filterManufacturer === 'all' || material.manufacturerRef === filterManufacturer;
    return matchesSearch && matchesType && matchesManufacturer;
  });

  const materialTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'catalog', label: 'Catalog' },
    { value: 'brochure', label: 'Brochure' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Promotional Materials" 
        description="Browse and view available promotional materials." 
        icon={Presentation}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by type..." />
          </SelectTrigger>
          <SelectContent>
            {materialTypes.map(mt => (
              <SelectItem key={mt.value} value={mt.value}>{mt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMaterials.map(material => (
            <MaterialCard key={material.materialId} material={material} role="sales_rep" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Presentation className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">No materials found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
