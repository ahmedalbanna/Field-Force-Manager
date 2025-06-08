
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaterialCard } from '@/components/cards/MaterialCard';
import { mockPromotionalMaterials, mockManufacturers } from '@/lib/mock-data';
import type { PromotionalMaterial } from '@/types';
import { PlusCircle, Search, Presentation, Filter } from "lucide-react";
import { MaterialForm, type MaterialFormData } from './components/MaterialForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function ManagePromotionalMaterialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterManufacturer, setFilterManufacturer] = useState('all');
  const [materials, setMaterials] = useState<PromotionalMaterial[]>(mockPromotionalMaterials);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<PromotionalMaterial | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || material.type === filterType;
    const matchesManufacturer = filterManufacturer === 'all' || material.manufacturerRef === filterManufacturer;
    return matchesSearch && matchesType && matchesManufacturer;
  });

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setIsFormOpen(true);
  };

  const handleEditMaterial = (material: PromotionalMaterial) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const handleSaveMaterial = (formData: MaterialFormData) => {
    const manufacturerName = mockManufacturers.find(m => m.manufacturerId === formData.manufacturerRef)?.name;
    if (editingMaterial) {
      const updatedMaterial: PromotionalMaterial = {
        ...editingMaterial,
        ...formData,
        manufacturerName,
        createdAt: editingMaterial.createdAt // Keep original creation date
      };
      setMaterials(prevMaterials => prevMaterials.map(m => m.materialId === editingMaterial.materialId ? updatedMaterial : m));
      toast({ title: "Material Updated", description: `${updatedMaterial.title} has been updated.` });
    } else {
      const newMaterial: PromotionalMaterial = {
        ...formData,
        materialId: `mat${Date.now()}`,
        manufacturerName,
        createdAt: new Date().toISOString(),
      };
      setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);
      toast({ title: "Material Added", description: `${newMaterial.title} has been added.` });
    }
    setIsFormOpen(false);
    setEditingMaterial(null);
  };
  
  const handleDeleteMaterial = (materialId: string) => {
    setMaterialToDelete(materialId);
  };

  const confirmDeleteMaterial = () => {
    if (materialToDelete) {
      const materialName = materials.find(m => m.materialId === materialToDelete)?.title;
      setMaterials(prevMaterials => prevMaterials.filter(m => m.materialId !== materialToDelete));
      toast({ title: "Material Deleted", description: `${materialName || 'Material'} has been deleted.` });
      setMaterialToDelete(null);
    }
  };

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
        title="Manage Promotional Materials"
        description="Upload, categorize, and manage promotional materials."
        icon={Presentation}
        actions={
          <Button onClick={handleAddMaterial} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Material
          </Button>
        }
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
            <MaterialCard 
              key={material.materialId} 
              material={material} 
              role="manager" 
              onEdit={handleEditMaterial}
              onDelete={handleDeleteMaterial}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Presentation className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">No materials found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
             {searchTerm || filterType !== 'all' || filterManufacturer !== 'all' ? 'Try adjusting your search or filters.' : 'Add a new material to get started.'}
          </p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingMaterial ? 'Edit Material' : 'Add New Material'}</DialogTitle>
            <DialogDescription>
              {editingMaterial ? 'Update the details for this material.' : 'Fill in the information for the new material.'}
            </DialogDescription>
          </DialogHeader>
          <MaterialForm
            material={editingMaterial}
            onSave={handleSaveMaterial}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!materialToDelete} onOpenChange={() => setMaterialToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the material
              "{materials.find(m => m.materialId === materialToDelete)?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMaterialToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMaterial} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
