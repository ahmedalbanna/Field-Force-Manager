
'use client';

import { use } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { getVisitById, getClientById } from '@/lib/mock-data';
import { notFound, useRouter } from 'next/navigation';
import { CalendarDays, Briefcase, ArrowLeft } from 'lucide-react';
import { VisitDetails } from '@/components/visits/VisitDetails';
import type { Client, VisitPlan } from '@/types';
import { Button } from '@/components/ui/button';

export default function ManagerVisitDetailsPage({ params: paramsPromise }: { params: Promise<{ visitId: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const visit = getVisitById(params.visitId) as VisitPlan | undefined; 
  
  if (!visit) {
    notFound();
  }

  const client = getClientById(visit.clientRef) as Client | undefined; 

  // Client might not be found if data is inconsistent, handle gracefully
  if (!client) {
    console.warn(`Client with ID ${visit.clientRef} not found for visit ${visit.visitId}`);
  }
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title={client?.clientName ? `Visit: ${client.clientName}` : `Visit ID: ${visit.visitId}`}
        description={
            `Manager view of visit on ${new Date(visit.scheduledDate).toLocaleDateString()} by ${visit.salesRepName || 'Unknown Rep'}`
        }
        icon={CalendarDays}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        }
      />
      <VisitDetails visit={visit} client={client} role="manager" />
    </div>
  );
}

    