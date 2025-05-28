
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestBody = await req.json();
    console.log('🎯 WEBHOOK RECEBIDO - Dados completos:', JSON.stringify(requestBody, null, 2));

    // Função para extrair valores numéricos de forma mais robusta
    const extractNumericValue = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0;
      
      // Se já é um número
      if (typeof value === 'number') return Math.max(0, value);
      
      // Se é string, tenta converter
      if (typeof value === 'string') {
        // Remove caracteres não numéricos exceto ponto e vírgula
        const cleanValue = value.replace(/[^\d.,]/g, '');
        // Substitui vírgula por ponto para conversão
        const normalizedValue = cleanValue.replace(',', '.');
        const parsed = parseFloat(normalizedValue);
        return isNaN(parsed) ? 0 : Math.max(0, parsed);
      }
      
      return 0;
    };

    // Função para extrair texto de forma mais robusta
    const extractTextValue = (value: any, fallback: string = ''): string => {
      if (value === null || value === undefined) return fallback;
      return String(value).trim() || fallback;
    };

    // Extração melhorada do external_id - agora verifica primeiro no data.id se existir
    let externalId = '';
    
    if (requestBody.data?.id) {
      externalId = String(requestBody.data.id);
    } else {
      externalId = extractTextValue(
        requestBody.external_id || 
        requestBody.id || 
        requestBody.order_id || 
        requestBody.transaction_id ||
        requestBody.payment_id ||
        requestBody.reference_id
      ) || `WH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    console.log('🔍 External ID extraído:', externalId);

    // Extração robusta do valor principal - verifica primeiro data.amount
    let extractedAmount = 0;
    
    if (requestBody.data?.amount) {
      extractedAmount = extractNumericValue(requestBody.data.amount);
      console.log('💰 Valor encontrado em data.amount:', extractedAmount);
    } else {
      const amountSources = [
        requestBody.amount,
        requestBody.value, 
        requestBody.total,
        requestBody.price,
        requestBody.total_amount,
        requestBody.order_value,
        requestBody.transaction_amount
      ];

      for (const source of amountSources) {
        const value = extractNumericValue(source);
        if (value > 0) {
          extractedAmount = value;
          console.log('💰 Valor encontrado:', value, 'de:', source);
          break;
        }
      }
    }

    // Extração do nome do cliente - verifica primeiro data.customer.name
    let extractedCustomerName = '';
    
    if (requestBody.data?.customer?.name) {
      extractedCustomerName = extractTextValue(requestBody.data.customer.name);
      console.log('👤 Nome do cliente encontrado em data.customer.name:', extractedCustomerName);
    } else {
      const customerNameSources = [
        requestBody.customer?.name,
        requestBody.customer_name,
        requestBody.payer?.name,
        requestBody.buyer?.name,
        requestBody.user?.name,
        requestBody.name,
        requestBody.customer?.full_name,
        requestBody.full_name
      ];

      for (const source of customerNameSources) {
        const name = extractTextValue(source);
        if (name && name !== 'Cliente Webhook' && name.length > 2) {
          extractedCustomerName = name;
          console.log('👤 Nome do cliente encontrado:', name);
          break;
        }
      }
    }

    if (!extractedCustomerName) {
      extractedCustomerName = `Cliente ${externalId.slice(-6)}`;
    }

    // Extração do email do cliente - verifica primeiro data.customer.email
    let extractedCustomerEmail = '';
    
    if (requestBody.data?.customer?.email) {
      extractedCustomerEmail = extractTextValue(requestBody.data.customer.email);
      console.log('📧 Email do cliente encontrado em data.customer.email:', extractedCustomerEmail);
    } else {
      const customerEmailSources = [
        requestBody.customer?.email,
        requestBody.customer_email,
        requestBody.payer?.email,
        requestBody.buyer?.email,
        requestBody.user?.email,
        requestBody.email
      ];

      for (const source of customerEmailSources) {
        const email = extractTextValue(source);
        if (email && email.includes('@') && email !== 'webhook@exemplo.com') {
          extractedCustomerEmail = email;
          console.log('📧 Email do cliente encontrado:', email);
          break;
        }
      }
    }

    if (!extractedCustomerEmail) {
      extractedCustomerEmail = `cliente.${externalId.slice(-6).toLowerCase()}@exemplo.com`;
    }

    // Extração do método de pagamento - verifica primeiro data.paymentMethod
    let extractedPaymentMethod = '';
    
    if (requestBody.data?.paymentMethod) {
      extractedPaymentMethod = extractTextValue(requestBody.data.paymentMethod);
      console.log('💳 Método de pagamento encontrado em data.paymentMethod:', extractedPaymentMethod);
    } else {
      const paymentMethodSources = [
        requestBody.payment_method,
        requestBody.method,
        requestBody.payment_type,
        requestBody.type,
        requestBody.payment?.method,
        requestBody.payment?.type
      ];

      for (const source of paymentMethodSources) {
        const method = extractTextValue(source);
        if (method && method !== 'webhook' && method !== 'transaction') {
          extractedPaymentMethod = method;
          console.log('💳 Método de pagamento encontrado:', method);
          break;
        }
      }
    }

    if (!extractedPaymentMethod) {
      extractedPaymentMethod = 'pix'; // Default mais comum
    }

    // Extração do status - verifica primeiro data.status
    let extractedStatus = '';
    
    if (requestBody.data?.status) {
      extractedStatus = extractTextValue(requestBody.data.status);
      console.log('📊 Status encontrado em data.status:', extractedStatus);
    } else {
      const statusSources = [
        requestBody.status,
        requestBody.payment_status,
        requestBody.order_status,
        requestBody.state,
        requestBody.payment?.status
      ];

      for (const source of statusSources) {
        const status = extractTextValue(source);
        if (status) {
          extractedStatus = status;
          console.log('📊 Status encontrado:', status);
          break;
        }
      }
    }

    if (!extractedStatus) {
      extractedStatus = extractedAmount > 0 ? 'paid' : 'pending';
    }

    // Extração do valor pago
    let extractedPaidAmount = 0;
    if (requestBody.data?.paidAmount) {
      extractedPaidAmount = extractNumericValue(requestBody.data.paidAmount);
    } else if (requestBody.data?.paid_amount) {
      extractedPaidAmount = extractNumericValue(requestBody.data.paid_amount);
    } else {
      extractedPaidAmount = extractNumericValue(requestBody.paid_amount) || extractedAmount;
    }

    // Monta o objeto final com todos os dados extraídos
    const orderData = {
      external_id: externalId,
      customer_name: extractedCustomerName,
      customer_email: extractedCustomerEmail,
      customer_phone: extractTextValue(
        requestBody.data?.customer?.phone ||
        requestBody.customer?.phone || 
        requestBody.customer_phone || 
        requestBody.payer?.phone || 
        requestBody.phone
      ),
      customer_document: extractTextValue(
        requestBody.data?.customer?.document?.number ||
        requestBody.customer?.document || 
        requestBody.customer_document || 
        requestBody.payer?.document || 
        requestBody.document
      ),
      customer_birth_date: requestBody.data?.customer?.birthdate || requestBody.customer?.birth_date || requestBody.customer_birth_date || requestBody.payer?.birth_date,
      customer_gender: extractTextValue(
        requestBody.data?.customer?.gender ||
        requestBody.customer?.gender || 
        requestBody.customer_gender || 
        requestBody.payer?.gender
      ),
      
      amount: extractedAmount,
      paid_amount: extractedPaidAmount,
      discount_amount: extractNumericValue(requestBody.discount_amount || requestBody.discount),
      tax_amount: extractNumericValue(requestBody.tax_amount || requestBody.tax),
      shipping_amount: extractNumericValue(requestBody.data?.shipping?.fee || requestBody.shipping_amount || requestBody.shipping),
      refund_amount: extractNumericValue(requestBody.refund_amount || requestBody.refund),
      
      payment_method: extractedPaymentMethod,
      payment_gateway: extractTextValue(requestBody.payment_gateway || requestBody.gateway || requestBody.provider),
      transaction_id: extractTextValue(requestBody.data?.id || requestBody.transaction_id || requestBody.gateway_transaction_id || requestBody.tid),
      installments: Math.max(1, extractNumericValue(requestBody.data?.installments || requestBody.installments || requestBody.parcelas) || 1),
      
      status: extractedStatus,
      paid_at: requestBody.data?.paidAt ? new Date(requestBody.data.paidAt).toISOString() : (extractedStatus.toLowerCase().includes('paid') ? new Date().toISOString() : null),
      due_date: requestBody.due_date ? new Date(requestBody.due_date).toISOString() : null,
      cancelled_at: requestBody.cancelled_at ? new Date(requestBody.cancelled_at).toISOString() : null,
      cancelled_reason: extractTextValue(requestBody.cancelled_reason || requestBody.cancel_reason),
      expired_at: requestBody.expired_at ? new Date(requestBody.expired_at).toISOString() : null,
      refund_reason: extractTextValue(requestBody.refund_reason),
      
      // Address data - verifica primeiro data.customer.address e data.shipping.address
      address_street: extractTextValue(
        requestBody.data?.customer?.address?.street || 
        requestBody.data?.shipping?.address?.street ||
        requestBody.address?.street || 
        requestBody.customer?.address?.street || 
        requestBody.payer?.address?.street
      ),
      address_number: extractTextValue(
        requestBody.data?.customer?.address?.streetNumber || 
        requestBody.data?.shipping?.address?.streetNumber ||
        requestBody.address?.number || 
        requestBody.customer?.address?.number || 
        requestBody.payer?.address?.number
      ),
      address_complement: extractTextValue(
        requestBody.data?.customer?.address?.complement || 
        requestBody.data?.shipping?.address?.complement ||
        requestBody.address?.complement || 
        requestBody.customer?.address?.complement || 
        requestBody.payer?.address?.complement
      ),
      address_neighborhood: extractTextValue(
        requestBody.data?.customer?.address?.neighborhood || 
        requestBody.data?.shipping?.address?.neighborhood ||
        requestBody.address?.neighborhood || 
        requestBody.customer?.address?.neighborhood || 
        requestBody.payer?.address?.neighborhood
      ),
      address_city: extractTextValue(
        requestBody.data?.customer?.address?.city || 
        requestBody.data?.shipping?.address?.city ||
        requestBody.address?.city || 
        requestBody.customer?.address?.city || 
        requestBody.payer?.address?.city
      ),
      address_state: extractTextValue(
        requestBody.data?.customer?.address?.state || 
        requestBody.data?.shipping?.address?.state ||
        requestBody.address?.state || 
        requestBody.customer?.address?.state || 
        requestBody.payer?.address?.state
      ),
      address_zip_code: extractTextValue(
        requestBody.data?.customer?.address?.zipCode || 
        requestBody.data?.shipping?.address?.zipCode ||
        requestBody.address?.zip_code || 
        requestBody.customer?.address?.zip_code || 
        requestBody.payer?.address?.zip_code
      ),
      address_country: extractTextValue(
        requestBody.data?.customer?.address?.country || 
        requestBody.data?.shipping?.address?.country ||
        requestBody.address?.country || 
        requestBody.customer?.address?.country || 
        requestBody.payer?.address?.country
      ) || 'Brasil',
      
      // Billing address
      billing_address_street: extractTextValue(requestBody.billing_address?.street || requestBody.billing?.street),
      billing_address_number: extractTextValue(requestBody.billing_address?.number || requestBody.billing?.number),
      billing_address_complement: extractTextValue(requestBody.billing_address?.complement || requestBody.billing?.complement),
      billing_address_neighborhood: extractTextValue(requestBody.billing_address?.neighborhood || requestBody.billing?.neighborhood),
      billing_address_city: extractTextValue(requestBody.billing_address?.city || requestBody.billing?.city),
      billing_address_state: extractTextValue(requestBody.billing_address?.state || requestBody.billing?.state),
      billing_address_zip_code: extractTextValue(requestBody.billing_address?.zip_code || requestBody.billing?.zip_code),
      billing_address_country: extractTextValue(requestBody.billing_address?.country || requestBody.billing?.country),
      
      // Payment specific data
      pix_key: extractTextValue(requestBody.data?.pix?.qrcode || requestBody.pix_key || requestBody.pix?.key || requestBody.qr_code_key),
      barcode: extractTextValue(requestBody.barcode || requestBody.boleto?.barcode || requestBody.payment_code),
      payment_link: extractTextValue(requestBody.data?.secureUrl || requestBody.payment_link || requestBody.checkout_url || requestBody.payment_url),
      
      // Additional data
      items: requestBody.data?.items ? JSON.stringify(requestBody.data.items) : (requestBody.items ? JSON.stringify(requestBody.items) : null),
      metadata: requestBody.data?.metadata ? JSON.stringify(requestBody.data.metadata) : (requestBody.metadata ? JSON.stringify(requestBody.metadata) : JSON.stringify(requestBody)),
      secure_url: extractTextValue(requestBody.data?.secureUrl || requestBody.secure_url || requestBody.checkout_url || requestBody.payment_url),
      qr_code: extractTextValue(requestBody.data?.pix?.qrcode || requestBody.qr_code || requestBody.pix_qr_code || requestBody.qr_code_base64),
      notes: extractTextValue(requestBody.notes || requestBody.description || requestBody.comments),
      tags: requestBody.tags || (requestBody.tags ? [requestBody.tags] : null),
      
      // Webhook tracking
      webhook_source: extractTextValue(requestBody.source || requestBody.webhook_source) || 'unknown',
      webhook_event: extractTextValue(requestBody.event || requestBody.webhook_event || requestBody.type) || 'order_update',
    };

    console.log('✅ DADOS PROCESSADOS FINAL:', JSON.stringify({
      external_id: orderData.external_id,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      amount: orderData.amount,
      payment_method: orderData.payment_method,
      status: orderData.status
    }, null, 2));

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

    const responseData = { 
      success: true, 
      message: `Order ${result.action} successfully`,
      order_id: result.data?.[0]?.id,
      external_id: externalId,
      action: result.action,
      extracted_data: {
        amount: orderData.amount,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        payment_method: orderData.payment_method,
        status: orderData.status
      }
    };

    if (result.previous_status) {
      responseData.previous_status = result.previous_status;
      responseData.new_status = orderData.status;
    }

    console.log('🎉 RESPOSTA FINAL DO WEBHOOK:', responseData);

    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('💥 ERRO NO WEBHOOK:', error);
    
    const errorResponse = { 
      error: 'Internal server error', 
      details: error.message,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
