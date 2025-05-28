import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Loader2, Eye, RefreshCw } from "lucide-react";
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

// Função para corrigir valores que estão em centavos
const correctAmountDisplay = (amount: number | null): number => {
  if (!amount) return 0;
  
  const numericAmount = Number(amount);
  
  // Se o valor parece estar em centavos (número inteiro >= 1000), converte
  const isLikelyCents = Number.isInteger(numericAmount) && numericAmount >= 1000;
  
  return isLikelyCents ? numericAmount / 100 : numericAmount;
};

export function PedidosTable({ selectedPeriod }: PedidosTableProps) {
  const { orders, loading, error, refetch } = useOrders(selectedPeriod);

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
            <Button 
              onClick={refetch} 
              variant="outline" 
              size="sm" 
              className="ml-auto text-gray-400 border-gray-600 hover:border-gray-500"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-400 py-8">
            <p className="mb-4">Erro ao carregar pedidos: {error}</p>
            <Button onClick={refetch} variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
              Tentar Novamente
            </Button>
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
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm" 
            className="ml-auto text-gray-400 border-gray-600 hover:border-gray-500"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
        {orders.length === 0 && (
          <div className="text-sm text-gray-400">
            Período selecionado: {selectedPeriod === 'today' ? 'Hoje' : selectedPeriod === 'yesterday' ? 'Ontem' : selectedPeriod === '7days' ? 'Últimos 7 dias' : 'Este mês'}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
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
              {orders.map((order) => {
                const correctedAmount = correctAmountDisplay(order.amount);
                const originalAmount = Number(order.amount) || 0;
                const wasConverted = (Number.isInteger(originalAmount) && originalAmount >= 1000);
                
                console.log(`💰 Exibindo valor do pedido ${order.external_id}:`, {
                  original: originalAmount,
                  corrected: correctedAmount,
                  was_converted: wasConverted
                });
                
                return (
                  <TableRow key={order.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="text-white font-medium">#{order.external_id}</TableCell>
                    <TableCell className="text-white">{order.customer_name}</TableCell>
                    <TableCell className="text-gray-300">
                      {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className={`font-semibold ${wasConverted ? 'text-green-400' : 'text-white'}`}>
                      R$ {correctedAmount.toFixed(2).replace('.', ',')}
                      {wasConverted && (
                        <span className="text-xs text-gray-400 block">
                          (corrigido de R$ {originalAmount.toFixed(2).replace('.', ',')})
                        </span>
                      )}
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
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Não há pedidos para o período selecionado: {selectedPeriod === 'today' ? 'Hoje' : selectedPeriod === 'yesterday' ? 'Ontem' : selectedPeriod === '7days' ? 'Últimos 7 dias' : 'Este mês'}
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={refetch} 
                variant="outline" 
                className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Lista
              </Button>
            </div>
            <div className="mt-6 p-4 bg-gray-800 rounded-lg text-left">
              <h4 className="text-sm font-medium text-gray-300 mb-2">💡 Dicas para solucionar:</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Verifique se há pedidos em outros períodos</li>
                <li>• Confirme se o webhook está enviando dados corretamente</li>
                <li>• Abra o console do navegador (F12) para verificar logs de debug</li>
                <li>• Tente alterar o período de filtro</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
