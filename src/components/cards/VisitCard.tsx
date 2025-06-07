import type { VisitPlan } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, Clock, User, Briefcase, Eye, MapPin, CheckCircle, XCircle, AlertTriangle, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VisitCardProps {
  visit: VisitPlan;
  role: 'manager' | 'sales_rep';
  className?: string;
}

const statusStyles: Record<VisitPlan['status'], string> = {
  planned: 'bg-blue-100 text-blue-700 border-blue-300',
  completed: 'bg-green-100 text-green-700 border-green-300',
  postponed: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
};

const statusIcons: Record<VisitPlan['status'], LucideIcon> = {
  planned: Clock,
  completed: CheckCircle,
  postponed: AlertTriangle,
  cancelled: XCircle,
};


export function VisitCard({ visit, role, className }: VisitCardProps) {
  const StatusIcon = statusIcons[visit.status];
  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden", className)}>
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-headline text-primary">{visit.clientName}</CardTitle>
            <CardDescription className="flex items-center text-xs">
              <Briefcase className="w-3 h-3 mr-1.5" />
              Visit Plan
            </CardDescription>
          </div>
           <Badge variant="outline" className={cn("capitalize", statusStyles[visit.status])}>
            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
            {visit.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex items-center">
          <CalendarDays className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
          <span>{format(new Date(visit.scheduledDate), 'EEE, MMM d, yyyy')} at {visit.scheduledTime}</span>
        </div>
        {role === 'manager' && visit.salesRepName && (
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
            <span>Rep: {visit.salesRepName}</span>
          </div>
        )}
        {visit.status === 'completed' && visit.checkInTime && (
           <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
            <span>Checked in at {format(new Date(visit.checkInTime), 'p')}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/20">
        <Link 
          href={role === 'manager' ? `/manager/visits/${visit.visitId}` : `/rep/visits/${visit.visitId}`} 
          passHref 
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            {visit.status === 'planned' && role === 'sales_rep' ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {visit.status === 'planned' && role === 'sales_rep' ? 'Manage Visit' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
