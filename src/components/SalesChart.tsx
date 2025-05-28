
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesChartProps {
  selectedPeriod: string;
}

export function SalesChart({ selectedPeriod }: SalesChartProps) {
  // Mock data para diferentes períodos
  const chartData = {
    today: [
      { time: "06:00", vendas: 120, faturamento: 2400 },
      { time: "09:00", vendas: 280, faturamento: 5600 },
      { time: "12:00", vendas: 450, faturamento: 9000 },
      { time: "15:00", vendas: 320, faturamento: 6400 },
      { time: "18:00", vendas: 580, faturamento: 11600 },
      { time: "21:00", vendas: 380, faturamento: 7600 },
    ],
    yesterday: [
      { time: "06:00", vendas: 100, faturamento: 2000 },
      { time: "09:00", vendas: 250, faturamento: 5000 },
      { time: "12:00", vendas: 420, faturamento: 8400 },
      { time: "15:00", vendas: 300, faturamento: 6000 },
      { time: "18:00", vendas: 520, faturamento: 10400 },
      { time: "21:00", vendas: 350, faturamento: 7000 },
    ],
    "7days": [
      { time: "Seg", vendas: 2400, faturamento: 48000 },
      { time: "Ter", vendas: 1800, faturamento: 36000 },
      { time: "Qua", vendas: 3200, faturamento: 64000 },
      { time: "Qui", vendas: 2800, faturamento: 56000 },
      { time: "Sex", vendas: 4200, faturamento: 84000 },
      { time: "Sáb", vendas: 3800, faturamento: 76000 },
      { time: "Dom", vendas: 2600, faturamento: 52000 },
    ],
    month: [
      { time: "Sem 1", vendas: 12000, faturamento: 240000 },
      { time: "Sem 2", vendas: 15000, faturamento: 300000 },
      { time: "Sem 3", vendas: 18000, faturamento: 360000 },
      { time: "Sem 4", vendas: 22000, faturamento: 440000 },
    ],
  };

  const data = chartData[selectedPeriod as keyof typeof chartData] || chartData.today;

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
          <LineChart data={data}>
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
                name === "vendas" ? `${value} vendas` : `R$ ${(value as number).toLocaleString()}`,
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
