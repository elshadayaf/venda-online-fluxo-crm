
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useOrders } from "@/hooks/useOrders";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

interface PaymentMethodChartProps {
  selectedPeriod: string;
}

export function PaymentMethodChart({ selectedPeriod }: PaymentMethodChartProps) {
  const { orders, loading } = useOrders(selectedPeriod);

  const paymentData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    // Agrupar pedidos por método de pagamento
    const paymentGroups = orders.reduce((acc, order) => {
      const method = order.payment_method.toLowerCase();
      let category = 'Outros';
      
      if (method.includes('pix')) {
        category = 'PIX';
      } else if (method.includes('card') || method.includes('cartao') || method.includes('credit') || method.includes('debit')) {
        category = 'Cartão';
      } else if (method.includes('boleto')) {
        category = 'Boleto';
      }

      if (!acc[category]) {
        acc[category] = { count: 0, amount: 0 };
      }
      
      acc[category].count += 1;
      acc[category].amount += Number(order.amount);
      
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);

    // Converter para formato do gráfico
    const total = orders.length;
    const colors = {
      'PIX': '#ff6b35',
      'Cartão': '#00d4ff',
      'Boleto': '#ffd23f',
      'Outros': '#9ca3af'
    };

    return Object.entries(paymentGroups).map(([method, data]) => ({
      name: method,
      value: Math.round((data.count / total) * 100),
      amount: data.amount,
      color: colors[method as keyof typeof colors] || colors.Outros
    })).sort((a, b) => b.value - a.value);
  }, [orders]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="font-medium text-white">{data.name}</p>
          <p className="text-sm text-gray-400">{data.value}% das vendas</p>
          <p className="text-sm text-orange-400 font-medium">R$ {data.amount.toLocaleString('pt-BR')}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Métodos de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-400">Carregando dados...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentData.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Métodos de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <span className="text-gray-400">Nenhum dado disponível</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Métodos de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {paymentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="space-y-3 mt-4">
          {paymentData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-gray-300">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">{item.value}%</div>
                <div className="text-xs text-gray-400">R$ {item.amount.toLocaleString('pt-BR')}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
