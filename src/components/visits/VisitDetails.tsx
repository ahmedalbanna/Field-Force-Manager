
'use client';

import { useState, useEffect, use } from 'react';
import type { VisitPlan, Client } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarDays, Clock, MapPin, User, Edit, Save, Play, StopCircle, AlertTriangle, XCircle, Loader2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { suggestNextSteps, type SuggestNextStepsInput } from '@/ai/flows/suggest-next-steps';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VisitDetailsProps {
  visit: VisitPlan;
  client?: Client;
  role: 'manager' | 'sales_rep';
}

const statusStyles: Record<VisitPlan['status'], string> = {
  planned: 'bg-blue-100 text-blue-700 border-blue-300',
  completed: 'bg-green-100 text-green-700 border-green-300',
  postponed: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
};

export function VisitDetails({ visit: initialVisit, client, role }: VisitDetailsProps) {
  const [visit, setVisit] = useState<VisitPlan>(initialVisit);
  const [visitNotes, setVisitNotes] = useState(initialVisit.notes || '');
  const [nextSteps, setNextSteps] = useState(initialVisit.nextSteps || '');
  const [reason, setReason] = useState(initialVisit.reason || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setVisit(initialVisit);
    setVisitNotes(initialVisit.notes || '');
    setNextSteps(initialVisit.nextSteps || '');
    setReason(initialVisit.reason || '');
    // If manager is viewing a completed visit, don't start in editing mode
    if (role === 'manager' && initialVisit.status === 'completed') {
        setIsEditingNotes(false);
    }
  }, [initialVisit, role]);

  const handleStatusChange = (newStatus: VisitPlan['status'], newReason?: string) => {
    if (role === 'manager') return; // Managers should not change status from this view.

    setIsLoadingAction(true);
    // Simulate API call
    setTimeout(() => {
      const updatedVisit: VisitPlan = {
        ...visit,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      if (newStatus === 'completed') {
        updatedVisit.checkInTime = visit.checkInTime || new Date().toISOString();
        updatedVisit.checkOutTime = new Date().toISOString();
        updatedVisit.notes = visitNotes;
        updatedVisit.nextSteps = nextSteps;
      }
      if (newReason) {
        updatedVisit.reason = newReason;
      }
      setVisit(updatedVisit);
      toast({ title: "Visit Status Updated", description: `Visit marked as ${newStatus}.` });
      setIsLoadingAction(false);
      if (newStatus === 'completed') setIsEditingNotes(false);
    }, 500);
  };
  
  const handleCheckIn = () => {
    if (role === 'manager') return;
    setIsLoadingAction(true);
    setTimeout(() => {
      const updatedVisit = { ...visit, checkInTime: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setVisit(updatedVisit);
      toast({ title: "Checked In", description: "Visit started successfully." });
      setIsEditingNotes(true);
      setIsLoadingAction(false);
    }, 500);
  };

  const handleSaveNotes = () => {
    if (role === 'manager') return;
    handleStatusChange('completed');
  };
  
  const handleSuggestNextSteps = async () => {
    if (role === 'manager' || !client) {
      toast({ title: "Error", description: "Client details not available for AI suggestion or action not permitted.", variant: "destructive" });
      return;
    }
    if (!visitNotes.trim()) {
        toast({ title: "Missing Information", description: "Please enter visit notes before generating suggestions.", variant: "destructive"});
        return;
    }

    setIsLoadingAI(true);
    try {
      const input: SuggestNextStepsInput = {
        clientDetails: `Client Name: ${client.clientName}, Type: ${client.type}, Address: ${client.address}. Other info: ${client.numDoctors ? client.numDoctors + ' doctors. ' : ''} ${client.influentialPersonnel ? 'Influential: ' + client.influentialPersonnel.map(p=> p.name + ' ('+p.role+')').join(', ') : ''}`,
        visitNotes: visitNotes,
      };
      const result = await suggestNextSteps(input);
      setNextSteps(result.nextSteps);
      toast({ title: "AI Suggestion", description: "Next steps generated successfully." });
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({ title: "AI Error", description: "Failed to generate next steps.", variant: "destructive" });
    }
    setIsLoadingAI(false);
  };

  const canCheckIn = role === 'sales_rep' && visit.status === 'planned' && !visit.checkInTime;
  const canEditNotes = role === 'sales_rep' && ((visit.status === 'planned' && !!visit.checkInTime) || visit.status === 'completed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="font-headline text-2xl">Visit Information</CardTitle>
              <Badge variant="outline" className={cn("capitalize text-sm px-3 py-1", statusStyles[visit.status])}>
                {visit.status}
              </Badge>
            </div>
             {role === 'manager' && visit.salesRepName && <CardDescription>Sales Rep: {visit.salesRepName}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" /> Scheduled: {format(new Date(visit.scheduledDate), 'PPP')} at {visit.scheduledTime}</div>
            {visit.checkInTime && <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-green-500" /> Checked In: {format(new Date(visit.checkInTime), 'PPpp')}</div>}
            {visit.checkOutTime && <div className="flex items-center"><StopCircle className="w-4 h-4 mr-2 text-red-500" /> Checked Out: {format(new Date(visit.checkOutTime), 'PPpp')}</div>}
            {visit.checkInLocation && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-muted-foreground" /> Check-in Location: Lat {visit.checkInLocation.latitude.toFixed(4)}, Lng {visit.checkInLocation.longitude.toFixed(4)} (Mocked)</div>}
            {(visit.status === 'postponed' || visit.status === 'cancelled') && visit.reason && <div className="flex items-start"><AlertTriangle className="w-4 h-4 mr-2 text-muted-foreground mt-0.5" /> Reason: {visit.reason}</div>}
          </CardContent>
        </Card>

        {(canEditNotes || visit.status === 'completed') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Visit Outcome</CardTitle>
              {role === 'sales_rep' && !isEditingNotes && visit.status === 'completed' && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(true)}><Edit className="w-4 h-4 mr-2"/>Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="visitNotes">Visit Notes</Label>
                <Textarea 
                  id="visitNotes" 
                  value={visitNotes} 
                  onChange={(e) => setVisitNotes(e.target.value)} 
                  rows={5}
                  readOnly={role === 'manager' || (!isEditingNotes && visit.status === 'completed')}
                  className={(role === 'manager' || (!isEditingNotes && visit.status === 'completed')) ? "bg-muted/50" : ""}
                />
              </div>
              <div>
                <Label htmlFor="nextSteps">Next Steps</Label>
                <Textarea 
                  id="nextSteps" 
                  value={nextSteps} 
                  onChange={(e) => setNextSteps(e.target.value)} 
                  rows={3}
                  readOnly={role === 'manager' || (!isEditingNotes && visit.status === 'completed')}
                  className={(role === 'manager' || (!isEditingNotes && visit.status === 'completed')) ? "bg-muted/50" : ""}
                />
                {role === 'sales_rep' && isEditingNotes && (
                  <Button onClick={handleSuggestNextSteps} variant="outline" size="sm" className="mt-2" disabled={isLoadingAI}>
                    {isLoadingAI ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
                    Suggest with AI
                  </Button>
                )}
              </div>
              {role === 'sales_rep' && isEditingNotes && visit.status !== 'completed' && (
                 <Button onClick={handleSaveNotes} disabled={isLoadingAction || isLoadingAI} className="w-full">
                  {isLoadingAction ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Notes & Complete Visit
                </Button>
              )}
              {role === 'sales_rep' && isEditingNotes && visit.status === 'completed' && (
                 <Button onClick={() => { setIsEditingNotes(false); handleStatusChange('completed'); }} disabled={isLoadingAction || isLoadingAI} className="w-full">
                  {isLoadingAction ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Update Notes & Next Steps
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-1 space-y-4">
        {client && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Client: {client.clientName}</CardTitle>
              <CardDescription>{client.type} - {client.address}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {client.phoneNumber && <p><strong>Phone:</strong> {client.phoneNumber}</p>}
              {client.email && <p><strong>Email:</strong> {client.email}</p>}
              {client.numDoctors && <p><strong>Doctors:</strong> {client.numDoctors}</p>}
              {client.influentialPersonnel && client.influentialPersonnel.length > 0 && (
                <div>
                  <strong>Influential Personnel:</strong>
                  <ul className="list-disc list-inside pl-2">
                    {client.influentialPersonnel.map(p => <li key={p.name}>{p.name} ({p.role})</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {role === 'sales_rep' && visit.status === 'planned' && (
          <Card>
            <CardHeader><CardTitle className="font-headline text-xl">Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {canCheckIn && (
                <Button onClick={handleCheckIn} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoadingAction}>
                  <Play className="w-4 h-4 mr-2"/> Start Visit / Check-In
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-100" disabled={isLoadingAction}><AlertTriangle className="w-4 h-4 mr-2"/>Postpone Visit</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Postpone Visit</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please provide a reason for postponing this visit.
                      <Textarea placeholder="Reason for postponement..." value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2" />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoadingAction}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusChange('postponed', reason)} className="bg-yellow-500 hover:bg-yellow-600" disabled={isLoadingAction || !reason.trim()}>
                      {isLoadingAction ? <Loader2 className="w-4 h-4 animate-spin"/> : "Confirm Postpone"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" disabled={isLoadingAction}><XCircle className="w-4 h-4 mr-2"/>Cancel Visit</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Visit</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please provide a reason for cancelling this visit.
                      <Textarea placeholder="Reason for cancellation..." value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2" />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoadingAction}>Back</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusChange('cancelled', reason)} className="bg-destructive hover:bg-destructive/90" disabled={isLoadingAction || !reason.trim()}>
                       {isLoadingAction ? <Loader2 className="w-4 h-4 animate-spin"/> : "Confirm Cancel"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

    