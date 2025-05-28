
import { useMemo } from 'react';
import { useOrderMetrics } from './useOrderMetrics';
import { useCostSettings } from './useCostSettings';

export const useROIMetrics = (selectedPeriod: string) => {
  const { metrics, loading: ordersLoading, error: ordersError } = useOrderMetrics(selectedPeriod);
  const { costSettings, loading: settingsLoading } = useCostSettings();

  const roiMetrics = useMemo(() => {
    if (!costSettings || ordersLoading || settingsLoading) {
      return {
        totalCosts: 0,
        roas: 0,
        profit: 0,
        profitMargin: 0,
        costBreakdown: {
          advertising: 0,
          checkout: 0,
          gateway: 0,
          total: 0
        }
      };
    }

    const advertisingCost = Number(costSettings.advertising_cost) || 0;
    
    // Calculate checkout fees (percentage of total revenue)
    const checkoutFees = (metrics.totalRevenue * (Number(costSettings.checkout_fee_percentage) || 0)) / 100;
    
    // For gateway fees, we'd need to know payment methods per order
    // For now, we'll use a simplified calculation with PIX fee percentage
    const gatewayFees = (metrics.paidRevenue * (Number(costSettings.pix_gateway_fee_percentage) || 0)) / 100;
    
    const totalCosts = advertisingCost + checkoutFees + gatewayFees;
    const profit = metrics.paidRevenue - totalCosts;
    const roas = totalCosts > 0 ? (metrics.paidRevenue / totalCosts) * 100 : 0;
    const profitMargin = metrics.paidRevenue > 0 ? (profit / metrics.paidRevenue) * 100 : 0;

    return {
      totalCosts,
      roas,
      profit,
      profitMargin,
      costBreakdown: {
        advertising: advertisingCost,
        checkout: checkoutFees,
        gateway: gatewayFees,
        total: totalCosts
      }
    };
  }, [metrics, costSettings, ordersLoading, settingsLoading]);

  return { 
    roiMetrics, 
    loading: ordersLoading || settingsLoading, 
    error: ordersError,
    metrics 
  };
};
