
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Eye, EyeOff, RefreshCw, Database } from 'lucide-react';
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

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="w-5 h-5" />
          Painel de Debug - Últimos Pedidos
          <div className="ml-auto flex gap-2">
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
            </div>
            {allOrders.map((order) => (
              <div key={order.id} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{order.external_id}
                    </Badge>
                    <span className="text-white text-sm font-medium">
                      {order.customer_name}
                    </span>
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
                  <div>
                    <strong>Valor:</strong> R$ {Number(order.amount).toFixed(2)}
                  </div>
                  <div>
                    <strong>Email:</strong> {order.customer_email}
                  </div>
                  <div>
                    <strong>Pagamento:</strong> {order.payment_method}
                  </div>
                </div>
              </div>
            ))}
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
