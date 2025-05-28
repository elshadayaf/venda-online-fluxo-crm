
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PaymentMethodChartProps {
  selectedPeriod: string;
}

export function PaymentMethodChart({ selectedPeriod }: PaymentMethodChartProps) {
  // Mock data para métodos de pagamento
  const paymentData = {
    today: [
      { name: "PIX", value: 45, amount: 5661, color: "#ff6b35" },
      { name: "Cartão de Crédito", value: 35, amount: 4403, color: "#00d4ff" },
      { name: "Boleto", value: 20, amount: 2516, color: "#ffd23f" },
    ],
    yesterday: [
      { name: "PIX", value: 42, amount: 4721, color: "#ff6b35" },
      { name: "Cartão de Crédito", value: 38, amount: 4271, color: "#00d4ff" },
      { name: "Boleto", value: 20, amount: 2248, color: "#ffd23f" },
    ],
    "7days": [
      { name: "PIX", value: 48, amount: 37896, color: "#ff6b35" },
      { name: "Cartão de Crédito", value: 32, amount: 25264, color: "#00d4ff" },
      { name: "Boleto", value: 20, amount: 15790, color: "#ffd23f" },
    ],
    month: [
      { name: "PIX", value: 50, amount: 171090, color: "#ff6b35" },
      { name: "Cartão de Crédito", value: 30, amount: 102654, color: "#00d4ff" },
      { name: "Boleto", value: 20, amount: 68436, color: "#ffd23f" },
    ],
  };

  const data = paymentData[selectedPeriod as keyof typeof paymentData] || paymentData.today;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="font-medium text-white">{data.name}</p>
          <p className="text-sm text-gray-400">{data.value}% das vendas</p>
          <p className="text-sm text-orange-400 font-medium">R$ {data.amount.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Métodos de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="space-y-3 mt-4">
          {data.map((item, index) => (
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
                <div className="text-xs text-gray-400">R$ {item.amount.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
