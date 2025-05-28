
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MetricCards } from "@/components/MetricCards";
import { SalesChart } from "@/components/SalesChart";
import { PaymentMethodChart } from "@/components/PaymentMethodChart";
import { RecentSales } from "@/components/RecentSales";
import { FilterTabs } from "@/components/FilterTabs";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

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
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
            <Bell className="w-5 h-5" />
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
        <PaymentMethodChart selectedPeriod={selectedPeriod} />
      </div>

      {/* Recent Sales */}
      <RecentSales />
    </div>
  );
}
