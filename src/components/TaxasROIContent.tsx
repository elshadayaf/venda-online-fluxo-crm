
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CostConfigForm } from "@/components/CostConfigForm";
import { ROIMetricsDisplay } from "@/components/ROIMetricsDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TaxasROIContent() {
  return (
    <div className="flex-1 space-y-6 p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-white hover:bg-gray-800" />
        <div>
          <h1 className="text-3xl font-bold text-white">Taxas e ROI</h1>
          <p className="text-gray-400">
            Configure custos e acompanhe ROAS e lucro em tempo real
          </p>
        </div>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 max-w-md">
          <TabsTrigger 
            value="metrics" 
            className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-orange-600"
          >
            Métricas e ROAS
          </TabsTrigger>
          <TabsTrigger 
            value="config" 
            className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-orange-600"
          >
            Configurar Custos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <ROIMetricsDisplay />
        </TabsContent>

        <TabsContent value="config">
          <CostConfigForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
