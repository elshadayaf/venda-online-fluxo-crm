
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
import { CreditCard, Smartphone, FileText, Loader2, Eye, ExternalLink } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";

interface PedidosTableProps {
  selectedPeriod: string;
}

type Order = Tables<'orders'>;

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
  if (lowerStatus.includes('expired') || lowerStatus.includes('expirado')) {
    return (
      <Badge className="bg-gray-600 hover:bg-gray-500 text-white">
        Expirado
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-gray-600 hover:bg-gray-500 text-white">
      {status}
    </Badge>
  );
};

const OrderDetailsDialog = ({ order }: { order: Order }) => {
  const formatCurrency = (value: number | null) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800">
      <DialogHeader>
        <DialogTitle className="text-white">Detalhes do Pedido #{order.external_id}</DialogTitle>
        <DialogDescription className="text-gray-400">
          Informações completas do pedido
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-500">Informações do Cliente</h3>
          <div className="space-y-2">
            <p><span className="text-gray-400">Nome:</span> {order.customer_name}</p>
            <p><span className="text-gray-400">Email:</span> {order.customer_email}</p>
            {order.customer_phone && <p><span className="text-gray-400">Telefone:</span> {order.customer_phone}</p>}
            {order.customer_document && <p><span className="text-gray-400">Documento:</span> {order.customer_document}</p>}
            {(order as any).customer_birth_date && <p><span className="text-gray-400">Data de Nascimento:</span> {format(new Date((order as any).customer_birth_date), "dd/MM/yyyy", { locale: ptBR })}</p>}
            {(order as any).customer_gender && <p><span className="text-gray-400">Gênero:</span> {(order as any).customer_gender}</p>}
          </div>
        </div>

        {/* Order Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-500">Informações do Pedido</h3>
          <div className="space-y-2">
            <p><span className="text-gray-400">Status:</span> {getStatusBadge(order.status)}</p>
            <p><span className="text-gray-400">Valor Total:</span> {formatCurrency(order.amount)}</p>
            <p><span className="text-gray-400">Valor Pago:</span> {formatCurrency(order.paid_amount)}</p>
            {(order as any).discount_amount && (order as any).discount_amount > 0 && <p><span className="text-gray-400">Desconto:</span> {formatCurrency((order as any).discount_amount)}</p>}
            {(order as any).tax_amount && (order as any).tax_amount > 0 && <p><span className="text-gray-400">Taxa:</span> {formatCurrency((order as any).tax_amount)}</p>}
            {(order as any).shipping_amount && (order as any).shipping_amount > 0 && <p><span className="text-gray-400">Frete:</span> {formatCurrency((order as any).shipping_amount)}</p>}
            <p><span className="text-gray-400">Método de Pagamento:</span> {getPaymentLabel(order.payment_method)}</p>
            {(order as any).installments && (order as any).installments > 1 && <p><span className="text-gray-400">Parcelas:</span> {(order as any).installments}x</p>}
            {(order as any).payment_gateway && <p><span className="text-gray-400">Gateway:</span> {(order as any).payment_gateway}</p>}
          </div>
        </div>

        {/* Address Information */}
        {(order.address_street || order.address_city) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-500">Endereço de Entrega</h3>
            <div className="space-y-2">
              {order.address_street && <p><span className="text-gray-400">Rua:</span> {order.address_street}, {order.address_number}</p>}
              {order.address_complement && <p><span className="text-gray-400">Complemento:</span> {order.address_complement}</p>}
              {order.address_neighborhood && <p><span className="text-gray-400">Bairro:</span> {order.address_neighborhood}</p>}
              {order.address_city && <p><span className="text-gray-400">Cidade:</span> {order.address_city} - {order.address_state}</p>}
              {order.address_zip_code && <p><span className="text-gray-400">CEP:</span> {order.address_zip_code}</p>}
            </div>
          </div>
        )}

        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-500">Detalhes do Pagamento</h3>
          <div className="space-y-2">
            <p><span className="text-gray-400">Criado em:</span> {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
            {order.paid_at && <p><span className="text-gray-400">Pago em:</span> {format(new Date(order.paid_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>}
            {(order as any).due_date && <p><span className="text-gray-400">Vencimento:</span> {format(new Date((order as any).due_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>}
            {(order as any).transaction_id && <p><span className="text-gray-400">ID da Transação:</span> {(order as any).transaction_id}</p>}
            {(order as any).pix_key && <p><span className="text-gray-400">Chave PIX:</span> {(order as any).pix_key}</p>}
            {(order as any).payment_link && (
              <p>
                <span className="text-gray-400">Link de Pagamento:</span>{' '}
                <a href={(order as any).payment_link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400">
                  <ExternalLink className="w-4 h-4 inline ml-1" />
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {((order as any).notes || (order as any).tags) && (
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-orange-500">Informações Adicionais</h3>
            <div className="space-y-2">
              {(order as any).notes && <p><span className="text-gray-400">Observações:</span> {(order as any).notes}</p>}
              {(order as any).tags && Array.isArray((order as any).tags) && (order as any).tags.length > 0 && (
                <div>
                  <span className="text-gray-400">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(order as any).tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-orange-500 border-orange-500">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
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
