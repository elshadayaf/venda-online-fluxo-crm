import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAudio } from '@/hooks/useAudio';

interface Sale {
  id: string;
  customer: string;
  amount: string;
  status: 'pago' | 'pendente';
  method: string;
}

export function useNotifications() {
  const [isActive, setIsActive] = useState(false);
  const { isSoundEnabled, toggleSound, playCashRegisterSound } = useAudio();

  // Simular novas vendas a cada 30 segundos quando ativo
  useEffect(() => {
    if (!isActive) return;

    const mockSales: Omit<Sale, 'id'>[] = [
      {
        customer: "João Silva",
        amount: "R$ 1.250,00",
        status: "pago",
        method: "PIX"
      },
      {
        customer: "Maria Santos",
        amount: "R$ 890,00",
        status: "pendente",
        method: "Boleto"
      },
      {
        customer: "Pedro Costa",
        amount: "R$ 2.150,00",
        status: "pago",
        method: "Cartão"
      },
      {
        customer: "Ana Oliveira",
        amount: "R$ 750,00",
        status: "pendente",
        method: "PIX"
      }
    ];

    const interval = setInterval(() => {
      const randomSale = mockSales[Math.floor(Math.random() * mockSales.length)];
      const saleId = `#${Math.floor(Math.random() * 9999) + 1000}`;
      
      showSaleNotification({
        id: saleId,
        ...randomSale
      });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isActive]);

  const showSaleNotification = (sale: Sale) => {
    const statusText = sale.status === 'pago' ? 'PAGA' : 'PENDENTE';
    const statusColor = sale.status === 'pago' ? '🟢' : '🟡';
    
    // Tocar som apenas para vendas pagas
    if (sale.status === 'pago') {
      playCashRegisterSound();
    }
    
    toast({
      title: `${statusColor} Nova Venda Registrada!`,
      description: `${sale.customer} - ${sale.amount} - Status: ${statusText} (${sale.method})`,
      duration: 5000,
    });
  };

  const toggleNotifications = () => {
    setIsActive(!isActive);
    if (!isActive) {
      toast({
        title: "🔔 Notificações Ativadas",
        description: "Você receberá notificações de novas vendas",
        duration: 3000,
      });
    } else {
      toast({
        title: "🔕 Notificações Desativadas",
        description: "Notificações de vendas foram pausadas",
        duration: 3000,
      });
    }
  };

  // Simular uma venda imediatamente para demonstração
  const simulateSale = () => {
    const mockSale: Sale = {
      id: `#${Math.floor(Math.random() * 9999) + 1000}`,
      customer: "Cliente Teste",
      amount: `R$ ${(Math.random() * 2000 + 500).toFixed(2).replace('.', ',')}`,
      status: Math.random() > 0.5 ? 'pago' : 'pendente',
      method: ['PIX', 'Cartão', 'Boleto'][Math.floor(Math.random() * 3)]
    };
    
    showSaleNotification(mockSale);
  };

  return {
    isActive,
    toggleNotifications,
    simulateSale,
    isSoundEnabled,
    toggleSound
  };
}
