'use client';

import { PageHeader } from '@/components/PageHeader';
import { getClientById, mockVisitPlans } from '@/lib/mock-data';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Phone, Mail, User, CalendarDays, Users as UsersIcon, PlusCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import type { Client, VisitPlan } from '@/types';
import Link from 'next/link';
import { use } from 'react';

export default function ClientDetailsRepPage({ params: paramsPromise }: { params: Promise<{ clientId: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const client = getClientById(params.clientId);

  if (!client) {
    notFound();
  }
  
  // Assuming current rep is 'rep1'
  const currentRepId = 'rep1';
  if (client.assignedRepRef !== currentRepId) {
    // Basic authorization check for this mock setup
    // In a real app, this would be handled by backend or middleware
    notFound(); 
  }

  const clientVisits = mockVisitPlans
    .filter(v => v.clientRef === client.clientId && v.salesRepRef === currentRepId)
    .sort((a,b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
    .slice(0,5); // Show recent 5 visits


  const clientTypeMap = {
    hospital_government: 'Government Hospital',
    hospital_private: 'Private Hospital',
    doctor_clinic: 'Doctor\'s Clinic',
  };

  const handleAddNewVisit = () => {
    // In a real app, this might open a modal or navigate to a form
    // For now, let's assume it redirects to a general visit planning page or My Plan
    router.push('/rep/my-plan'); // Or a specific "add visit for client X" page
    console.log(`Add new visit for client: ${client.clientName}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={client.clientName}
        description={`Details for ${clientTypeMap[client.type]}`}
        icon={Briefcase}
        actions={
            <Button onClick={handleAddNewVisit}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Visit
            </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start"><MapPin className="w-4 h-4 mr-3 mt-0.5 shrink-0 text-muted-foreground" />{client.address}</div>
              {client.phoneNumber && <div className="flex items-center"><Phone className="w-4 h-4 mr-3 shrink-0 text-muted-foreground" />{client.phoneNumber}</div>}
              {client.email && <div className="flex items-center"><Mail className="w-4 h-4 mr-3 shrink-0 text-muted-foreground" /><a href={`mailto:${client.email}`} className="text-primary hover:underline">{client.email}</a></div>}
            </CardContent>
          </Card>

          {(client.type.startsWith('hospital')) && (client.numDoctors || (client.influentialPersonnel && client.influentialPersonnel.length > 0)) && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Hospital Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {client.numDoctors && <div className="flex items-center"><UsersIcon className="w-4 h-4 mr-3 shrink-0 text-muted-foreground" />Number of Doctors: {client.numDoctors}</div>}
                {client.numOperationsBySpecialty && Object.keys(client.numOperationsBySpecialty).length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">Operations by Specialty:</p>
                    <ul className="list-disc list-inside pl-5">
                      {Object.entries(client.numOperationsBySpecialty).map(([specialty, count]) => (
                        <li key={specialty}>{specialty}: {count}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {client.influentialPersonnel && client.influentialPersonnel.length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">Influential Personnel:</p>
                    <ul className="list-disc list-inside pl-5">
                      {client.influentialPersonnel.map(person => (
                        <li key={person.name}>{person.name} - <span className="text-muted-foreground">{person.role}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Recent Visit History</CardTitle>
              <CardDescription>Last 5 visits with this client.</CardDescription>
            </CardHeader>
            <CardContent>
              {clientVisits.length > 0 ? (
                <ul className="space-y-3">
                  {clientVisits.map((visit: VisitPlan) => (
                    <li key={visit.visitId} className="p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">{format(new Date(visit.scheduledDate), "MMM d, yyyy")} - {visit.scheduledTime}</p>
                            <p className="text-xs text-muted-foreground capitalize">Status: {visit.status}</p>
                        </div>
                        <Link href={`/rep/visits/${visit.visitId}`} passHref>
                            <Button variant="ghost" size="icon" className="text-primary">
                                <Eye className="w-4 h-4" />
                            </Button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No visit history found for this client.</p>
              )}
            </CardContent>
            <CardFooter>
                 <Link href="/rep/my-plan" passHref className="w-full">
                    <Button variant="outline" className="w-full">
                        <CalendarDays className="mr-2 h-4 w-4" /> View Full Plan
                    </Button>
                </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
