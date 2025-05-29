
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MetricCards } from "@/components/MetricCards";
import { SalesChart } from "@/components/SalesChart";
import { HourlySalesChart } from "@/components/HourlySalesChart";
import { PaymentMethodChart } from "@/components/PaymentMethodChart";
import { RecentSales } from "@/components/RecentSales";
import { FilterTabs } from "@/components/FilterTabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, BellRing, BellOff, Volume2, VolumeX, LogOut, RefreshCw, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { isActive, toggleNotifications, isSoundEnabled, toggleSound } = useNotifications();
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const { refetch } = useOrders(selectedPeriod);
  const { toggleTheme } = useTheme();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Dados atualizados",
        description: "O dashboard foi atualizado com os dados mais recentes.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

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

  // Atalhos de teclado
  useKeyboardShortcuts({
    onTodaySelect: () => setSelectedPeriod("today"),
    onYesterdaySelect: () => setSelectedPeriod("yesterday"),
    onWeekSelect: () => setSelectedPeriod("week"),
    onMonthSelect: () => setSelectedPeriod("month"),
    onRefresh: handleRefresh,
    onToggleTheme: toggleTheme
  });

  return (
    <div className="flex-1 space-y-6 p-3 sm:p-6 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105" />
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Dashboard de Vendas
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Bem-vindo, {user?.user_metadata?.full_name || user?.email || 'Usuário'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Botão de atalhos */}
          <Button 
            onClick={() => setShowShortcuts(!showShortcuts)}
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105"
            title="Atalhos de teclado"
          >
            <Keyboard className="w-5 h-5" />
          </Button>

          {/* Toggle de tema */}
          <ThemeToggle />

          {/* Botão de refresh */}
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            title="Atualizar dados (Ctrl+R)"
          >
            <RefreshCw className={`w-5 h-5 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>

          {/* Botão de controle de som */}
          <Button 
            onClick={toggleSound}
            variant="ghost" 
            size="icon" 
            className={`text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 ${
              isSoundEnabled ? 'bg-green-600 hover:bg-green-500' : ''
            }`}
            title={isSoundEnabled ? 'Som ativado' : 'Som desativado'}
          >
            {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          
          {/* Botão de notificações */}
          <Button 
            onClick={toggleNotifications}
            variant="ghost" 
            size="icon" 
            className={`text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 ${
              isActive ? 'bg-orange-600 hover:bg-orange-500' : ''
            }`}
            title="Notificações"
          >
            {isActive ? (
              <BellRing className="w-5 h-5 animate-pulse" />
            ) : (
              <BellOff className="w-5 h-5" />
            )}
          </Button>

          {/* Botão de logout */}
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gray-800 hover:bg-red-600 transition-all duration-200 hover:scale-105"
            title="Sair do sistema"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Painel de atalhos */}
      {showShortcuts && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 animate-fade-in">
          <h3 className="text-white font-semibold mb-2">Atalhos de Teclado</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
            <div>Ctrl+1 - Hoje</div>
            <div>Ctrl+2 - Ontem</div>
            <div>Ctrl+3 - Esta semana</div>
            <div>Ctrl+4 - Este mês</div>
            <div>Ctrl+R - Atualizar</div>
            <div>Ctrl+T - Alternar tema</div>
          </div>
        </div>
      )}

      {/* Filter Tabs com animação */}
      <div className="animate-fade-in">
        <FilterTabs selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
      </div>

      {/* Metric Cards com melhor responsividade e animação */}
      <div className="animate-fade-in">
        <MetricCards selectedPeriod={selectedPeriod} />
      </div>

      {/* Charts Grid com responsividade melhorada e animações */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="animate-fade-in hover:scale-[1.02] transition-transform duration-300">
          <SalesChart selectedPeriod={selectedPeriod} />
        </div>
        <div className="animate-fade-in hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
          <HourlySalesChart selectedPeriod={selectedPeriod} />
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="animate-fade-in hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
          <PaymentMethodChart selectedPeriod={selectedPeriod} />
        </div>
      </div>

      {/* Recent Sales com animação */}
      <div className="animate-fade-in hover:scale-[1.01] transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
        <RecentSales />
      </div>
    </div>
  );
}
