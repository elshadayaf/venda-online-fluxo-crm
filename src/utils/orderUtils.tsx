
import { CreditCard, Smartphone, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const getPaymentIcon = (method: string) => {
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

export const getPaymentLabel = (method: string) => {
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

export const getStatusBadge = (status: string) => {
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

export const formatCurrency = (value: number | null) => {
  if (!value) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
