
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MetricCards } from "@/components/MetricCards";
import { SalesChart } from "@/components/SalesChart";
import { HourlySalesChart } from "@/components/HourlySalesChart";
import { PaymentMethodChart } from "@/components/PaymentMethodChart";
import { RecentSales } from "@/components/RecentSales";
import { FilterTabs } from "@/components/FilterTabs";
import { Bell, Search, BellRing, BellOff, Zap, Volume2, VolumeX, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const { isActive, toggleNotifications, simulateSale, isSoundEnabled, toggleSound } = useNotifications();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema com sucesso.",
    });
    // Aqui você pode adicionar a lógica de logout real quando integrar com autenticação
    console.log("Logout realizado");
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-gray-800" />
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard de Vendas</h1>
            <p className="text-gray-400">Visão geral do seu negócio</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Buscar..." 
              className="pl-10 w-64 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          
          {/* Botão para simular venda */}
          <Button
            onClick={simulateSale}
            variant="outline"
            size="sm"
            className="bg-orange-600 border-orange-500 text-white hover:bg-orange-500 hover:border-orange-400"
          >
            <Zap className="w-4 h-4 mr-2" />
            Simular Venda
          </Button>
          
          {/* Botão de controle de som */}
          <Button 
            onClick={toggleSound}
            variant="ghost" 
            size="icon" 
            className={`text-white hover:bg-gray-800 ${isSoundEnabled ? 'bg-green-600 hover:bg-green-500' : ''}`}
            title={isSoundEnabled ? 'Som ativado' : 'Som desativado'}
          >
            {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          
          {/* Botão de notificações */}
          <Button 
            onClick={toggleNotifications}
            variant="ghost" 
            size="icon" 
            className={`text-white hover:bg-gray-800 ${isActive ? 'bg-orange-600 hover:bg-orange-500' : ''}`}
          >
            {isActive ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </Button>

          {/* Botão de logout */}
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gray-800 hover:bg-red-600"
            title="Sair do sistema"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <FilterTabs selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

      {/* Metric Cards */}
      <MetricCards selectedPeriod={selectedPeriod} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart selectedPeriod={selectedPeriod} />
        <HourlySalesChart selectedPeriod={selectedPeriod} />
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodChart selectedPeriod={selectedPeriod} />
      </div>

      {/* Recent Sales */}
      <RecentSales />
    </div>
  );
}
