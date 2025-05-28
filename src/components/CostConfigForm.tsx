
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCostSettings } from '@/hooks/useCostSettings';
import { DollarSign, Percent, CreditCard } from 'lucide-react';

export function CostConfigForm() {
  const { costSettings, loading, saveCostSettings } = useCostSettings();
  const [formData, setFormData] = useState({
    advertising_cost: costSettings?.advertising_cost || 0,
    checkout_fee_percentage: costSettings?.checkout_fee_percentage || 0,
    pix_gateway_fee_percentage: costSettings?.pix_gateway_fee_percentage || 0,
    credit_card_fee_1x: costSettings?.credit_card_fee_1x || 0,
    credit_card_fee_2x: costSettings?.credit_card_fee_2x || 0,
    credit_card_fee_3x: costSettings?.credit_card_fee_3x || 0,
    credit_card_fee_4x: costSettings?.credit_card_fee_4x || 0,
    credit_card_fee_5x: costSettings?.credit_card_fee_5x || 0,
    credit_card_fee_6x: costSettings?.credit_card_fee_6x || 0,
    credit_card_fee_7x: costSettings?.credit_card_fee_7x || 0,
    credit_card_fee_8x: costSettings?.credit_card_fee_8x || 0,
    credit_card_fee_9x: costSettings?.credit_card_fee_9x || 0,
    credit_card_fee_10x: costSettings?.credit_card_fee_10x || 0,
    credit_card_fee_11x: costSettings?.credit_card_fee_11x || 0,
    credit_card_fee_12x: costSettings?.credit_card_fee_12x || 0,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCostSettings(formData);
  };

  if (loading) {
    return <div className="text-white">Carregando configurações...</div>;
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-orange-500" />
          Configuração de Custos e Taxas
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure seus custos para calcular ROAS e lucro precisos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="advertising" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="advertising" className="text-gray-300 data-[state=active]:text-white">
                Publicidade
              </TabsTrigger>
              <TabsTrigger value="fees" className="text-gray-300 data-[state=active]:text-white">
                Taxas Gerais
              </TabsTrigger>
              <TabsTrigger value="credit" className="text-gray-300 data-[state=active]:text-white">
                Cartão de Crédito
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advertising" className="space-y-4">
              <div>
                <Label htmlFor="advertising_cost" className="text-gray-300">
                  Custo de Publicidade (R$)
                </Label>
                <Input
                  id="advertising_cost"
                  type="number"
                  step="0.01"
                  value={formData.advertising_cost}
                  onChange={(e) => handleInputChange('advertising_cost', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="0.00"
                />
              </div>
            </TabsContent>

            <TabsContent value="fees" className="space-y-4">
              <div>
                <Label htmlFor="checkout_fee" className="text-gray-300 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Taxa do Checkout (%)
                </Label>
                <Input
                  id="checkout_fee"
                  type="number"
                  step="0.01"
                  value={formData.checkout_fee_percentage}
                  onChange={(e) => handleInputChange('checkout_fee_percentage', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="pix_fee" className="text-gray-300 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Taxa Gateway PIX (%)
                </Label>
                <Input
                  id="pix_fee"
                  type="number"
                  step="0.01"
                  value={formData.pix_gateway_fee_percentage}
                  onChange={(e) => handleInputChange('pix_gateway_fee_percentage', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="0.00"
                />
              </div>
            </TabsContent>

            <TabsContent value="credit" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((installment) => (
                  <div key={installment}>
                    <Label htmlFor={`credit_${installment}x`} className="text-gray-300 text-sm flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      {installment}x (%)
                    </Label>
                    <Input
                      id={`credit_${installment}x`}
                      type="number"
                      step="0.01"
                      value={formData[`credit_card_fee_${installment}x` as keyof typeof formData]}
                      onChange={(e) => handleInputChange(`credit_card_fee_${installment}x`, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white text-sm"
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            type="submit" 
            className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white"
          >
            Salvar Configurações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
