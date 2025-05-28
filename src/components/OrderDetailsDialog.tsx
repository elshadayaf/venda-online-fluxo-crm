
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { getStatusBadge, getPaymentLabel, formatCurrency } from "@/utils/orderUtils";

type Order = Tables<'orders'>;

interface OrderDetailsDialogProps {
  order: Order;
}

export const OrderDetailsDialog = ({ order }: OrderDetailsDialogProps) => {
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
