
import { useMemo } from 'react';
import { useOrders } from './useOrders';
import { isPaidStatus } from '@/utils/orderUtils';

export const useTopProducts = (selectedPeriod: string) => {
  const { orders, loading, error } = useOrders(selectedPeriod);

  const topProducts = useMemo(() => {
    console.log('🛍️ Calculando produtos mais vendidos para', selectedPeriod, '- Total de pedidos:', orders?.length || 0);
    
    if (!orders || orders.length === 0) {
      return [];
    }

    // Filtrar apenas pedidos pagos
    const paidOrders = orders.filter(order => isPaidStatus(order.status));
    console.log('💳 Analisando produtos dos PEDIDOS PAGOS:', paidOrders.length, 'de', orders.length, 'total');

    if (paidOrders.length === 0) {
      return [];
    }

    // Mapa para contar produtos
    const productMap = new Map<string, { name: string; quantity: number; revenue: number; orders: number }>();

    paidOrders.forEach(order => {
      try {
        // Tenta parsear os itens do pedido
        let items = [];
        if (order.items) {
          if (typeof order.items === 'string') {
            items = JSON.parse(order.items);
          } else {
            items = order.items;
          }
        }

        console.log(`📦 Processando pedido ${order.external_id} - Items:`, items);

        // Se não há itens estruturados, cria um item baseado no pedido
        if (!Array.isArray(items) || items.length === 0) {
          items = [{
            name: `Produto ${order.external_id.slice(-6)}`,
            quantity: 1,
            price: Number(order.amount) || 0
          }];
        }

        items.forEach((item: any) => {
          const productName = String(item.name || item.product_name || item.title || 'Produto sem nome').trim();
          const quantity = Math.max(1, Number(item.quantity) || 1);
          const price = Number(item.price) || Number(order.amount) || 0;
          
          // Correção para valores em centavos
          const correctedPrice = (Number.isInteger(price) && price >= 1000) ? price / 100 : price;
          const itemRevenue = correctedPrice * quantity;

          if (productMap.has(productName)) {
            const existing = productMap.get(productName)!;
            productMap.set(productName, {
              name: productName,
              quantity: existing.quantity + quantity,
              revenue: existing.revenue + itemRevenue,
              orders: existing.orders + 1
            });
          } else {
            productMap.set(productName, {
              name: productName,
              quantity: quantity,
              revenue: itemRevenue,
              orders: 1
            });
          }

          console.log(`🔍 Produto processado: ${productName} - Qtd: ${quantity} - Preço: ${correctedPrice} - Receita: ${itemRevenue}`);
        });
      } catch (error) {
        console.error('❌ Erro ao processar itens do pedido:', order.external_id, error);
        
        // Fallback: criar produto baseado no pedido
        const fallbackName = `Produto ${order.external_id.slice(-6)}`;
        const fallbackPrice = Number(order.amount) || 0;
        const correctedPrice = (Number.isInteger(fallbackPrice) && fallbackPrice >= 1000) ? fallbackPrice / 100 : fallbackPrice;
        
        if (productMap.has(fallbackName)) {
          const existing = productMap.get(fallbackName)!;
          productMap.set(fallbackName, {
            name: fallbackName,
            quantity: existing.quantity + 1,
            revenue: existing.revenue + correctedPrice,
            orders: existing.orders + 1
          });
        } else {
          productMap.set(fallbackName, {
            name: fallbackName,
            quantity: 1,
            revenue: correctedPrice,
            orders: 1
          });
        }
      }
    });

    // Converter mapa para array e ordenar por quantidade vendida
    const productsArray = Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); // Top 10

    console.log('🏆 Top 10 produtos mais vendidos:', productsArray);

    return productsArray;
  }, [orders, selectedPeriod]);

  return { topProducts, loading, error };
};
