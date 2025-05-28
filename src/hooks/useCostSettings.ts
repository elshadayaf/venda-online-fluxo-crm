
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type CostSettings = Tables<'cost_settings'>;

export const useCostSettings = () => {
  const [costSettings, setCostSettings] = useState<CostSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCostSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('cost_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setCostSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
      console.error('Erro ao buscar configurações de custo:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveCostSettings = async (settings: Partial<CostSettings>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (costSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('cost_settings')
          .update(settings)
          .eq('id', costSettings.id)
          .select()
          .single();

        if (error) throw error;
        setCostSettings(data);
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('cost_settings')
          .insert({ ...settings, user_id: user.id })
          .select()
          .single();

        if (error) throw error;
        setCostSettings(data);
      }

      toast({
        title: "Configurações salvas",
        description: "Suas configurações de custos foram salvas com sucesso.",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : 'Erro ao salvar configurações',
        variant: "destructive",
      });
      console.error('Erro ao salvar configurações:', err);
    }
  };

  useEffect(() => {
    fetchCostSettings();
  }, []);

  return { costSettings, loading, error, saveCostSettings, refetch: fetchCostSettings };
};
