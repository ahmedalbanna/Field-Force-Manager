import { PageHeader } from '@/components/PageHeader';
import { getVisitById, getClientById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { CalendarDays, Briefcase } from 'lucide-react';
import { VisitDetailsClient } from './components/VisitDetailsClient';
import type { Client, VisitPlan } from '@/types';

export default function VisitDetailsPage({ params }: { params: { visitId: string } }) {
  const visit = getVisitById(params.visitId) as VisitPlan | undefined; // Cast for mock data
  
  if (!visit) {
    notFound();
  }

  const client = getClientById(visit.clientRef) as Client | undefined; // Cast for mock data

  if (!client) {
    // This case should ideally not happen if data is consistent
    console.warn(`Client with ID ${visit.clientRef} not found for visit ${visit.visitId}`);
  }
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title={client?.clientName || `Visit ${visit.visitId}`}
        description={`Details for your visit scheduled on ${new Date(visit.scheduledDate).toLocaleDateString()}`}
        icon={Briefcase}
      />
      <VisitDetailsClient visit={visit} client={client} />
    </div>
  );
}
