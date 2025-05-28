
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, CreditCard, Clock, TrendingUp } from "lucide-react";

interface MetricCardsProps {
  selectedPeriod: string;
}

export function MetricCards({ selectedPeriod }: MetricCardsProps) {
  // Mock data que seria vinda da API
  const metrics = {
    today: {
      totalSales: { value: "R$ 12.580", change: "+12.5%", trend: "up" },
      paidSales: { value: "R$ 8.920", change: "+8.2%", trend: "up" },
      pendingSales: { value: "R$ 3.660", change: "-2.1%", trend: "down" },
      conversionRate: { value: "3.2%", change: "+0.5%", trend: "up" },
      averageTicket: { value: "R$ 385", change: "+5.8%", trend: "up" },
    },
    yesterday: {
      totalSales: { value: "R$ 11.240", change: "+5.8%", trend: "up" },
      paidSales: { value: "R$ 8.250", change: "+7.1%", trend: "up" },
      pendingSales: { value: "R$ 2.990", change: "-1.8%", trend: "down" },
      conversionRate: { value: "2.9%", change: "+0.2%", trend: "up" },
      averageTicket: { value: "R$ 364", change: "+3.2%", trend: "up" },
    },
    "7days": {
      totalSales: { value: "R$ 78.950", change: "+18.7%", trend: "up" },
      paidSales: { value: "R$ 65.420", change: "+15.3%", trend: "up" },
      pendingSales: { value: "R$ 13.530", change: "+8.9%", trend: "up" },
      conversionRate: { value: "3.1%", change: "+0.8%", trend: "up" },
      averageTicket: { value: "R$ 412", change: "+12.1%", trend: "up" },
    },
    month: {
      totalSales: { value: "R$ 342.180", change: "+24.2%", trend: "up" },
      paidSales: { value: "R$ 287.650", change: "+22.8%", trend: "up" },
      pendingSales: { value: "R$ 54.530", change: "+12.4%", trend: "up" },
      conversionRate: { value: "3.4%", change: "+1.2%", trend: "up" },
      averageTicket: { value: "R$ 456", change: "+18.5%", trend: "up" },
    },
  };

  const currentData = metrics[selectedPeriod as keyof typeof metrics] || metrics.today;

  const cards = [
    {
      title: "Total de Vendas",
      value: currentData.totalSales.value,
      change: currentData.totalSales.change,
      trend: currentData.totalSales.trend,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Vendas Pagas",
      value: currentData.paidSales.value,
      change: currentData.paidSales.change,
      trend: currentData.paidSales.trend,
      icon: ShoppingCart,
      color: "from-cyan-400 to-cyan-500",
    },
    {
      title: "Vendas Pendentes",
      value: currentData.pendingSales.value,
      change: currentData.pendingSales.change,
      trend: currentData.pendingSales.trend,
      icon: Clock,
      color: "from-yellow-400 to-yellow-500",
    },
    {
      title: "Taxa de Conversão",
      value: currentData.conversionRate.value,
      change: currentData.conversionRate.change,
      trend: currentData.conversionRate.trend,
      icon: CreditCard,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Ticket Médio",
      value: currentData.averageTicket.value,
      change: currentData.averageTicket.change,
      trend: currentData.averageTicket.trend,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-2xl transition-shadow bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color}`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {card.value}
            </div>
            <div className="flex items-center text-sm">
              {card.trend === "up" ? (
                <ArrowUp className="w-4 h-4 text-green-400 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-400 mr-1" />
              )}
              <span className={card.trend === "up" ? "text-green-400" : "text-red-400"}>
                {card.change}
              </span>
              <span className="text-gray-500 ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
