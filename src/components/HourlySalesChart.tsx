
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useOrders } from "@/hooks/useOrders";
import { useMemo } from "react";
import { format, subDays, startOfDay, endOfDay, eachHourOfInterval, eachDayOfInterval, eachWeekOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface HourlySalesChartProps {
  selectedPeriod: string;
}

export function HourlySalesChart({ selectedPeriod }: HourlySalesChartProps) {
  const { orders, loading } = useOrders(selectedPeriod);

  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const now = new Date();
    
    // Filtrar apenas pedidos pagos
    const paidOrders = orders.filter(order => 
      order.status.toLowerCase().includes('paid') || 
      order.status.toLowerCase().includes('pago') || 
      order.status.toLowerCase().includes('approved')
    );

    switch (selectedPeriod) {
      case 'today':
      case 'yesterday': {
        const referenceDate = selectedPeriod === 'today' ? now : subDays(now, 1);
        const dayStart = startOfDay(referenceDate);
        const dayEnd = endOfDay(referenceDate);
        
        // Gerar intervalos de 3 horas
        const intervals = [];
        for (let hour = 0; hour < 24; hour += 3) {
          const intervalStart = new Date(dayStart);
          intervalStart.setHours(hour);
          const intervalEnd = new Date(dayStart);
          intervalEnd.setHours(hour + 3);
          intervals.push({ start: intervalStart, end: intervalEnd, label: `${hour.toString().padStart(2, '0')}h` });
        }

        return intervals.map(interval => {
          const ordersInInterval = paidOrders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= interval.start && orderDate < interval.end;
          });

          return {
            hora: interval.label,
            vendasPagas: ordersInInterval.length
          };
        });
      }

      case '7days': {
        const days = eachDayOfInterval({
          start: subDays(now, 6),
          end: now
        });

        return days.map(day => {
          const dayStart = startOfDay(day);
          const dayEnd = endOfDay(day);
          
          const ordersInDay = paidOrders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= dayStart && orderDate <= dayEnd;
          });

          return {
            hora: format(day, 'EEE', { locale: ptBR }),
            vendasPagas: ordersInDay.length
          };
        });
      }

      case 'month': {
        const weeks = eachWeekOfInterval({
          start: subDays(now, 28),
          end: now
        }, { weekStartsOn: 1 });

        return weeks.map((weekStart, index) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          
          const ordersInWeek = paidOrders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= weekStart && orderDate <= weekEnd;
          });

          return {
            hora: `Sem ${index + 1}`,
            vendasPagas: ordersInWeek.length
          };
        });
      }

      default:
        return [];
    }
  }, [orders, selectedPeriod]);

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Vendas Pagas por Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            <span className="ml-2 text-gray-400">Carregando dados...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          Vendas Pagas por Período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="hora" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                color: "#ffffff"
              }}
              formatter={(value) => [`${value} vendas`, "Vendas Pagas"]}
            />
            <Bar 
              dataKey="vendasPagas" 
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Vendas Pagas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
