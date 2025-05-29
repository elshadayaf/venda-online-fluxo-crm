
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { RefreshProvider } from "@/contexts/RefreshContext";

const Index = () => {
  return (
    <RefreshProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-black">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <Dashboard />
          </main>
        </div>
      </SidebarProvider>
    </RefreshProvider>
  );
};

export default Index;
