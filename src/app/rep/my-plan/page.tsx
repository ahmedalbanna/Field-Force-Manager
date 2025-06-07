'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Calendar } from '@/components/ui/calendar';
import { VisitCard } from '@/components/cards/VisitCard';
import { mockVisitPlans } from '@/lib/mock-data';
import type { VisitPlan } from '@/types';
import { CalendarDays, ListFilter } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MyVisitsPlanPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterStatus, setFilterStatus] = useState<'all' | VisitPlan['status']>('all');

  // Assuming current rep is 'rep1'
  const currentRepId = 'rep1';
  const repVisits = mockVisitPlans.filter(v => v.salesRepRef === currentRepId);

  const visitsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return repVisits.filter(visit => 
      isSameDay(new Date(visit.scheduledDate), selectedDate) &&
      (filterStatus === 'all' || visit.status === filterStatus)
    ).sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime() || a.scheduledTime.localeCompare(b.scheduledTime));
  }, [selectedDate, repVisits, filterStatus]);

  const eventDays = useMemo(() => {
    return repVisits.map(visit => new Date(visit.scheduledDate));
  }, [repVisits]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Visit Plan" 
        description="View and manage your scheduled visits." 
        icon={CalendarDays}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card p-4 rounded-lg shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
            modifiers={{ eventDays: eventDays }}
            modifiersClassNames={{
              eventDays: 'bg-primary/20 text-primary-foreground rounded-full',
            }}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold font-headline">
              Visits for: {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
            </h2>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
              <SelectTrigger className="w-[180px]">
                <ListFilter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="postponed">Postponed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visitsForSelectedDate.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-18rem)] pr-3"> {/* Adjust height as needed */}
              <div className="space-y-4">
                {visitsForSelectedDate.map(visit => (
                  <VisitCard key={visit.visitId} visit={visit} role="sales_rep" />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg shadow-sm">
              <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">No visits found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedDate ? 
                  (filterStatus === 'all' ? `No visits scheduled for ${format(selectedDate, 'PPP')}.` : `No visits with status "${filterStatus}" for ${format(selectedDate, 'PPP')}.`)
                  : 'Please select a date to view visits.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
