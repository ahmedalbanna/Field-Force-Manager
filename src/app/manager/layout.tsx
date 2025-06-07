import { ManagerSidebar } from '@/components/navigation/ManagerSidebar';
import React from 'react';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <main className="flex-1 pl-64"> {/* Adjust pl based on sidebar width */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
