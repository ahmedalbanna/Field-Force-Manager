import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Users, PlusCircle } from "lucide-react";

export default function ManageSalesRepsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage Sales Representatives" 
        description="Add, modify, view, and delete representatives." 
        icon={Users}
        actions={
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Representative
          </Button>
        }
      />
      <div className="text-center py-12 bg-card rounded-lg shadow">
        <Users className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">Sales Representatives</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Representative listing and management forms will be implemented here.
        </p>
      </div>
    </div>
  );
}
