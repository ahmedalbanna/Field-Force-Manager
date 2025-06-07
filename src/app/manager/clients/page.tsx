'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientCard } from '@/components/cards/ClientCard';
import { mockClients, mockSalesReps } from '@/lib/mock-data';
import type { Client, SalesRep } from '@/types';
import { PlusCircle, Search, Briefcase, Users } from 'lucide-react';
import { ClientForm } from './components/ClientForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function ManageClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || client.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddClient = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleSaveClient = (clientData: Omit<Client, 'clientId' | 'createdAt'> | Client) => {
    if ('clientId' in clientData) { // Editing existing client
      setClients(prevClients => prevClients.map(c => c.clientId === clientData.clientId ? clientData : c));
    } else { // Adding new client
      const newClient: Client = {
        ...clientData,
        clientId: `client${Date.now()}`,
        createdAt: new Date().toISOString(),
        assignedRepName: mockSalesReps.find(sr => sr.userRef === clientData.assignedRepRef)?.user?.displayName,
      };
      setClients(prevClients => [newClient, ...prevClients]);
    }
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const clientTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'hospital_government', label: 'Government Hospital' },
    { value: 'hospital_private', label: 'Private Hospital' },
    { value: 'doctor_clinic', label: 'Doctor Clinic' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage Clients" 
        description="View, add, or edit client information." 
        icon={Users}
        actions={
          <Button onClick={handleAddClient} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Client
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by type..." />
          </SelectTrigger>
          <SelectContent>
            {clientTypes.map(ct => (
              <SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <ClientCard key={client.clientId} client={client} role="manager" onEdit={handleEditClient} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">No clients found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filters.' : 'Add a new client to get started.'}
          </p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <DialogDescription>
              {editingClient ? 'Update the details for this client.' : 'Fill in the information for the new client.'}
            </DialogDescription>
          </DialogHeader>
          <ClientForm 
            client={editingClient} 
            salesReps={mockSalesReps}
            onSave={handleSaveClient} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
