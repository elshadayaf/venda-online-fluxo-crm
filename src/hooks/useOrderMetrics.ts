
import { useMemo } from 'react';
import { useOrders } from './useOrders';
import { isPaidStatus, isPendingStatus, isCancelledStatus } from '@/utils/orderUtils';

export const useOrderMetrics = (selectedPeriod: string) => {
  const { orders, loading, error } = useOrders(selectedPeriod);

  const metrics = useMemo(() => {
    console.log('📊 Calculando métricas para', selectedPeriod, '- Total de pedidos:', orders?.length || 0);
    
    if (!orders || orders.length === 0) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        paidOrders: 0,
        pendingOrders: 0,
        pendingRevenue: 0,
        cancelledOrders: 0,
        conversionRate: 0,
        paidRevenue: 0
      };
    }

    // Log detalhado dos pedidos para debug
    orders.forEach((order, index) => {
      const rawAmount = order.amount;
      const numericAmount = Number(order.amount);
      
      // Verificar se o valor parece estar em centavos (número inteiro >= 1000)
      const isLikelyCents = Number.isInteger(numericAmount) && numericAmount >= 1000;
      const correctedAmount = isLikelyCents ? numericAmount / 100 : numericAmount;
      
      console.log(`🔍 Pedido ${index + 1} (${order.external_id}):`, {
        customer_name: order.customer_name,
        raw_amount: rawAmount,
        numeric_amount: numericAmount,
        is_likely_cents: isLikelyCents,
        corrected_amount: correctedAmount,
        status: order.status,
        payment_method: order.payment_method,
        created_at: order.created_at
      });
    });

    const totalOrders = orders.length;
    
    // Calcula receita total com correção automática para valores em centavos
    const totalRevenue = orders.reduce((sum, order) => {
      const amount = Number(order.amount) || 0;
      
      // Se o valor parece estar em centavos (número inteiro >= 1000), converte
      const correctedAmount = (Number.isInteger(amount) && amount >= 1000) ? amount / 100 : amount;
      
      console.log(`💰 Processando valor do pedido ${order.external_id}:`, {
        original: amount,
        corrected: correctedAmount,
        was_converted: (Number.isInteger(amount) && amount >= 1000)
      });
      
      return sum + correctedAmount;
    }, 0);
    
    console.log('💰 Receita total calculada (após correções):', totalRevenue);
    
    const paidOrdersArray = orders.filter(order => {
      const isPaid = isPaidStatus(order.status);
      console.log(`✅ Pedido ${order.external_id} - Status: ${order.status}, É pago?: ${isPaid}`);
      return isPaid;
    });
    
    const paidOrders = paidOrdersArray.length;
    
    // Adicionar logs detalhados para pedidos pendentes
    const pendingOrdersArray = orders.filter(order => {
      const isPending = isPendingStatus(order.status);
      console.log(`⏳ Pedido ${order.external_id} - Status: ${order.status}, É pendente?: ${isPending}`);
      return isPending;
    });
    
    const pendingOrders = pendingOrdersArray.length;
    
    // Calcular valor das vendas pendentes
    const pendingRevenue = pendingOrdersArray.reduce((sum, order) => {
      const amount = Number(order.amount) || 0;
      
      // Se o valor parece estar em centavos (número inteiro >= 1000), converte
      const correctedAmount = (Number.isInteger(amount) && amount >= 1000) ? amount / 100 : amount;
      
      console.log(`⏳ Valor pendente do pedido ${order.external_id}:`, {
        original: amount,
        corrected: correctedAmount,
        was_converted: (Number.isInteger(amount) && amount >= 1000)
      });
      
      return sum + correctedAmount;
    }, 0);
    
    const cancelledOrdersArray = orders.filter(order => {
      const isCancelled = isCancelledStatus(order.status);
      console.log(`❌ Pedido ${order.external_id} - Status: ${order.status}, É cancelado?: ${isCancelled}`);
      return isCancelled;
    });
    
    const cancelledOrders = cancelledOrdersArray.length;

    console.log('📈 Contagem de pedidos por status:', {
      total: totalOrders,
      paid: paidOrders,
      pending: pendingOrders,
      cancelled: cancelledOrders,
      sum_check: paidOrders + pendingOrders + cancelledOrders
    });

    // Calcula receita dos pedidos pagos com correção automática
    const paidRevenue = paidOrdersArray.reduce((sum, order) => {
      const paidAmount = Number(order.paid_amount) || Number(order.amount) || 0;
      
      // Se o valor parece estar em centavos (número inteiro >= 1000), converte
      const correctedPaidAmount = (Number.isInteger(paidAmount) && paidAmount >= 1000) ? paidAmount / 100 : paidAmount;
      
      console.log(`💳 Receita paga do pedido ${order.external_id}:`, {
        original: paidAmount,
        corrected: correctedPaidAmount,
        was_converted: (Number.isInteger(paidAmount) && paidAmount >= 1000)
      });
      
      return sum + correctedPaidAmount;
    }, 0);

    // MUDANÇA PRINCIPAL: Ticket médio agora baseado apenas em vendas pagas
    const averageOrderValue = paidOrders > 0 ? paidRevenue / paidOrders : 0;
    const conversionRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0;

    console.log('🎯 CÁLCULO DO TICKET MÉDIO:', {
      paidRevenue,
      paidOrders,
      averageOrderValue,
      note: 'Agora calculado apenas com vendas pagas'
    });

    const finalMetrics = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      paidOrders,
      pendingOrders,
      pendingRevenue,
      cancelledOrders,
      conversionRate,
      paidRevenue
    };

    console.log('📊 Métricas finais calculadas para', selectedPeriod, ':', finalMetrics);

    return finalMetrics;
  }, [orders, selectedPeriod]);

  return { metrics, loading, error };
};
