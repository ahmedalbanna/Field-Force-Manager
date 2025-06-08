
'use client';

import { use } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { mockPromotionalMaterials } from '@/lib/mock-data';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Presentation, ArrowLeft, Link as LinkIcon, Factory, Calendar, FileText, Video, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import type { PromotionalMaterial } from '@/types';

const typeIcons = {
  catalog: FileText,
  brochure: FileText,
  image: ImageIcon,
  video: Video,
};

export default function MaterialDetailsPage({ params: paramsPromise }: { params: Promise<{ materialId: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const material = mockPromotionalMaterials.find(m => m.materialId === params.materialId);

  if (!material) {
    notFound();
  }
  
  const Icon = typeIcons[material.type];

  return (
    <div className="space-y-6">
      <PageHeader
        title={material.title}
        description={`Details for promotional material ID: ${material.materialId}`}
        icon={Presentation}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Materials
          </Button>
        }
      />

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-2xl">{material.title}</CardTitle>
          </div>
          <CardDescription className="capitalize">{material.type} {material.manufacturerName && `by ${material.manufacturerName}`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {material.thumbnailUrl && (
            <div className="my-4">
              <Image src={material.thumbnailUrl} alt={material.title} width={400} height={250} className="rounded-md object-cover mx-auto shadow-md" data-ai-hint={`${material.type} thumbnail`} />
            </div>
          )}
          {material.description && (
            <div>
              <h3 className="font-semibold text-muted-foreground">Description</h3>
              <p className="text-sm">{material.description}</p>
            </div>
          )}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-muted-foreground flex items-center"><LinkIcon className="w-4 h-4 mr-2" />File URL</h3>
              <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{material.fileUrl}</a>
            </div>
            {material.thumbnailUrl && (
              <div>
                <h3 className="font-semibold text-muted-foreground flex items-center"><ImageIcon className="w-4 h-4 mr-2" />Thumbnail URL</h3>
                <a href={material.thumbnailUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{material.thumbnailUrl}</a>
              </div>
            )}
            {material.manufacturerName && (
               <div>
                <h3 className="font-semibold text-muted-foreground flex items-center"><Factory className="w-4 h-4 mr-2" />Manufacturer</h3>
                <p>{material.manufacturerName}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2" />Created At</h3>
              <p>{format(new Date(material.createdAt), 'PPP p')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
