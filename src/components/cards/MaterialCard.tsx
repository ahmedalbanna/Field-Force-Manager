
import type { PromotionalMaterial } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Video, ImageIcon, Download, Eye, Edit, Trash2 } from 'lucide-react';

interface MaterialCardProps {
  material: PromotionalMaterial;
  role: 'manager' | 'sales_rep';
  onEdit?: (material: PromotionalMaterial) => void;
  onDelete?: (materialId: string) => void;
}

const typeIcons = {
  catalog: FileText,
  brochure: FileText,
  image: ImageIcon,
  video: Video,
};

export function MaterialCard({ material, role, onEdit, onDelete }: MaterialCardProps) {
  const Icon = typeIcons[material.type];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      <CardHeader className="p-0 relative">
        {material.thumbnailUrl ? (
          <Image 
            src={material.thumbnailUrl} 
            alt={material.title} 
            width={300} 
            height={200} 
            className="w-full h-40 object-cover" 
            data-ai-hint={`${material.type} document`}
          />
        ) : (
          <div className="w-full h-40 bg-muted flex items-center justify-center">
            <Icon className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
         {role === 'manager' && onEdit && (
          <Button variant="ghost" size="icon" onClick={() => onEdit(material)} className="absolute top-1 right-1 bg-card/70 text-muted-foreground hover:text-primary hover:bg-card">
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-md font-headline mb-1 leading-tight h-12 overflow-hidden">{material.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground capitalize flex items-center">
          <Icon className="w-3 h-3 mr-1.5" />{material.type} {material.manufacturerName && ` by ${material.manufacturerName}`}
        </CardDescription>
        {material.description && <p className="text-xs mt-1 text-foreground/80 h-10 overflow-hidden">{material.description}</p>}
      </CardContent>
      <CardFooter className="p-3 bg-muted/20 border-t flex gap-2">
        <Link 
          href={role === 'manager' ? `/manager/materials/${material.materialId}` : (material.fileUrl || '#')} 
          target={role === 'sales_rep' ? "_blank" : "_self"} 
          rel={role === 'sales_rep' ? "noopener noreferrer" : ""} 
          className="flex-1"
        >
          <Button variant="outline" className="w-full text-sm">
            <Eye className="w-4 h-4 mr-2" /> View {role === 'manager' ? 'Details' : 'Material'}
          </Button>
        </Link>
         {role === 'manager' && onDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(material.materialId)} className="flex-1 text-sm">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
