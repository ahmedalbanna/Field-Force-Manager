
'use client';

import { use } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { mockSalesReps, mockUsers, mockVisitPlans } from '@/lib/mock-data';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowLeft, Mail, Phone, MapPin, Briefcase, BarChartBig, CalendarCheck, CalendarClock, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import type { SalesRep, User, VisitPlan } from '@/types';
import { VisitCard } from '@/components/cards/VisitCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SalesRepDetailsPage({ params: paramsPromise }: { params: Promise<{ repId: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  
  const salesRep = mockSalesReps.find(sr => sr.id === params.repId);
  if (!salesRep) notFound();

  const user = mockUsers.find(u => u.uid === salesRep.userRef);
  if (!user) notFound(); // Should not happen if data is consistent

  const repVisits = mockVisitPlans
    .filter(v => v.salesRepRef === user.uid)
    .sort((a,b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

  const getInitials = (name?: string) => {
    if (!name) return 'SR';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.displayName}
        description={`Details for Sales Representative (ID: ${salesRep.id})`}
        icon={UserCircle}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Representatives
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center">
                    <Avatar className="w-24 h-24 mb-2 border-2 border-primary">
                        <AvatarImage src={user.photoUrl} alt={user.displayName} data-ai-hint="profile avatar"/>
                        <AvatarFallback className="text-3xl bg-muted-foreground text-background">{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-xl">{user.displayName}</CardTitle>
                    <CardDescription className={!user.isActive ? 'text-destructive' : ''}>
                        {user.isActive ? 'Active Representative' : 'Inactive Representative'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-muted-foreground" />{user.email}</div>
                    {user.phoneNumber && <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-muted-foreground" />{user.phoneNumber}</div>}
                    {salesRep.territory && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-muted-foreground" />Territory: {salesRep.territory}</div>}
                     <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />Employee ID: {salesRep.employeeId || salesRep.id}</div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center"><BarChartBig className="w-5 h-5 mr-2 text-primary"/>Visit Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center"><CalendarClock className="w-4 h-4 mr-2"/>Planned Visits:</span>
                        <span className="font-semibold">{salesRep.totalVisitsPlanned}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center"><CalendarCheck className="w-4 h-4 mr-2"/>Completed Visits:</span>
                        <span className="font-semibold">{salesRep.totalVisitsMade}</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Recent Visit Activity</CardTitle>
              <CardDescription>Showing all visits for {user.displayName}.</CardDescription>
            </CardHeader>
            <CardContent>
              {repVisits.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-20rem)] pr-3"> {/* Adjust height as needed */}
                    <div className="space-y-4">
                    {repVisits.map((visit: VisitPlan) => (
                        <VisitCard key={visit.visitId} visit={visit} role="manager" />
                    ))}
                    </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No visit history found for this representative.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
