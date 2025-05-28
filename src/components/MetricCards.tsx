
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, CreditCard, Clock, TrendingUp } from "lucide-react";
import { useOrderMetrics } from "@/hooks/useOrderMetrics";

interface MetricCardsProps {
  selectedPeriod: string;
}

export function MetricCards({ selectedPeriod }: MetricCardsProps) {
  const { metrics, loading } = useOrderMetrics(selectedPeriod);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="animate-pulse bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-700 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total de Vendas",
      value: formatCurrency(metrics.totalRevenue),
      change: "+12.5%", // TODO: Calculate real change
      trend: "up" as const,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Vendas Pagas",
      value: formatCurrency(metrics.paidRevenue),
      change: "+8.2%", // TODO: Calculate real change
      trend: "up" as const,
      icon: ShoppingCart,
      color: "from-cyan-400 to-cyan-500",
    },
    {
      title: "Pedidos Pendentes",
      value: metrics.pendingOrders.toString(),
      change: "-2.1%", // TODO: Calculate real change
      trend: "down" as const,
      icon: Clock,
      color: "from-yellow-400 to-yellow-500",
    },
    {
      title: "Taxa de Conversão",
      value: formatPercentage(metrics.conversionRate),
      change: "+0.5%", // TODO: Calculate real change
      trend: "up" as const,
      icon: CreditCard,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(metrics.averageOrderValue),
      change: "+5.8%", // TODO: Calculate real change
      trend: "up" as const,
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
