
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, FileText, Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PedidosTableProps {
  selectedPeriod: string;
}

const getPaymentIcon = (method: string) => {
  const lowerMethod = method.toLowerCase();
  if (lowerMethod.includes('card') || lowerMethod.includes('cartao')) {
    return <CreditCard className="w-4 h-4" />;
  }
  if (lowerMethod.includes('pix')) {
    return <Smartphone className="w-4 h-4" />;
  }
  if (lowerMethod.includes('boleto')) {
    return <FileText className="w-4 h-4" />;
  }
  return <CreditCard className="w-4 h-4" />;
};

const getPaymentLabel = (method: string) => {
  const lowerMethod = method.toLowerCase();
  if (lowerMethod.includes('card') || lowerMethod.includes('cartao')) {
    return "Cartão";
  }
  if (lowerMethod.includes('pix')) {
    return "PIX";
  }
  if (lowerMethod.includes('boleto')) {
    return "Boleto";
  }
  return method;
};

const getStatusBadge = (status: string) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('paid') || lowerStatus.includes('pago') || lowerStatus.includes('approved')) {
    return (
      <Badge className="bg-green-600 hover:bg-green-500 text-white">
        Pago
      </Badge>
    );
  }
  if (lowerStatus.includes('pending') || lowerStatus.includes('pendente')) {
    return (
      <Badge className="bg-yellow-600 hover:bg-yellow-500 text-white">
        Pendente
      </Badge>
    );
  }
  if (lowerStatus.includes('cancelled') || lowerStatus.includes('cancelado')) {
    return (
      <Badge className="bg-red-600 hover:bg-red-500 text-white">
        Cancelado
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-gray-600 hover:bg-gray-500 text-white">
      {status}
    </Badge>
  );
};

export function PedidosTable({ selectedPeriod }: PedidosTableProps) {
  const { orders, loading, error } = useOrders(selectedPeriod);

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lista de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-400">Carregando pedidos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lista de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-400 py-8">
            Erro ao carregar pedidos: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Lista de Pedidos ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">Pedido</TableHead>
              <TableHead className="text-gray-400">Cliente</TableHead>
              <TableHead className="text-gray-400">Data</TableHead>
              <TableHead className="text-gray-400">Valor</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Pagamento</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="text-white font-medium">#{order.external_id}</TableCell>
                  <TableCell className="text-white">{order.customer_name}</TableCell>
                  <TableCell className="text-gray-300">
                    {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    R$ {Number(order.amount).toFixed(2).replace('.', ',')}
                  </TableCell>
                  <TableCell className="text-gray-300">{order.customer_email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-300">
                      {getPaymentIcon(order.payment_method)}
                      {getPaymentLabel(order.payment_method)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                  Nenhum pedido encontrado para o período selecionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
