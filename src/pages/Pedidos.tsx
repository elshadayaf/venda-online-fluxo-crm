
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PedidosContent } from "@/components/PedidosContent";

const Pedidos = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <PedidosContent />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Pedidos;
