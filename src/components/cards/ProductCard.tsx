
import type { Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, DollarSign, Factory, Eye, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  role: 'manager' | 'sales_rep';
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export function ProductCard({ product, role, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-headline text-primary">{product.productName}</CardTitle>
            <CardDescription className="text-xs flex items-center">
              <Package className="w-3 h-3 mr-1.5" /> Product ID: {product.productId}
            </CardDescription>
          </div>
           {role === 'manager' && onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(product)} className="text-muted-foreground hover:text-primary">
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-sm flex-grow">
        {product.description && <p className="text-foreground/80 text-xs mb-1 h-10 overflow-hidden">{product.description}</p>}
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
          <span>{product.price.toLocaleString(undefined, { style: 'currency', currency: product.currency })}</span>
        </div>
        {product.manufacturerName && (
          <div className="flex items-center">
            <Factory className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
            <span>{product.manufacturerName}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 bg-muted/20 border-t flex gap-2">
        <Link href={role === 'manager' ? `/manager/products/${product.productId}` : `/rep/products/${product.productId}`} passHref className="flex-1">
          <Button variant="outline" className="w-full text-sm">
            <Eye className="w-4 h-4 mr-2" /> View Details
          </Button>
        </Link>
        {role === 'manager' && onDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(product.productId)} className="flex-1 text-sm">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
