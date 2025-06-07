import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Presentation, PlusCircle } from "lucide-react";

export default function ManagePromotionalMaterialsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage Promotional Materials" 
        description="Upload, categorize, and manage promotional materials." 
        icon={Presentation}
        actions={
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Material
          </Button>
        }
      />
      <div className="text-center py-12 bg-card rounded-lg shadow">
        <Presentation className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">Promotional Materials</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Material listing, filters, and upload forms will be implemented here.
        </p>
      </div>
    </div>
  );
}
