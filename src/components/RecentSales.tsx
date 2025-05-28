
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useOrders } from "@/hooks/useOrders";
import { Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function RecentSales() {
  const { orders, loading, error } = useOrders("today");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase();
    return lowerStatus.includes('paid') || lowerStatus.includes('pago') || lowerStatus.includes('approved') ? (
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
    const lowerMethod = method.toLowerCase();
    if (lowerMethod.includes("pix")) return "text-green-400";
    if (lowerMethod.includes("card") || lowerMethod.includes("cartao")) return "text-cyan-400";
    if (lowerMethod.includes("boleto")) return "text-orange-400";
    return "text-gray-400";
  };

  const getMethodLabel = (method: string) => {
    const lowerMethod = method.toLowerCase();
    if (lowerMethod.includes("pix")) return "PIX";
    if (lowerMethod.includes("card") || lowerMethod.includes("cartao")) return "Cartão";
    if (lowerMethod.includes("boleto")) return "Boleto";
    return method;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Vendas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-400">Carregando vendas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Vendas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-400 py-8">
            Erro ao carregar vendas recentes
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the 5 most recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Vendas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-orange-900 text-orange-300">
                      {order.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">{order.customer_name}</div>
                    <div className="text-sm text-gray-400">{order.customer_email}</div>
                    <div className="text-xs text-gray-500">
                      #{order.external_id} • {formatDistanceToNow(new Date(order.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="font-semibold text-white">{formatCurrency(order.amount)}</div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <span className={`text-xs font-medium ${getMethodColor(order.payment_method)}`}>
                      {getMethodLabel(order.payment_method)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              Nenhuma venda recente encontrada
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
