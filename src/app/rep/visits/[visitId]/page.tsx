
'use client';

import { use } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { getVisitById, getClientById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { CalendarDays, Briefcase } from 'lucide-react';
import { VisitDetails } from '@/components/visits/VisitDetails'; // Updated import path
import type { Client, VisitPlan } from '@/types';

export default function VisitDetailsPage({ params: paramsPromise }: { params: Promise<{ visitId: string }> }) {
  const params = use(paramsPromise);
  const visit = getVisitById(params.visitId) as VisitPlan | undefined; 
  
  if (!visit) {
    notFound();
  }

  // Basic authorization for rep (mock)
  const currentRepId = 'rep1'; // Replace with actual auth logic
  if (visit.salesRepRef !== currentRepId) {
    // notFound(); // Or redirect to an unauthorized page
  }

  const client = getClientById(visit.clientRef) as Client | undefined; 

  if (!client) {
    console.warn(`Client with ID ${visit.clientRef} not found for visit ${visit.visitId}`);
  }
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title={client?.clientName || `Visit ${visit.visitId}`}
        description={`Details for your visit scheduled on ${new Date(visit.scheduledDate).toLocaleDateString()}`}
        icon={Briefcase}
      />
      <VisitDetails visit={visit} client={client} role="sales_rep" />
    </div>
  );
}

    