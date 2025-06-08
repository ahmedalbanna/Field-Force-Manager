
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from '@/components/cards/ProductCard';
import { mockProducts, mockManufacturers } from '@/lib/mock-data';
import type { Product } from '@/types';
import { PlusCircle, Search, Package } from "lucide-react";
import { ProductForm, type ProductFormData } from './components/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function ManageProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (formData: ProductFormData) => {
    const manufacturerName = mockManufacturers.find(m => m.manufacturerId === formData.manufacturerRef)?.name;
    
    let marketAnalysisData: Product['marketAnalysis'] = undefined;
    if (formData.marketAnalysis) {
        marketAnalysisData = {
            casesPerHospitalAnnually: formData.marketAnalysis.casesPerHospitalAnnually 
                ? JSON.parse(formData.marketAnalysis.casesPerHospitalAnnually) 
                : undefined,
            competitors: formData.marketAnalysis.competitors?.filter(c => c.name && c.price),
            otherNotes: formData.marketAnalysis.otherNotes
        };
    }


    if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        ...formData,
        price: Number(formData.price),
        manufacturerName,
        marketAnalysis: marketAnalysisData,
      };
      setProducts(prevProducts => prevProducts.map(p => p.productId === editingProduct.productId ? updatedProduct : p));
      toast({ title: "Product Updated", description: `${updatedProduct.productName} has been updated.` });
    } else {
      const newProduct: Product = {
        ...formData,
        productId: `prod${Date.now()}`,
        price: Number(formData.price),
        manufacturerName,
        marketAnalysis: marketAnalysisData,
      };
      setProducts(prevProducts => [newProduct, ...prevProducts]);
      toast({ title: "Product Added", description: `${newProduct.productName} has been added.` });
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      const productName = products.find(p => p.productId === productToDelete)?.productName;
      setProducts(prevProducts => prevProducts.filter(p => p.productId !== productToDelete));
      toast({ title: "Product Deleted", description: `${productName || 'Product'} has been deleted.` });
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Products"
        description="Add, modify, and view product details and market analysis."
        icon={Package}
        actions={
          <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative md:col-span-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.productId} 
              product={product} 
              role="manager" 
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">No products found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Try adjusting your search.' : 'Add a new product to get started.'}
          </p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the details for this product.' : 'Fill in the information for the new product.'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{products.find(p => p.productId === productToDelete)?.productName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
