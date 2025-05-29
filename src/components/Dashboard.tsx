import { useState } from "react";
import { MetricCards } from "@/components/MetricCards";
import { SalesChart } from "@/components/SalesChart";
import { HourlySalesChart } from "@/components/HourlySalesChart";
import { PaymentMethodChart } from "@/components/PaymentMethodChart";
import { RecentSales } from "@/components/RecentSales";
import { FilterTabs } from "@/components/FilterTabs";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardActions } from "@/components/DashboardActions";
import { ShortcutsPanel } from "@/components/ShortcutsPanel";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRefresh } from "@/contexts/RefreshContext";

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { isSoundEnabled, toggleSound } = useNotifications();
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const { toggleTheme } = useTheme();
  const { triggerRefresh } = useRefresh();

  const handleRefresh = async () => {
    console.log('🔄 Iniciando refresh do dashboard...');
    setIsRefreshing(true);
    try {
      // Dispara o refresh global que irá atualizar todos os componentes
      triggerRefresh();
      
      // Aguarda um pouco para dar tempo dos dados serem carregados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Dados atualizados",
        description: "O dashboard foi atualizado com os dados mais recentes.",
      });
      console.log('✅ Refresh do dashboard concluído');
    } catch (error) {
      console.error('❌ Erro durante refresh:', error);
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

  const userName = user?.user_metadata?.full_name || user?.email;

  return (
    <div className="flex-1 space-y-6 p-3 sm:p-6 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <DashboardHeader userName={userName} />
        
        <DashboardActions
          showShortcuts={showShortcuts}
          onToggleShortcuts={() => setShowShortcuts(!showShortcuts)}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={toggleSound}
          onLogout={handleLogout}
        />
      </div>

      {/* Painel de atalhos */}
      <ShortcutsPanel isVisible={showShortcuts} />

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
