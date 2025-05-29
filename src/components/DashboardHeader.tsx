
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <SidebarTrigger className="text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105" />
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Dashboard de Vendas
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Bem-vindo, {userName || 'Usuário'}
        </p>
      </div>
    </div>
  );
}
