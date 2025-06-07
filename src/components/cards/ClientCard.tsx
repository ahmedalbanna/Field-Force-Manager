import type { Client } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, MapPin, Phone, Mail, User, Edit, Eye } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  role: 'manager' | 'sales_rep';
  onEdit?: (client: Client) => void;
}

export function ClientCard({ client, role, onEdit }: ClientCardProps) {
  const clientTypeMap = {
    hospital_government: 'Government Hospital',
    hospital_private: 'Private Hospital',
    doctor_clinic: 'Doctor Clinic',
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-headline text-primary">{client.clientName}</CardTitle>
            <CardDescription className="flex items-center text-xs">
              <Briefcase className="w-3 h-3 mr-1.5" />
              {clientTypeMap[client.type]}
            </CardDescription>
          </div>
          {role === 'manager' && onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(client)} className="text-muted-foreground hover:text-primary">
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex items-start">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-muted-foreground" />
          <span>{client.address}</span>
        </div>
        {client.phoneNumber && (
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
            <span>{client.phoneNumber}</span>
          </div>
        )}
        {client.email && (
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
            <a href={`mailto:${client.email}`} className="hover:underline text-primary">{client.email}</a>
          </div>
        )}
        {role === 'manager' && client.assignedRepName && (
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
            <span>Assigned to: {client.assignedRepName}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/20">
        <Link href={role === 'manager' ? `/manager/clients/${client.clientId}` : `/rep/clients/${client.clientId}`} passHref className="w-full">
          <Button variant="outline" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
