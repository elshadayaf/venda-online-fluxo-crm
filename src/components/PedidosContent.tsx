
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FilterTabs } from "@/components/FilterTabs";
import { PedidosTable } from "@/components/PedidosTable";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export function PedidosContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const { user } = useAuth();

  return (
    <div className="flex-1 space-y-6 p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-gray-800" />
          <div>
            <h1 className="text-3xl font-bold text-white">Pedidos</h1>
            <p className="text-gray-400">
              Gerencie todos os seus pedidos - {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Buscar pedidos..." 
              className="pl-10 w-64 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <FilterTabs selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

      {/* Orders Table */}
      <PedidosTable selectedPeriod={selectedPeriod} />
    </div>
  );
}
