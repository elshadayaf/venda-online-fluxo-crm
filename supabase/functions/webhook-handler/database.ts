
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OrderData } from './types.ts';

export const createSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

export const processOrderInDatabase = async (orderData: OrderData, externalId: string) => {
  const supabaseClient = createSupabaseClient();

  // Check if order already exists
  const { data: existingOrder, error: selectError } = await supabaseClient
    .from('orders')
    .select('id, status, updated_at, amount')
    .eq('external_id', externalId)
    .maybeSingle();

  if (selectError) {
    console.error('❌ Erro ao verificar pedido existente:', selectError);
    throw new Error(`Database query error: ${selectError.message}`);
  }

  let result;
  if (existingOrder) {
    console.log('🔄 Atualizando pedido existente:', existingOrder.id, 'Valor atual:', existingOrder.amount, 'Novo valor:', orderData.amount);
    
    const updateData = {
      ...orderData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseClient
      .from('orders')
      .update(updateData)
      .eq('external_id', externalId)
      .select();

    if (error) {
      console.error('❌ Erro ao atualizar pedido:', error);
      throw new Error(`Update error: ${error.message}`);
    }

    result = { action: 'updated', data, previous_status: existingOrder.status };
    console.log('✅ Pedido atualizado:', externalId, 'Status anterior:', existingOrder.status, 'Novo status:', orderData.status);
  } else {
    console.log('➕ Criando novo pedido com valor:', orderData.amount);
    
    const { data, error } = await supabaseClient
      .from('orders')
      .insert(orderData)
      .select();

    if (error) {
      console.error('❌ Erro ao criar pedido:', error);
      throw new Error(`Insert error: ${error.message}`);
    }

    result = { action: 'created', data };
    console.log('✅ Novo pedido criado:', externalId, 'Valor:', orderData.amount);
  }

  return result;
};
