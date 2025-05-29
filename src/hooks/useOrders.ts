import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useRefresh } from '@/contexts/RefreshContext';

type Order = Tables<'orders'>;

export const useOrders = (selectedPeriod: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useRefresh();

  const getDateFilter = (period: string) => {
    const now = new Date();
    switch (period) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return today.toISOString();
      case 'yesterday':
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        return yesterday.toISOString();
      case '7days':
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sevenDaysAgo.toISOString();
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return monthStart.toISOString();
      default:
        return new Date().toISOString();
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando pedidos para o período:', selectedPeriod);
      
      const dateFilter = getDateFilter(selectedPeriod);
      console.log('📅 Filtro de data:', dateFilter);
      
      // Primeiro, vamos buscar TODOS os pedidos para verificar se existem dados
      const { data: allOrders, error: allOrdersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (allOrdersError) {
        console.error('❌ Erro ao buscar todos os pedidos:', allOrdersError);
      } else {
        console.log('📊 Total de pedidos na base:', allOrders?.length || 0);
        console.log('📝 Primeiros 3 pedidos:', allOrders?.slice(0, 3));
      }

      // Agora buscar com filtro de período
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedPeriod === 'yesterday') {
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const endOfYesterday = new Date(startOfYesterday.getTime() + 24 * 60 * 60 * 1000 - 1);
        
        console.log('📅 Período ontem - início:', startOfYesterday.toISOString());
        console.log('📅 Período ontem - fim:', endOfYesterday.toISOString());
        
        query = query
          .gte('created_at', startOfYesterday.toISOString())
          .lte('created_at', endOfYesterday.toISOString());
      } else {
        console.log('📅 Filtro aplicado - maior que:', dateFilter);
        query = query.gte('created_at', dateFilter);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Erro na consulta filtrada:', error);
        throw error;
      }
      
      console.log('✅ Pedidos encontrados com filtro:', data?.length || 0);
      console.log('📋 Dados dos pedidos:', data);
      
      setOrders(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pedidos';
      console.error('💥 Erro geral:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useOrders: Detectado mudança - período:', selectedPeriod, 'refresh trigger:', refreshTrigger);
    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('🔄 Ordem atualizada em tempo real:', payload);
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedPeriod, refreshTrigger]);

  return { orders, loading, error, refetch: fetchOrders };
};
