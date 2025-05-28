
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Percent, Calculator, Target } from 'lucide-react';
import { useROIMetrics } from '@/hooks/useROIMetrics';
import { FilterTabs } from './FilterTabs';
import { useState } from 'react';

export function ROIMetricsDisplay() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const { roiMetrics, metrics, loading } = useROIMetrics(selectedPeriod);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return <div className="text-white">Carregando métricas...</div>;
  }

  return (
    <div className="space-y-6">
      <FilterTabs selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

      {/* ROI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              ROAS (Return on Ad Spend)
            </CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatPercentage(roiMetrics.roas)}
            </div>
            <p className="text-xs text-gray-400">
              Retorno sobre investimento publicitário
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Lucro Líquido
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${roiMetrics.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(roiMetrics.profit)}
            </div>
            <p className="text-xs text-gray-400">
              Receita paga - custos totais
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Margem de Lucro
            </CardTitle>
            <Percent className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${roiMetrics.profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercentage(roiMetrics.profitMargin)}
            </div>
            <p className="text-xs text-gray-400">
              Percentual de lucro sobre receita
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Custos Totais
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(roiMetrics.totalCosts)}
            </div>
            <p className="text-xs text-gray-400">
              Todos os custos operacionais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Breakdown de Custos</CardTitle>
            <CardDescription className="text-gray-400">
              Detalhamento dos custos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Publicidade</span>
                <span className="text-white font-medium">
                  {formatCurrency(roiMetrics.costBreakdown.advertising)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Taxas de Checkout</span>
                <span className="text-white font-medium">
                  {formatCurrency(roiMetrics.costBreakdown.checkout)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Taxas de Gateway</span>
                <span className="text-white font-medium">
                  {formatCurrency(roiMetrics.costBreakdown.gateway)}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-300">Total</span>
                  <span className="text-white">
                    {formatCurrency(roiMetrics.costBreakdown.total)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Resumo de Performance</CardTitle>
            <CardDescription className="text-gray-400">
              Métricas de vendas e performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Receita Total</span>
                <span className="text-white font-medium">
                  {formatCurrency(metrics.totalRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Receita Paga</span>
                <span className="text-green-400 font-medium">
                  {formatCurrency(metrics.paidRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Pedidos Totais</span>
                <span className="text-white font-medium">
                  {metrics.totalOrders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Taxa de Conversão</span>
                <span className="text-orange-400 font-medium">
                  {formatPercentage(metrics.conversionRate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
