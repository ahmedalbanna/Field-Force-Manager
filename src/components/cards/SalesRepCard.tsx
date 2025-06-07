import type { SalesRep } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, MapPin, BarChartBig, Eye } from 'lucide-react';

interface SalesRepCardProps {
  salesRep: SalesRep;
  onEdit?: (salesRep: SalesRep) => void; // Manager action
}

export function SalesRepCard({ salesRep, onEdit }: SalesRepCardProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'SR';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center gap-4 bg-muted/30">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={salesRep.user?.photoUrl} alt={salesRep.user?.displayName} data-ai-hint="profile avatar" />
          <AvatarFallback className="text-xl">{getInitials(salesRep.user?.displayName)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-headline text-primary">{salesRep.user?.displayName || 'N/A'}</CardTitle>
          <CardDescription className="text-xs">{salesRep.user?.email || 'No email'}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-sm">
        {salesRep.territory && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
            <span>Territory: {salesRep.territory}</span>
          </div>
        )}
        <div className="flex items-center">
          <BarChartBig className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
          <span>Visits: {salesRep.totalVisitsMade} completed / {salesRep.totalVisitsPlanned} planned</span>
        </div>
      </CardContent>
      <CardFooter className="p-3 bg-muted/20 border-t flex gap-2">
        <Link href={`/manager/reps/${salesRep.id}`} passHref className="flex-1">
          <Button variant="outline" className="w-full text-sm">
            <Eye className="w-4 h-4 mr-2" /> View Details
          </Button>
        </Link>
        {onEdit && (
          <Button variant="default" onClick={() => onEdit(salesRep)} className="flex-1 text-sm">
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
