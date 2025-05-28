
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TaxasROIContent } from "@/components/TaxasROIContent";

const TaxasROI = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <TaxasROIContent />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TaxasROI;
