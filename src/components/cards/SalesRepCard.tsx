
import type { SalesRep } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, MapPin, BarChartBig, Eye, Edit, Trash2 } from 'lucide-react';

interface SalesRepCardProps {
  salesRep: SalesRep;
  onEdit?: (salesRep: SalesRep) => void;
  onDelete?: (salesRepId: string) => void;
}

export function SalesRepCard({ salesRep, onEdit, onDelete }: SalesRepCardProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'SR';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center gap-4 bg-muted/30">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={salesRep.user?.photoUrl} alt={salesRep.user?.displayName} data-ai-hint="profile avatar" />
          <AvatarFallback className="text-xl bg-muted-foreground text-background">{getInitials(salesRep.user?.displayName)}</AvatarFallback>
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
         {salesRep.user && !salesRep.user.isActive && (
          <p className="text-xs text-destructive">This representative is inactive.</p>
        )}
      </CardContent>
      <CardFooter className="p-3 bg-muted/20 border-t flex gap-2">
        <Link href={`/manager/reps/${salesRep.id}`} passHref className="flex-1">
          <Button variant="outline" className="w-full text-sm">
            <Eye className="w-4 h-4 mr-2" /> View
          </Button>
        </Link>
        {onEdit && (
          <Button variant="default" onClick={() => onEdit(salesRep)} className="flex-1 text-sm">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        )}
        {onDelete && (
           <Button variant="destructive" size="sm" onClick={() => onDelete(salesRep.id)} className="flex-1 text-sm">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
