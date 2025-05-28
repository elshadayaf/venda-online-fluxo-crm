
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MetricCards } from "@/components/MetricCards";
import { SalesChart } from "@/components/SalesChart";
import { HourlySalesChart } from "@/components/HourlySalesChart";
import { PaymentMethodChart } from "@/components/PaymentMethodChart";
import { RecentSales } from "@/components/RecentSales";
import { FilterTabs } from "@/components/FilterTabs";
import { Bell, BellRing, BellOff, Volume2, VolumeX, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const { isActive, toggleNotifications, isSoundEnabled, toggleSound } = useNotifications();
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado do sistema com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao sair do sistema.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-gray-800" />
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard de Vendas</h1>
            <p className="text-gray-400">
              Bem-vindo, {user?.user_metadata?.full_name || user?.email || 'Usuário'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
