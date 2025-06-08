
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SalesRepCard } from '@/components/cards/SalesRepCard';
import { mockSalesReps, mockUsers } from '@/lib/mock-data';
import type { SalesRep, User } from '@/types';
import { PlusCircle, Search, Users as UsersIcon } from "lucide-react";
import { RepForm, type RepFormData } from './components/RepForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle as AlertDialogTitleComponent } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function ManageSalesRepsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reps, setReps] = useState<SalesRep[]>(mockSalesReps);
  // Manage users locally as well if we create new ones or update their active status
  const [users, setUsers] = useState<User[]>(mockUsers); 

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRep, setEditingRep] = useState<SalesRep | null>(null);
  const [repToDelete, setRepToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const populatedReps = reps.map(rep => ({
    ...rep,
    user: users.find(u => u.uid === rep.userRef)
  }));

  const filteredReps = populatedReps.filter(rep =>
    rep.user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.territory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRep = () => {
    setEditingRep(null);
    setIsFormOpen(true);
  };

  const handleEditRep = (rep: SalesRep) => {
    setEditingRep(rep);
    setIsFormOpen(true);
  };

  const handleSaveRep = (formData: RepFormData) => {
    if (editingRep) {
      // Update existing user
      const updatedUser: User = {
        ...(editingRep.user!),
        displayName: formData.displayName,
        email: formData.email,
        photoUrl: formData.photoUrl || undefined,
        isActive: formData.isActive,
        lastLogin: new Date().toISOString(), // Simulate activity
      };
      setUsers(prevUsers => prevUsers.map(u => u.uid === updatedUser.uid ? updatedUser : u));

      // Update sales rep
      const updatedRep: SalesRep = {
        ...editingRep,
        territory: formData.territory,
        user: updatedUser, // Embed updated user for immediate reflection
      };
      setReps(prevReps => prevReps.map(r => r.id === editingRep.id ? updatedRep : r));
      toast({ title: "Representative Updated", description: `${updatedUser.displayName} has been updated.` });
    } else {
      // Create new user
      const newUserUid = `user${Date.now()}`;
      const newUser: User = {
        uid: newUserUid,
        displayName: formData.displayName,
        email: formData.email,
        photoUrl: formData.photoUrl || undefined,
        role: 'sales_rep',
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setUsers(prevUsers => [newUser, ...prevUsers]);

      // Create new sales rep
      const newRep: SalesRep = {
        id: `rep${Date.now()}`,
        userRef: newUserUid,
        territory: formData.territory,
        managerRef: 'manager1', // Assuming default manager for mock
        totalVisitsMade: 0,
        totalVisitsPlanned: 0,
        user: newUser, // Embed new user
      };
      setReps(prevReps => [newRep, ...prevReps]);
      toast({ title: "Representative Added", description: `${newUser.displayName} has been added.` });
    }
    setIsFormOpen(false);
    setEditingRep(null);
  };
  
  const handleDeleteRep = (repId: string) => {
    setRepToDelete(repId);
  };

  const confirmDeleteRep = () => {
    if (repToDelete) {
      const repUser = populatedReps.find(r => r.id === repToDelete)?.user;
      const repName = repUser?.displayName;
      // In a real app, you might want to soft delete or handle related data.
      // For mock, just remove from lists.
      setReps(prevReps => prevReps.filter(r => r.id !== repToDelete));
      if (repUser) { // Also mark user as inactive or remove if they only had this role
        setUsers(prevUsers => prevUsers.map(u => u.uid === repUser.uid ? {...u, isActive: false} : u));
      }
      toast({ title: "Representative Deleted", description: `${repName || 'Representative'} has been deleted/inactivated.` });
      setRepToDelete(null);
    }
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Sales Representatives"
        description="Add, modify, view, and manage representatives."
        icon={UsersIcon}
        actions={
          <Button onClick={handleAddRep} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Representative
          </Button>
        }
      />

       <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search representatives by name, email, or territory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {filteredReps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReps.map(rep => (
            <SalesRepCard 
              key={rep.id} 
              salesRep={rep}
              onEdit={handleEditRep}
              onDelete={handleDeleteRep}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">No representatives found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Try adjusting your search.' : 'Add a new representative to get started.'}
          </p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingRep ? 'Edit Representative' : 'Add New Representative'}</DialogTitle>
            <DialogDescription>
              {editingRep ? 'Update the details for this representative.' : 'Fill in the information for the new representative.'}
            </DialogDescription>
          </DialogHeader>
          <RepForm
            salesRep={editingRep}
            onSave={handleSaveRep}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!repToDelete} onOpenChange={() => setRepToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitleComponent>Are you sure?</AlertDialogTitleComponent>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the representative
              "{populatedReps.find(r => r.id === repToDelete)?.user?.displayName}".
              Their user account will be marked as inactive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRepToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRep} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
