
import { useMemo } from 'react';
import { useOrders } from './useOrders';
import { isPaidStatus, isPendingStatus, isCancelledStatus } from '@/utils/orderUtils';

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
    
    const paidOrdersArray = orders.filter(order => isPaidStatus(order.status));
    const paidOrders = paidOrdersArray.length;
    
    const pendingOrders = orders.filter(order => isPendingStatus(order.status)).length;
    const cancelledOrders = orders.filter(order => isCancelledStatus(order.status)).length;

    const paidRevenue = paidOrdersArray.reduce((sum, order) => {
      return sum + Number(order.paid_amount || order.amount);
    }, 0);

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
