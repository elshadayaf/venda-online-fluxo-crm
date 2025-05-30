
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTopProducts } from "@/hooks/useTopProducts";
import { Loader2, Trophy, Package, ShoppingBag } from "lucide-react";

interface TopProductsCardProps {
  selectedPeriod: string;
}

export function TopProductsCard({ selectedPeriod }: TopProductsCardProps) {
  const { topProducts, loading } = useTopProducts(selectedPeriod);

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top 10 Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-400">Carregando produtos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (topProducts.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top 10 Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] flex-col gap-2">
            <Package className="w-12 h-12 text-gray-600" />
            <span className="text-gray-400">Nenhum produto vendido encontrado</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top 10 Produtos Mais Vendidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {topProducts.map((product, index) => (
            <div 
              key={`${product.name}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Posição */}
                <div className="flex-shrink-0">
                  {index === 0 && (
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">1</span>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">2</span>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                  )}
                  {index > 2 && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Ícone do produto */}
                <div className="flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-orange-400" />
                </div>

                {/* Nome do produto */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate" title={product.name}>
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {product.orders} {product.orders === 1 ? 'pedido' : 'pedidos'}
                  </p>
                </div>
              </div>

              {/* Métricas */}
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-orange-400">
                  {product.quantity}
                </div>
                <div className="text-xs text-gray-400">
                  {product.quantity === 1 ? 'venda' : 'vendas'}
                </div>
                <div className="text-xs text-green-400 font-medium">
                  R$ {product.revenue.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        {topProducts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-center text-sm text-gray-400">
              <span className="font-medium text-white">
                {topProducts.reduce((sum, product) => sum + product.quantity, 0)}
              </span>{' '}
              produtos vendidos • {' '}
              <span className="font-medium text-green-400">
                R$ {topProducts.reduce((sum, product) => sum + product.revenue, 0).toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>{' '}
              em receita
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
