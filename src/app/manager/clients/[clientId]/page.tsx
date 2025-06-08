
'use client';

import { use } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { mockClients, mockSalesReps } from '@/lib/mock-data';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Phone, Mail, User, CalendarDays, Users as UsersIcon, ArrowLeft, Globe, Map } from 'lucide-react';
import { format } from 'date-fns';

export default function ClientDetailsManagerPage({ params: paramsPromise }: { params: Promise<{ clientId: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const client = mockClients.find(c => c.clientId === params.clientId);

  if (!client) {
    notFound();
  }

  const assignedRep = mockSalesReps.find(rep => rep.userRef === client.assignedRepRef);

  const clientTypeMap = {
    hospital_government: 'Government Hospital',
    hospital_private: 'Private Hospital',
    doctor_clinic: 'Doctor\'s Clinic',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.clientName}
        description={`Details for ${clientTypeMap[client.type]}`}
        icon={Briefcase}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-muted-foreground flex items-center"><MapPin className="w-4 h-4 mr-2" />Address</h3>
              <p className="text-sm">{client.address}</p>
            </div>
            {client.location && (
                 <div>
                    <h3 className="font-semibold text-muted-foreground flex items-center"><Map className="w-4 h-4 mr-2" />Location</h3>
                    <p className="text-sm">Lat: {client.location.latitude.toFixed(4)}, Lng: {client.location.longitude.toFixed(4)}</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {client.phoneNumber && (
                <div>
                  <h3 className="font-semibold text-muted-foreground flex items-center"><Phone className="w-4 h-4 mr-2" />Phone</h3>
                  <p>{client.phoneNumber}</p>
                </div>
              )}
              {client.email && (
                <div>
                  <h3 className="font-semibold text-muted-foreground flex items-center"><Mail className="w-4 h-4 mr-2" />Email</h3>
                  <a href={`mailto:${client.email}`} className="text-primary hover:underline">{client.email}</a>
                </div>
              )}
            </div>
             {assignedRep && assignedRep.user && (
                <div>
                    <h3 className="font-semibold text-muted-foreground flex items-center"><User className="w-4 h-4 mr-2" />Assigned Representative</h3>
                    <p className="text-sm">{assignedRep.user.displayName} ({assignedRep.territory})</p>
                </div>
            )}
            <div>
                <h3 className="font-semibold text-muted-foreground flex items-center"><CalendarDays className="w-4 h-4 mr-2" />Created At</h3>
                <p className="text-sm">{format(new Date(client.createdAt), 'PPP p')}</p>
            </div>
          </CardContent>
        </Card>
        
        {(client.type.startsWith('hospital') || (client.influentialPersonnel && client.influentialPersonnel.length > 0)) && (
            <Card className="lg:col-span-1 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                {client.numDoctors && (
                    <div>
                    <h3 className="font-semibold text-muted-foreground flex items-center"><UsersIcon className="w-4 h-4 mr-2" />Number of Doctors</h3>
                    <p>{client.numDoctors}</p>
                    </div>
                )}
                {client.numOperationsBySpecialty && Object.keys(client.numOperationsBySpecialty).length > 0 && (
                    <div>
                    <h3 className="font-semibold text-muted-foreground">Operations by Specialty</h3>
                    <ul className="list-disc list-inside pl-1">
                        {Object.entries(client.numOperationsBySpecialty).map(([specialty, count]) => (
                        <li key={specialty}>{specialty}: {count}</li>
                        ))}
                    </ul>
                    </div>
                )}
                {client.influentialPersonnel && client.influentialPersonnel.length > 0 && (
                    <div>
                    <h3 className="font-semibold text-muted-foreground">Influential Personnel</h3>
                    <ul className="list-disc list-inside pl-1">
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
    </div>
  );
}
