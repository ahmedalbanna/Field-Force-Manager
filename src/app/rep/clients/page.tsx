'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { ClientCard } from '@/components/cards/ClientCard';
import { mockClients } from '@/lib/mock-data';
import type { Client } from '@/types';
import { Search, Briefcase, Users } from 'lucide-react';

export default function RepClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Assuming current rep is 'rep1'
  const currentRepId = 'rep1';
  const repClients = mockClients.filter(client => client.assignedRepRef === currentRepId);

  const filteredClients = repClients.filter(client => 
    client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Clients" 
        description="List of clients assigned to you." 
        icon={Users}
      />

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <ClientCard key={client.clientId} client={client} role="sales_rep" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">No clients found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Try adjusting your search.' : 'You currently have no clients assigned or matching your criteria.'}
          </p>
        </div>
      )}
    </div>
  );
}
