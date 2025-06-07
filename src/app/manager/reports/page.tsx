import { PageHeader } from "@/components/PageHeader";
import { BarChart2 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports" 
        description="View detailed reports and statistics." 
        icon={BarChart2}
      />
      <div className="text-center py-12 bg-card rounded-lg shadow">
        <BarChart2 className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">Reports & Statistics</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Detailed reports on visits, representative performance, and location tracking will be displayed here.
        </p>
      </div>
    </div>
  );
}
