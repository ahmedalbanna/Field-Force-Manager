import { SalesRepSidebar } from '@/components/navigation/SalesRepSidebar';
import React from 'react';

export default function SalesRepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <SalesRepSidebar />
      <main className="flex-1 pl-64"> {/* Adjust pl based on sidebar width */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
