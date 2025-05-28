
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Eye, EyeOff, RefreshCw, Database, AlertTriangle } from 'lucide-react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Order = Tables<'orders'>;

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAllOrders(data || []);
      console.log('🔍 Debug: Últimos 10 pedidos da base:', data);
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos para debug:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para corrigir valores em centavos
  const fixCentsValues = async () => {
    try {
      console.log('🔧 Iniciando correção de valores em centavos...');
      
      // Buscar todos os pedidos que podem ter valores em centavos
      const { data: ordersToFix, error: fetchError } = await supabase
        .from('orders')
        .select('*');

      if (fetchError) throw fetchError;

      const ordersNeedingFix = ordersToFix?.filter(order => {
        const amount = Number(order.amount);
        // Identificar valores que provavelmente estão em centavos
        return Number.isInteger(amount) && amount >= 1000;
      }) || [];

      console.log(`💡 Encontrados ${ordersNeedingFix.length} pedidos que precisam de correção`);

      if (ordersNeedingFix.length === 0) {
        console.log('✅ Nenhum pedido precisa de correção');
        return;
      }

      // Corrigir cada pedido
      for (const order of ordersNeedingFix) {
        const correctedAmount = Number(order.amount) / 100;
        const correctedPaidAmount = order.paid_amount ? Number(order.paid_amount) / 100 : null;

        console.log(`🔧 Corrigindo pedido ${order.external_id}:`, {
          amount_before: order.amount,
          amount_after: correctedAmount,
          paid_amount_before: order.paid_amount,
          paid_amount_after: correctedPaidAmount
        });

        const updateData: any = {
          amount: correctedAmount,
          updated_at: new Date().toISOString()
        };

        if (correctedPaidAmount !== null) {
          updateData.paid_amount = correctedPaidAmount;
        }

        const { error: updateError } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', order.id);

        if (updateError) {
          console.error(`❌ Erro ao corrigir pedido ${order.external_id}:`, updateError);
        } else {
          console.log(`✅ Pedido ${order.external_id} corrigido com sucesso`);
        }
      }

      console.log('🎉 Correção de valores concluída!');
      fetchAllOrders(); // Atualizar a lista
    } catch (error) {
      console.error('💥 Erro durante a correção:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchAllOrders();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <Card className="bg-gray-900 border-gray-800 border-dashed">
        <CardContent className="p-4">
          <Button 
            onClick={() => setIsVisible(true)}
            variant="outline" 
            size="sm"
            className="w-full text-gray-400 border-gray-600 hover:border-gray-500"
          >
            <Eye className="w-4 h-4 mr-2" />
            Mostrar Painel de Debug
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Identificar pedidos com valores suspeitos (em centavos)
  const suspiciousOrders = allOrders.filter(order => {
    const amount = Number(order.amount);
    return Number.isInteger(amount) && amount >= 1000;
  });

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="w-5 h-5" />
          Painel de Debug - Últimos Pedidos
          {suspiciousOrders.length > 0 && (
            <Badge className="bg-yellow-600 text-white">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {suspiciousOrders.length} com valores suspeitos
            </Badge>
          )}
          <div className="ml-auto flex gap-2">
            {suspiciousOrders.length > 0 && (
              <Button 
                onClick={fixCentsValues}
                variant="outline" 
                size="sm"
                className="text-yellow-400 border-yellow-600 hover:border-yellow-500 hover:bg-yellow-600 hover:text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Corrigir Valores
              </Button>
            )}
            <Button 
              onClick={fetchAllOrders} 
              variant="outline" 
              size="sm" 
              disabled={loading}
              className="text-gray-400 border-gray-600 hover:border-gray-500"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              onClick={() => setIsVisible(false)}
              variant="outline" 
              size="sm"
              className="text-gray-400 border-gray-600 hover:border-gray-500"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-gray-400">
            Carregando dados de debug...
          </div>
        ) : allOrders.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-400 mb-4">
              Total de pedidos encontrados: {allOrders.length}
              {suspiciousOrders.length > 0 && (
                <div className="text-yellow-400 mt-1">
                  ⚠️ {suspiciousOrders.length} pedidos com valores que parecem estar em centavos
                </div>
              )}
            </div>
            {allOrders.map((order) => {
              const amount = Number(order.amount);
              const isLikelyCents = Number.isInteger(amount) && amount >= 1000;
              const correctedAmount = isLikelyCents ? amount / 100 : amount;
              
              return (
                <div key={order.id} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{order.external_id}
                      </Badge>
                      <span className="text-white text-sm font-medium">
                        {order.customer_name}
                      </span>
                      {isLikelyCents && (
                        <Badge className="bg-yellow-600 text-white text-xs">
                          Valor em centavos?
                        </Badge>
                      )}
                    </div>
                    <Badge 
                      className={
                        order.status.toLowerCase().includes('paid') || 
                        order.status.toLowerCase().includes('pago') || 
                        order.status.toLowerCase().includes('approved')
                          ? "bg-green-600 text-white" 
                          : "bg-yellow-600 text-white"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                    <div>
                      <strong>Data:</strong> {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </div>
                    <div className={isLikelyCents ? "text-yellow-400" : ""}>
                      <strong>Valor:</strong> 
                      {isLikelyCents ? (
                        <span>
                          <span className="line-through">R$ {amount.toFixed(2)}</span>
                          {" → "}
                          <span className="font-bold">R$ {correctedAmount.toFixed(2)}</span>
                        </span>
                      ) : (
                        `R$ ${amount.toFixed(2)}`
                      )}
                    </div>
                    <div>
                      <strong>Email:</strong> {order.customer_email}
                    </div>
                    <div>
                      <strong>Pagamento:</strong> {order.payment_method}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              Nenhum pedido encontrado na base de dados
            </p>
            <Button 
              onClick={fetchAllOrders} 
              variant="outline" 
              className="mt-4 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
