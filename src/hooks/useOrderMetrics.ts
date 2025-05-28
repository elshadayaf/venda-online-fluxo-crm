
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
        cancelledOrders: 0,
        conversionRate: 0,
        paidRevenue: 0
      };
    }

    // Log detalhado dos pedidos para debug
    orders.forEach((order, index) => {
      console.log(`Pedido ${index + 1}:`, {
        id: order.external_id,
        customer_name: order.customer_name,
        amount: order.amount,
        status: order.status,
        payment_method: order.payment_method
      });
    });

    const totalOrders = orders.length;
    
    // Calcula receita total considerando valores válidos
    const totalRevenue = orders.reduce((sum, order) => {
      const amount = Number(order.amount) || 0;
      console.log(`Somando valor do pedido ${order.external_id}: ${amount}`);
      return sum + amount;
    }, 0);
    
    console.log('💰 Receita total calculada:', totalRevenue);
    
    const paidOrdersArray = orders.filter(order => {
      const isPaid = isPaidStatus(order.status);
      console.log(`Pedido ${order.external_id} - Status: ${order.status}, É pago?: ${isPaid}`);
      return isPaid;
    });
    
    const paidOrders = paidOrdersArray.length;
    
    const pendingOrders = orders.filter(order => isPendingStatus(order.status)).length;
    const cancelledOrders = orders.filter(order => isCancelledStatus(order.status)).length;

    // Calcula receita dos pedidos pagos
    const paidRevenue = paidOrdersArray.reduce((sum, order) => {
      const paidAmount = Number(order.paid_amount) || Number(order.amount) || 0;
      console.log(`Receita paga do pedido ${order.external_id}: ${paidAmount}`);
      return sum + paidAmount;
    }, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0;

    const finalMetrics = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      paidOrders,
      pendingOrders,
      cancelledOrders,
      conversionRate,
      paidRevenue
    };

    console.log('📊 Métricas calculadas para', selectedPeriod, ':', finalMetrics);

    return finalMetrics;
  }, [orders, selectedPeriod]);

  return { metrics, loading, error };
};
