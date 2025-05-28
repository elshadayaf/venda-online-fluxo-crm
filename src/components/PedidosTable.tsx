
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Loader2, Eye } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";
import { getPaymentIcon, getPaymentLabel, getStatusBadge } from "@/utils/orderUtils";
import { OrderDetailsDialog } from "@/components/OrderDetailsDialog";

interface PedidosTableProps {
  selectedPeriod: string;
}

type Order = Tables<'orders'>;

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
              <TableHead className="text-gray-400">Ações</TableHead>
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
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <OrderDetailsDialog order={order} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-400 py-8">
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
