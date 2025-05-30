
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useOrders } from "@/hooks/useOrders";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { isPaidStatus } from "@/utils/orderUtils";

interface PaymentMethodChartProps {
  selectedPeriod: string;
}

export function PaymentMethodChart({ selectedPeriod }: PaymentMethodChartProps) {
  const { orders, loading } = useOrders(selectedPeriod);

  const paymentData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    // Filtrar apenas pedidos pagos
    const paidOrders = orders.filter(order => isPaidStatus(order.status));
    
    console.log('💳 Analisando métodos de pagamento dos PEDIDOS PAGOS:', paidOrders.length, 'de', orders.length, 'total');

    if (paidOrders.length === 0) return [];

    // Agrupar pedidos pagos por método de pagamento
    const paymentGroups = paidOrders.reduce((acc, order) => {
      const method = (order.payment_method || '').toLowerCase();
      console.log(`🔍 Pedido PAGO ${order.external_id} - Método bruto: "${order.payment_method}" - Normalizado: "${method}"`);
      
      let category = 'Outros';
      
      if (method.includes('pix')) {
        category = 'PIX';
      } else if (method === 'cartao_credito' || method.includes('cartao') || method.includes('card') || method.includes('credit') || method.includes('credito')) {
        category = 'Cartão de Crédito';
      } else if (method === 'cartao_debito' || method.includes('debit') || method.includes('debito')) {
        category = 'Cartão de Débito';
      } else if (method.includes('boleto')) {
        category = 'Boleto';
      }

      console.log(`✅ Método "${order.payment_method}" categorizado como: "${category}"`);

      if (!acc[category]) {
        acc[category] = { count: 0, amount: 0 };
      }
      
      acc[category].count += 1;
      
      // Corrigir valor se estiver em centavos
      const amount = Number(order.amount) || 0;
      const correctedAmount = (Number.isInteger(amount) && amount >= 1000) ? amount / 100 : amount;
      acc[category].amount += correctedAmount;
      
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);

    console.log('📊 Grupos de pagamento calculados (apenas pagos):', paymentGroups);

    // Converter para formato do gráfico
    const total = paidOrders.length;
    const colors = {
      'PIX': '#ff6b35',
      'Cartão de Crédito': '#00d4ff',
      'Cartão de Débito': '#4f46e5',
      'Boleto': '#ffd23f',
      'Outros': '#9ca3af'
    };

    const result = Object.entries(paymentGroups).map(([method, data]) => ({
      name: method,
      value: Math.round((data.count / total) * 100),
      count: data.count,
      amount: data.amount,
      color: colors[method as keyof typeof colors] || colors.Outros
    })).sort((a, b) => b.value - a.value);

    console.log('📈 Dados finais do gráfico (apenas pagos):', result);

    return result;
  }, [orders]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="font-medium text-white">{data.name}</p>
          <p className="text-sm text-gray-400">{data.value}% das vendas pagas ({data.count} pedidos)</p>
          <p className="text-sm text-orange-400 font-medium">R$ {data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Métodos de Pagamento (Vendas Pagas)</CardTitle>
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
          <CardTitle className="text-white">Métodos de Pagamento (Vendas Pagas)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <span className="text-gray-400">Nenhum pedido pago encontrado</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Métodos de Pagamento (Vendas Pagas)</CardTitle>
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
                <div className="text-xs text-gray-400">
                  {item.count} pedidos pagos - R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
