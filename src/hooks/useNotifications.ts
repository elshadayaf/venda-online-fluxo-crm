
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAudio } from '@/hooks/useAudio';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;

export function useNotifications() {
  const { isSoundEnabled, toggleSound, playCashRegisterSound } = useAudio();

  // Escutar mudanças em tempo real na tabela de pedidos (sempre ativo)
  useEffect(() => {
    console.log('Ativando notificações de pedidos em tempo real (sempre ativo)');

    const channel = supabase
      .channel('order-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Mudança detectada na tabela orders:', payload);
          handleOrderNotification(payload);
        }
      )
      .subscribe();

    return () => {
      console.log('Desativando notificações de pedidos');
      supabase.removeChannel(channel);
    };
  }, []); // Removido isActive da dependência

  const handleOrderNotification = (payload: any) => {
    const { eventType, new: newOrder, old: oldOrder } = payload;
    
    if (eventType === 'INSERT') {
      // Novo pedido criado
      showOrderNotification(newOrder, 'new');
    } else if (eventType === 'UPDATE') {
      // Pedido atualizado - verificar se status mudou
      if (oldOrder && newOrder && oldOrder.status !== newOrder.status) {
        showOrderNotification(newOrder, 'status_change');
      }
    }
  };

  const showOrderNotification = (order: Order, type: 'new' | 'status_change') => {
    const isPaid = order.status.toLowerCase().includes('paid') || 
                   order.status.toLowerCase().includes('pago') || 
                   order.status.toLowerCase().includes('approved');
    
    const statusText = isPaid ? 'PAGO' : 'PENDENTE';
    const statusEmoji = isPaid ? '🟢' : '🟡';
    
    const amount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(order.amount));

    let title = '';
    let description = '';

    if (type === 'new') {
      title = `${statusEmoji} Novo Pedido Recebido!`;
      description = `${order.customer_name} - ${amount} - ${order.payment_method}`;
    } else {
      title = `${statusEmoji} Status do Pedido Atualizado!`;
      description = `${order.customer_name} - ${amount} - Status: ${statusText}`;
    }
    
    // Tocar som apenas para pedidos pagos e se som estiver ativado
    if (isPaid && isSoundEnabled) {
      playCashRegisterSound();
    }
    
    toast({
      title,
      description,
      duration: 5000,
    });
  };

  // Função para simular um pedido (manter para testes)
  const simulateSale = async () => {
    try {
      const mockOrder = {
        external_id: `TEST-${Date.now()}`,
        customer_name: "Cliente Teste",
        customer_email: "teste@exemplo.com",
        amount: Math.random() * 2000 + 500,
        payment_method: ['PIX', 'Cartão', 'Boleto'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.5 ? 'paid' : 'pending'
      };

      const { error } = await supabase
        .from('orders')
        .insert([mockOrder]);

      if (error) {
        console.error('Erro ao simular pedido:', error);
        toast({
          title: "Erro",
          description: "Erro ao simular pedido",
          variant: "destructive",
        });
      } else {
        console.log('Pedido simulado criado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao simular pedido:', error);
    }
  };

  return {
    simulateSale,
    isSoundEnabled,
    toggleSound
  };
}
