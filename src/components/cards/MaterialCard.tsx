import type { PromotionalMaterial } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Assuming direct link to file or viewer page
import Image from 'next/image';
import { FileText, Video, ImageIcon, Download, Eye } from 'lucide-react';

interface MaterialCardProps {
  material: PromotionalMaterial;
  role: 'manager' | 'sales_rep';
}

const typeIcons = {
  catalog: FileText,
  brochure: FileText,
  image: ImageIcon,
  video: Video,
};

export function MaterialCard({ material, role }: MaterialCardProps) {
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
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-md font-headline mb-1 leading-tight h-12 overflow-hidden">{material.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground capitalize flex items-center">
          <Icon className="w-3 h-3 mr-1.5" />{material.type} {material.manufacturerName && ` by ${material.manufacturerName}`}
        </CardDescription>
        {material.description && <p className="text-xs mt-1 text-foreground/80 h-10 overflow-hidden">{material.description}</p>}
      </CardContent>
      <CardFooter className="p-3 bg-muted/20 border-t">
        {/* In a real app, fileUrl might open a viewer or start a download */}
        <Link href={material.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="outline" className="w-full text-sm">
            <Eye className="w-4 h-4 mr-2" /> View Material
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
