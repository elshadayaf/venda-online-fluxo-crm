
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Volume2, VolumeX, LogOut, RefreshCw, Keyboard } from "lucide-react";

interface DashboardActionsProps {
  showShortcuts: boolean;
  onToggleShortcuts: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
}

export function DashboardActions({
  showShortcuts,
  onToggleShortcuts,
  isRefreshing,
  onRefresh,
  isSoundEnabled,
  onToggleSound,
  onLogout
}: DashboardActionsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
      {/* Botão de atalhos */}
      <Button 
        onClick={onToggleShortcuts}
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
        onClick={onRefresh}
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
        onClick={onToggleSound}
        variant="ghost" 
        size="icon" 
        className={`text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 ${
          isSoundEnabled ? 'bg-green-600 hover:bg-green-500' : ''
        }`}
        title={isSoundEnabled ? 'Som ativado (notificações sempre ativas)' : 'Som desativado (notificações sempre ativas)'}
      >
        {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>

      {/* Botão de logout */}
      <Button 
        onClick={onLogout}
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-gray-800 hover:bg-red-600 transition-all duration-200 hover:scale-105"
        title="Sair do sistema"
      >
        <LogOut className="w-5 h-5" />
      </Button>
    </div>
  );
}
