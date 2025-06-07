import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Package, PlusCircle } from "lucide-react";

export default function ManageProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage Products" 
        description="Add, modify, and view product details and market analysis." 
        icon={Package}
        actions={
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Button>
        }
      />
      <div className="text-center py-12 bg-card rounded-lg shadow">
        <Package className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-2 text-xl font-semibold text-foreground font-headline">Product Management</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Product listing and forms will be implemented here.
        </p>
      </div>
    </div>
  );
}
