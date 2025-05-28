
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Receipt, DollarSign } from "lucide-react";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const isPaidStatus = (status: string): boolean => {
  const paidStatuses = [
    'paid', 'pago', 'approved', 'aprovado', 'completed', 'concluido',
    'settled', 'confirmed', 'confirmado', 'captured', 'capturado'
  ];
  return paidStatuses.some(s => status.toLowerCase().includes(s.toLowerCase()));
};

export const isPendingStatus = (status: string): boolean => {
  console.log('🔍 Verificando se status é pendente:', status);
  const pendingStatuses = [
    'pending', 'pendente', 'waiting', 'aguardando', 'waiting_payment',
    'processing', 'processando', 'analyzing', 'analisando', 'created',
    'criado', 'authorized', 'autorizado', 'pre_authorized', 'pre_autorizado'
  ];
  const isPending = pendingStatuses.some(s => status.toLowerCase().includes(s.toLowerCase()));
  console.log(`📊 Status "${status}" é pendente?`, isPending);
  return isPending;
};

export const isCancelledStatus = (status: string): boolean => {
  const cancelledStatuses = [
    'cancelled', 'cancelado', 'refused', 'recusado', 'failed', 'falhado',
    'rejected', 'rejeitado', 'expired', 'expirado', 'refunded', 'estornado',
    'canceled', 'error', 'erro'
  ];
  return cancelledStatuses.some(s => status.toLowerCase().includes(s.toLowerCase()));
};

export const getStatusBadge = (status: string) => {
  if (isPaidStatus(status)) {
    return (
      <Badge className="bg-green-600 text-white">
        Pago
      </Badge>
    );
  } else if (isPendingStatus(status)) {
    return (
      <Badge className="bg-yellow-600 text-white">
        Pendente
      </Badge>
    );
  } else if (isCancelledStatus(status)) {
    return (
      <Badge className="bg-red-600 text-white">
        Cancelado
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-gray-600 text-white">
        {status}
      </Badge>
    );
  }
};

export const getPaymentIcon = (method: string) => {
  const lowerMethod = method.toLowerCase();
  
  if (lowerMethod.includes('pix')) {
    return <Smartphone className="w-4 h-4" />;
  } else if (lowerMethod.includes('card') || lowerMethod.includes('cartao') || lowerMethod.includes('credit')) {
    return <CreditCard className="w-4 h-4" />;
  } else if (lowerMethod.includes('boleto')) {
    return <Receipt className="w-4 h-4" />;
  } else {
    return <DollarSign className="w-4 h-4" />;
  }
};

export const getPaymentLabel = (method: string) => {
  const lowerMethod = method.toLowerCase();
  
  if (lowerMethod.includes('pix')) {
    return 'PIX';
  } else if (lowerMethod.includes('card') || lowerMethod.includes('cartao') || lowerMethod.includes('credit')) {
    return 'Cartão';
  } else if (lowerMethod.includes('boleto')) {
    return 'Boleto';
  } else {
    return method;
  }
};
