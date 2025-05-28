
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface HourlySalesChartProps {
  selectedPeriod: string;
}

export function HourlySalesChart({ selectedPeriod }: HourlySalesChartProps) {
  // Mock data para vendas pagas por hora
  const chartData = {
    today: [
      { hora: "06h", vendasPagas: 8 },
      { hora: "07h", vendasPagas: 12 },
      { hora: "08h", vendasPagas: 18 },
      { hora: "09h", vendasPagas: 25 },
      { hora: "10h", vendasPagas: 32 },
      { hora: "11h", vendasPagas: 28 },
      { hora: "12h", vendasPagas: 45 },
      { hora: "13h", vendasPagas: 38 },
      { hora: "14h", vendasPagas: 35 },
      { hora: "15h", vendasPagas: 42 },
      { hora: "16h", vendasPagas: 48 },
      { hora: "17h", vendasPagas: 52 },
      { hora: "18h", vendasPagas: 58 },
      { hora: "19h", vendasPagas: 44 },
      { hora: "20h", vendasPagas: 38 },
      { hora: "21h", vendasPagas: 32 },
    ],
    yesterday: [
      { hora: "06h", vendasPagas: 6 },
      { hora: "07h", vendasPagas: 10 },
      { hora: "08h", vendasPagas: 15 },
      { hora: "09h", vendasPagas: 22 },
      { hora: "10h", vendasPagas: 28 },
      { hora: "11h", vendasPagas: 25 },
      { hora: "12h", vendasPagas: 40 },
      { hora: "13h", vendasPagas: 35 },
      { hora: "14h", vendasPagas: 30 },
      { hora: "15h", vendasPagas: 38 },
      { hora: "16h", vendasPagas: 42 },
      { hora: "17h", vendasPagas: 48 },
      { hora: "18h", vendasPagas: 52 },
      { hora: "19h", vendasPagas: 40 },
      { hora: "20h", vendasPagas: 35 },
      { hora: "21h", vendasPagas: 28 },
    ],
    "7days": [
      { hora: "Seg", vendasPagas: 240 },
      { hora: "Ter", vendasPagas: 180 },
      { hora: "Qua", vendasPagas: 320 },
      { hora: "Qui", vendasPagas: 280 },
      { hora: "Sex", vendasPagas: 420 },
      { hora: "Sáb", vendasPagas: 380 },
      { hora: "Dom", vendasPagas: 260 },
    ],
    month: [
      { hora: "Sem 1", vendasPagas: 1200 },
      { hora: "Sem 2", vendasPagas: 1500 },
      { hora: "Sem 3", vendasPagas: 1800 },
      { hora: "Sem 4", vendasPagas: 2200 },
    ],
  };

  const data = chartData[selectedPeriod as keyof typeof chartData] || chartData.today;

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
          <BarChart data={data}>
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
