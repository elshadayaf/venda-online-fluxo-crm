
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Percent, Calculator } from "lucide-react";

export function TaxasROIContent() {
  return (
    <div className="flex-1 space-y-6 p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-white hover:bg-gray-800" />
        <div>
          <h1 className="text-3xl font-bold text-white">Taxas e ROI</h1>
          <p className="text-gray-400">
            Análise de taxas de conversão e retorno sobre investimento
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Taxa de Conversão
            </CardTitle>
            <Percent className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3.24%</div>
            <p className="text-xs text-green-400">
              +0.4% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              ROI Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">245%</div>
            <p className="text-xs text-green-400">
              +12% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Custo por Aquisição
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ 45,20</div>
            <p className="text-xs text-red-400">
              +R$ 2,10 desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Valor Médio do Pedido
            </CardTitle>
            <Calculator className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ 128,40</div>
            <p className="text-xs text-green-400">
              +R$ 8,20 desde ontem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Taxa de Conversão por Canal</CardTitle>
            <CardDescription className="text-gray-400">
              Performance de conversão por canal de marketing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Email Marketing</span>
                <span className="text-white font-medium">4.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Redes Sociais</span>
                <span className="text-white font-medium">3.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Google Ads</span>
                <span className="text-white font-medium">2.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Tráfego Orgânico</span>
                <span className="text-white font-medium">2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">ROI por Campanha</CardTitle>
            <CardDescription className="text-gray-400">
              Retorno sobre investimento das principais campanhas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Black Friday 2024</span>
                <span className="text-green-400 font-medium">320%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Natal Premium</span>
                <span className="text-green-400 font-medium">285%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Cyber Monday</span>
                <span className="text-green-400 font-medium">245%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Ano Novo</span>
                <span className="text-green-400 font-medium">190%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Análise Detalhada</CardTitle>
          <CardDescription className="text-gray-400">
            Insights sobre performance e oportunidades de melhoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Pontos Fortes</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Taxa de conversão acima da média do setor</li>
                <li>• ROI consistente em campanhas de email</li>
                <li>• Crescimento estável no valor médio do pedido</li>
                <li>• Boa performance em dispositivos móveis</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Oportunidades</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Otimizar funil de conversão no Google Ads</li>
                <li>• Aumentar investimento em email marketing</li>
                <li>• Implementar remarketing mais agressivo</li>
                <li>• Melhorar UX na página de checkout</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
