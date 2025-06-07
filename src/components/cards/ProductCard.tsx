import type { Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Assuming link to product details page
import { Package, DollarSign, Factory, Eye, Edit } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  role: 'manager' | 'sales_rep';
  onEdit?: (product: Product) => void;
}

export function ProductCard({ product, role, onEdit }: ProductCardProps) {
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
         {/* Placeholder for product image if available in future */}
         {/* <Image src="https://placehold.co/300x200" alt={product.productName} width={300} height={200} className="w-full h-32 object-cover rounded-md mb-2" /> */}

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
      <CardFooter className="p-3 bg-muted/20 border-t">
        {/* Link to product details page - to be created */}
        <Link href={role === 'manager' ? `/manager/products/${product.productId}` : `/rep/products/${product.productId}`} passHref className="w-full">
          <Button variant="outline" className="w-full text-sm">
            <Eye className="w-4 h-4 mr-2" /> View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
