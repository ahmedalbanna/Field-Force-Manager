
'use client';

import { use } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { getProductById, mockClients } from '@/lib/mock-data'; // Renamed to avoid conflict & ensure mockProducts is available via getProductById
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, DollarSign, Factory, ArrowLeft, BarChart3, Users, FileText } from 'lucide-react';

// Helper function to avoid naming conflict if you have another getClientById
const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.clientId === clientId);
    return client ? client.clientName : 'Unknown Client';
}


export default function ProductDetailsPage({ params: paramsPromise }: { params: Promise<{ productId: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const product = getProductById(params.productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.productName}
        description={`Details for product ID: ${product.productId}`}
        icon={Package}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.description && (
              <div>
                <h3 className="font-semibold text-muted-foreground">Description</h3>
                <p className="text-sm">{product.description}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-muted-foreground flex items-center"><DollarSign className="w-4 h-4 mr-2" />Price</h3>
                <p>{product.price.toLocaleString(undefined, { style: 'currency', currency: product.currency })}</p>
              </div>
              {product.manufacturerName && (
                <div>
                  <h3 className="font-semibold text-muted-foreground flex items-center"><Factory className="w-4 h-4 mr-2" />Manufacturer</h3>
                  <p>{product.manufacturerName}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {product.marketAnalysis && (
          <Card className="lg:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-primary"/>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {product.marketAnalysis.casesPerHospitalAnnually && Object.keys(product.marketAnalysis.casesPerHospitalAnnually).length > 0 && (
                <div>
                  <h4 className="font-semibold text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-2"/>Cases Per Hospital (Annually)</h4>
                  <ul className="list-disc list-inside pl-1">
                    {Object.entries(product.marketAnalysis.casesPerHospitalAnnually).map(([clientId, count]) => (
                      <li key={clientId}>{getClientName(clientId)}: {count}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.marketAnalysis.competitors && product.marketAnalysis.competitors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-muted-foreground">Competitors</h4>
                  <ul className="list-disc list-inside pl-1">
                    {product.marketAnalysis.competitors.map((comp, idx) => (
                      <li key={idx}>{comp.name} - {comp.price}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.marketAnalysis.otherNotes && (
                <div>
                  <h4 className="font-semibold text-muted-foreground flex items-center"><FileText className="w-4 h-4 mr-2"/>Other Notes</h4>
                  <p className="whitespace-pre-wrap">{product.marketAnalysis.otherNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
