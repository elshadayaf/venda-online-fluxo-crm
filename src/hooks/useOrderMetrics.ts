
import { useMemo } from 'react';
import { useOrders } from './useOrders';

export const useOrderMetrics = (selectedPeriod: string) => {
  const { orders, loading, error } = useOrders(selectedPeriod);

  const metrics = useMemo(() => {
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

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount), 0);
    const paidOrders = orders.filter(order => 
      order.status.toLowerCase().includes('paid') || 
      order.status.toLowerCase().includes('pago') || 
      order.status.toLowerCase().includes('approved')
    ).length;
    
    const pendingOrders = orders.filter(order => 
      order.status.toLowerCase().includes('pending') || 
      order.status.toLowerCase().includes('pendente')
    ).length;
    
    const cancelledOrders = orders.filter(order => 
      order.status.toLowerCase().includes('cancelled') || 
      order.status.toLowerCase().includes('cancelado')
    ).length;

    const paidRevenue = orders
      .filter(order => 
        order.status.toLowerCase().includes('paid') || 
        order.status.toLowerCase().includes('pago') || 
        order.status.toLowerCase().includes('approved')
      )
      .reduce((sum, order) => sum + Number(order.paid_amount || order.amount), 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      paidOrders,
      pendingOrders,
      cancelledOrders,
      conversionRate,
      paidRevenue
    };
  }, [orders]);

  return { metrics, loading, error };
};
