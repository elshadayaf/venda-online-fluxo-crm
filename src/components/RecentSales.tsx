import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentSales() {
  const recentSales = [
    {
      id: "#3421",
      customer: "João Silva",
      email: "joao@email.com",
      amount: "R$ 1.250,00",
      status: "pago",
      method: "PIX",
      time: "há 5 min",
    },
    {
      id: "#3422",
      customer: "Maria Santos",
      email: "maria@email.com",
      amount: "R$ 890,00",
      status: "pendente",
      method: "Boleto",
      time: "há 12 min",
    },
    {
      id: "#3423",
      customer: "Pedro Costa",
      email: "pedro@email.com",
      amount: "R$ 2.150,00",
      status: "pago",
      method: "Cartão",
      time: "há 18 min",
    },
    {
      id: "#3424",
      customer: "Ana Oliveira",
      email: "ana@email.com",
      amount: "R$ 750,00",
      status: "pago",
      method: "PIX",
      time: "há 25 min",
    },
    {
      id: "#3425",
      customer: "Carlos Lima",
      email: "carlos@email.com",
      amount: "R$ 1.680,00",
      status: "pendente",
      method: "Cartão",
      time: "há 32 min",
    },
  ];

  const getStatusBadge = (status: string) => {
    return status === "pago" ? (
      <Badge className="bg-green-900 text-green-300 hover:bg-green-900 border-green-700">
        Pago
      </Badge>
    ) : (
      <Badge className="bg-orange-900 text-orange-300 hover:bg-orange-900 border-orange-700">
        Pendente
      </Badge>
    );
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "PIX": return "text-green-400";
      case "Cartão": return "text-cyan-400";
      case "Boleto": return "text-orange-400";
      default: return "text-gray-400";
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Vendas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-orange-900 text-orange-300">
                    {sale.customer.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white">{sale.customer}</div>
                  <div className="text-sm text-gray-400">{sale.email}</div>
                  <div className="text-xs text-gray-500">{sale.id} • {sale.time}</div>
                </div>
              </div>
              
              <div className="text-right space-y-2">
                <div className="font-semibold text-white">{sale.amount}</div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(sale.status)}
                  <span className={`text-xs font-medium ${getMethodColor(sale.method)}`}>
                    {sale.method}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
