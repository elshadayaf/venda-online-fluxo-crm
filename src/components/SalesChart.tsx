
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useOrders } from "@/hooks/useOrders";
import { useMemo } from "react";
import { format, subDays, startOfDay, endOfDay, startOfHour, endOfHour, eachHourOfInterval, eachDayOfInterval, eachWeekOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface SalesChartProps {
  selectedPeriod: string;
}

export function SalesChart({ selectedPeriod }: SalesChartProps) {
  const { orders, loading } = useOrders(selectedPeriod);

  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const now = new Date();
    
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
          const ordersInInterval = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= interval.start && orderDate < interval.end;
          });

          const vendas = ordersInInterval.length;
          const faturamento = ordersInInterval.reduce((sum, order) => sum + Number(order.amount), 0);

          return {
            time: interval.label,
            vendas,
            faturamento
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
          
          const ordersInDay = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= dayStart && orderDate <= dayEnd;
          });

          const vendas = ordersInDay.length;
          const faturamento = ordersInDay.reduce((sum, order) => sum + Number(order.amount), 0);

          return {
            time: format(day, 'EEE', { locale: ptBR }),
            vendas,
            faturamento
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
          
          const ordersInWeek = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= weekStart && orderDate <= weekEnd;
          });

          const vendas = ordersInWeek.length;
          const faturamento = ordersInWeek.reduce((sum, order) => sum + Number(order.amount), 0);

          return {
            time: `Sem ${index + 1}`,
            vendas,
            faturamento
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
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            Evolução de Vendas
          </CardTitle>
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

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          Evolução de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
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
              formatter={(value, name) => [
                name === "vendas" ? `${value} vendas` : `R$ ${(value as number).toLocaleString('pt-BR')}`,
                name === "vendas" ? "Vendas" : "Faturamento"
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="vendas" 
              stroke="#ff6b35" 
              strokeWidth={3}
              dot={{ fill: "#ff6b35", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#ff6b35", strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="faturamento" 
              stroke="#00d4ff" 
              strokeWidth={3}
              dot={{ fill: "#00d4ff", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#00d4ff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Vendas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span className="text-sm text-gray-400">Faturamento (R$)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
