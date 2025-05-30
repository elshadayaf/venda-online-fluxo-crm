
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

    // Função para extrair valores numéricos e detectar se está em centavos
    const extractNumericValue = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0;
      
      // Se já é um número
      if (typeof value === 'number') {
        // Se o valor é muito alto (provavelmente em centavos), divide por 100
        if (value >= 1000 && Number.isInteger(value)) {
          console.log('💰 Valor detectado em centavos:', value, 'convertendo para:', value / 100);
          return Math.max(0, value / 100);
        }
        return Math.max(0, value);
      }
      
      // Se é string, tenta converter
      if (typeof value === 'string') {
        // Remove caracteres não numéricos exceto ponto e vírgula
        const cleanValue = value.replace(/[^\d.,]/g, '');
        // Substitui vírgula por ponto para conversão
        const normalizedValue = cleanValue.replace(',', '.');
        const parsed = parseFloat(normalizedValue);
        if (isNaN(parsed)) return 0;
        
        // Se o valor é muito alto (provavelmente em centavos), divide por 100
        if (parsed >= 1000 && Number.isInteger(parsed)) {
          console.log('💰 Valor string detectado em centavos:', parsed, 'convertendo para:', parsed / 100);
          return Math.max(0, parsed / 100);
        }
        return Math.max(0, parsed);
      }
      
      return 0;
    };

    // Função para extrair texto de forma mais robusta
    const extractTextValue = (value: any, fallback: string = ''): string => {
      if (value === null || value === undefined) return fallback;
      return String(value).trim() || fallback;
    };

    // Função para extrair informações dos produtos do payload
    const extractProductsInfo = (requestBody: any): any[] => {
      console.log('🛍️ Extraindo informações dos produtos...');
      
      // Possíveis locais onde os produtos podem estar no payload
      const productSources = [
        requestBody.items,
        requestBody.products,
        requestBody.data?.items,
        requestBody.data?.products,
        requestBody.order?.items,
        requestBody.order?.products,
        requestBody.cart?.items,
        requestBody.line_items,
        requestBody.order_items
      ];

      let extractedProducts = [];

      for (const source of productSources) {
        if (Array.isArray(source) && source.length > 0) {
          console.log('📦 Produtos encontrados em:', source);
          extractedProducts = source.map((item: any) => ({
            name: extractTextValue(
              item.name || 
              item.product_name || 
              item.title || 
              item.description || 
              item.item_name ||
              item.product?.name ||
              item.product?.title
            ) || 'Produto sem nome',
            quantity: Math.max(1, extractNumericValue(item.quantity || item.qty || item.amount || 1)),
            price: extractNumericValue(
              item.price || 
              item.unit_price || 
              item.value || 
              item.amount ||
              item.product?.price
            ),
            sku: extractTextValue(item.sku || item.product_id || item.id || item.product?.sku),
            category: extractTextValue(item.category || item.product?.category)
          }));
          break;
        }
      }

      // Se não encontrou produtos estruturados, tenta extrair do nome do produto principal
      if (extractedProducts.length === 0) {
        const productNameSources = [
          requestBody.product_name,
          requestBody.data?.product_name,
          requestBody.item_name,
          requestBody.data?.item_name,
          requestBody.title,
          requestBody.data?.title,
          requestBody.description,
          requestBody.data?.description
        ];

        for (const source of productNameSources) {
          const productName = extractTextValue(source);
          if (productName && productName !== 'Produto Webhook') {
            extractedProducts = [{
              name: productName,
              quantity: 1,
              price: extractNumericValue(requestBody.amount || requestBody.data?.amount || 0),
              sku: extractTextValue(requestBody.sku || requestBody.data?.sku),
              category: extractTextValue(requestBody.category || requestBody.data?.category)
            }];
            console.log('📦 Produto extraído do nome principal:', productName);
            break;
          }
        }
      }

      // Se ainda não encontrou, cria um produto genérico baseado no external_id
      if (extractedProducts.length === 0) {
        const externalId = extractTextValue(
          requestBody.external_id || 
          requestBody.id || 
          requestBody.order_id
        );
        extractedProducts = [{
          name: `Produto ${externalId ? externalId.slice(-6) : 'Webhook'}`,
          quantity: 1,
          price: extractNumericValue(requestBody.amount || requestBody.data?.amount || 0),
          sku: externalId || '',
          category: 'Geral'
        }];
      }

      console.log('🛍️ Produtos extraídos finais:', extractedProducts);
      return extractedProducts;
    };

    // Função específica para extrair e normalizar método de pagamento
    const extractPaymentMethod = (requestBody: any): string => {
      // Lista de possíveis campos que podem conter o método de pagamento
      const paymentMethodSources = [
        requestBody.data?.payment_method,
        requestBody.data?.paymentMethod,
        requestBody.data?.method,
        requestBody.payment_method,
        requestBody.paymentMethod,
        requestBody.method,
        requestBody.payment_type,
        requestBody.type,
        requestBody.payment?.method,
        requestBody.payment?.type
      ];

      let rawMethod = '';
      for (const source of paymentMethodSources) {
        const method = extractTextValue(source);
        if (method && method !== 'webhook' && method !== 'transaction') {
          rawMethod = method;
          console.log('💳 Método de pagamento bruto encontrado:', method);
          break;
        }
      }

      // Se não encontrou método específico, tenta extrair do tipo de transação
      if (!rawMethod) {
        const transactionType = extractTextValue(requestBody.type);
        console.log('🔍 Tipo de transação encontrado:', transactionType);
        rawMethod = transactionType;
      }

      // Normaliza o método de pagamento
      const lowerMethod = rawMethod.toLowerCase();
      
      if (lowerMethod.includes('pix')) {
        console.log('✅ Método identificado como PIX');
        return 'pix';
      } else if (lowerMethod.includes('card') || lowerMethod.includes('cartao') || lowerMethod.includes('credit') || lowerMethod.includes('credito')) {
        console.log('✅ Método identificado como Cartão de Crédito');
        return 'cartao_credito';
      } else if (lowerMethod.includes('debit') || lowerMethod.includes('debito')) {
        console.log('✅ Método identificado como Cartão de Débito');
        return 'cartao_debito';
      } else if (lowerMethod.includes('boleto')) {
        console.log('✅ Método identificado como Boleto');
        return 'boleto';
      } else {
        console.log('⚠️ Método não identificado, usando valor original:', rawMethod || 'outros');
        return rawMethod || 'outros';
      }
    };

    // Extração melhorada do external_id
    const externalId = extractTextValue(
      requestBody.external_id || 
      requestBody.id || 
      requestBody.order_id || 
      requestBody.transaction_id ||
      requestBody.payment_id ||
      requestBody.reference_id
    ) || `WH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('🔍 External ID extraído:', externalId);

    // Extração robusta do valor principal - verifica primeiro no objeto data
    const amountSources = [
      requestBody.data?.amount,
      requestBody.data?.value,
      requestBody.data?.total,
      requestBody.amount,
      requestBody.value, 
      requestBody.total,
      requestBody.price,
      requestBody.total_amount,
      requestBody.order_value,
      requestBody.transaction_amount
    ];

    let extractedAmount = 0;
    for (const source of amountSources) {
      if (source !== null && source !== undefined) {
        const value = extractNumericValue(source);
        if (value > 0) {
          extractedAmount = value;
          console.log('💰 Valor encontrado:', value, 'de:', source, 'valor original:', source);
          break;
        }
      }
    }

    // Extração do nome do cliente - verifica primeiro no objeto data
    const customerNameSources = [
      requestBody.data?.customer?.name,
      requestBody.data?.customer_name,
      requestBody.data?.payer?.name,
      requestBody.customer?.name,
      requestBody.customer_name,
      requestBody.payer?.name,
      requestBody.buyer?.name,
      requestBody.user?.name,
      requestBody.name,
      requestBody.customer?.full_name,
      requestBody.full_name
    ];

    let extractedCustomerName = '';
    for (const source of customerNameSources) {
      const name = extractTextValue(source);
      if (name && name !== 'Cliente Webhook' && name.length > 2) {
        extractedCustomerName = name;
        console.log('👤 Nome do cliente encontrado:', name);
        break;
      }
    }

    if (!extractedCustomerName) {
      extractedCustomerName = `Cliente ${externalId.slice(-6)}`;
    }

    // Extração do email do cliente - verifica primeiro no objeto data
    const customerEmailSources = [
      requestBody.data?.customer?.email,
      requestBody.data?.customer_email,
      requestBody.data?.payer?.email,
      requestBody.customer?.email,
      requestBody.customer_email,
      requestBody.payer?.email,
      requestBody.buyer?.email,
      requestBody.user?.email,
      requestBody.email
    ];

    let extractedCustomerEmail = '';
    for (const source of customerEmailSources) {
      const email = extractTextValue(source);
      if (email && email.includes('@') && email !== 'webhook@exemplo.com') {
        extractedCustomerEmail = email;
        console.log('📧 Email do cliente encontrado:', email);
        break;
      }
    }

    if (!extractedCustomerEmail) {
      extractedCustomerEmail = `cliente.${externalId.slice(-6).toLowerCase()}@exemplo.com`;
    }

    // Extração do método de pagamento usando a função específica
    const extractedPaymentMethod = extractPaymentMethod(requestBody);

    // Extração do status
    const statusSources = [
      requestBody.data?.status,
      requestBody.data?.payment_status,
      requestBody.status,
      requestBody.payment_status,
      requestBody.order_status,
      requestBody.state,
      requestBody.payment?.status
    ];

    let extractedStatus = '';
    for (const source of statusSources) {
      const status = extractTextValue(source);
      if (status && status !== 'pending') {
        extractedStatus = status;
        console.log('📊 Status encontrado:', status);
        break;
      }
    }

    if (!extractedStatus) {
      extractedStatus = extractedAmount > 0 ? 'paid' : 'pending';
    }

    // Extrair informações dos produtos
    const extractedProducts = extractProductsInfo(requestBody);

    // Monta o objeto final com todos os dados extraídos
    const orderData = {
      external_id: externalId,
      customer_name: extractedCustomerName,
      customer_email: extractedCustomerEmail,
      customer_phone: extractTextValue(
        requestBody.data?.customer?.phone ||
        requestBody.data?.customer_phone ||
        requestBody.customer?.phone || 
        requestBody.customer_phone || 
        requestBody.payer?.phone || 
        requestBody.phone
      ),
      customer_document: extractTextValue(
        requestBody.data?.customer?.document ||
        requestBody.data?.customer_document ||
        requestBody.customer?.document || 
        requestBody.customer_document || 
        requestBody.payer?.document || 
        requestBody.document
      ),
      customer_birth_date: requestBody.data?.customer?.birth_date || requestBody.customer?.birth_date || requestBody.customer_birth_date || requestBody.payer?.birth_date,
      customer_gender: extractTextValue(
        requestBody.data?.customer?.gender ||
        requestBody.customer?.gender || 
        requestBody.customer_gender || 
        requestBody.payer?.gender
      ),
      
      amount: extractedAmount,
      paid_amount: extractNumericValue(requestBody.data?.paid_amount || requestBody.paid_amount) || extractedAmount,
      discount_amount: extractNumericValue(requestBody.data?.discount_amount || requestBody.discount_amount || requestBody.discount),
      tax_amount: extractNumericValue(requestBody.data?.tax_amount || requestBody.tax_amount || requestBody.tax),
      shipping_amount: extractNumericValue(requestBody.data?.shipping_amount || requestBody.shipping_amount || requestBody.shipping),
      refund_amount: extractNumericValue(requestBody.data?.refund_amount || requestBody.refund_amount || requestBody.refund),
      
      payment_method: extractedPaymentMethod,
      payment_gateway: extractTextValue(requestBody.data?.payment_gateway || requestBody.payment_gateway || requestBody.gateway || requestBody.provider),
      transaction_id: extractTextValue(requestBody.data?.transaction_id || requestBody.transaction_id || requestBody.gateway_transaction_id || requestBody.tid),
      installments: Math.max(1, extractNumericValue(requestBody.data?.installments || requestBody.installments || requestBody.parcelas) || 1),
      
      status: extractedStatus,
      paid_at: (requestBody.data?.paid_at || requestBody.paid_at) ? new Date(requestBody.data?.paid_at || requestBody.paid_at).toISOString() : (extractedStatus.toLowerCase().includes('paid') ? new Date().toISOString() : null),
      due_date: (requestBody.data?.due_date || requestBody.due_date) ? new Date(requestBody.data?.due_date || requestBody.due_date).toISOString() : null,
      cancelled_at: (requestBody.data?.cancelled_at || requestBody.cancelled_at) ? new Date(requestBody.data?.cancelled_at || requestBody.cancelled_at).toISOString() : null,
      cancelled_reason: extractTextValue(requestBody.data?.cancelled_reason || requestBody.cancelled_reason || requestBody.cancel_reason),
      expired_at: (requestBody.data?.expired_at || requestBody.expired_at) ? new Date(requestBody.data?.expired_at || requestBody.expired_at).toISOString() : null,
      refund_reason: extractTextValue(requestBody.data?.refund_reason || requestBody.refund_reason),
      
      // Address data
      address_street: extractTextValue(requestBody.address?.street || requestBody.customer?.address?.street || requestBody.payer?.address?.street),
      address_number: extractTextValue(requestBody.address?.number || requestBody.customer?.address?.number || requestBody.payer?.address?.number),
      address_complement: extractTextValue(requestBody.address?.complement || requestBody.customer?.address?.complement || requestBody.payer?.address?.complement),
      address_neighborhood: extractTextValue(requestBody.address?.neighborhood || requestBody.customer?.address?.neighborhood || requestBody.payer?.address?.neighborhood),
      address_city: extractTextValue(requestBody.address?.city || requestBody.customer?.address?.city || requestBody.payer?.address?.city),
      address_state: extractTextValue(requestBody.address?.state || requestBody.customer?.address?.state || requestBody.payer?.address?.state),
      address_zip_code: extractTextValue(requestBody.address?.zip_code || requestBody.customer?.address?.zip_code || requestBody.payer?.address?.zip_code),
      address_country: extractTextValue(requestBody.address?.country || requestBody.customer?.address?.country || requestBody.payer?.address?.country) || 'Brasil',
      
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
      pix_key: extractTextValue(requestBody.data?.pix_key || requestBody.pix_key || requestBody.pix?.key || requestBody.qr_code_key),
      barcode: extractTextValue(requestBody.data?.barcode || requestBody.barcode || requestBody.boleto?.barcode || requestBody.payment_code),
      payment_link: extractTextValue(requestBody.data?.payment_link || requestBody.payment_link || requestBody.checkout_url || requestBody.payment_url),
      
      // Additional data - AGORA INCLUINDO OS PRODUTOS EXTRAÍDOS
      items: JSON.stringify(extractedProducts),
      metadata: requestBody.metadata ? JSON.stringify(requestBody.metadata) : JSON.stringify(requestBody),
      secure_url: extractTextValue(requestBody.data?.secure_url || requestBody.secure_url || requestBody.checkout_url || requestBody.payment_url),
      qr_code: extractTextValue(requestBody.data?.qr_code || requestBody.qr_code || requestBody.pix_qr_code || requestBody.qr_code_base64),
      notes: extractTextValue(requestBody.data?.notes || requestBody.notes || requestBody.description || requestBody.comments),
      tags: requestBody.tags || (requestBody.tags ? [requestBody.tags] : null),
      
      // Webhook tracking
      webhook_source: extractTextValue(requestBody.source || requestBody.webhook_source) || 'unknown',
      webhook_event: extractTextValue(requestBody.event || requestBody.webhook_event) || 'order_update',
    };

    console.log('✅ DADOS PROCESSADOS FINAL:', JSON.stringify({
      external_id: orderData.external_id,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      amount: orderData.amount,
      payment_method: orderData.payment_method,
      status: orderData.status,
      products: extractedProducts
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
      console.log('➕ Criando novo pedido com valor:', orderData.amount, 'e produtos:', extractedProducts.length);
      
      const { data, error } = await supabaseClient
        .from('orders')
        .insert(orderData)
        .select();

      if (error) {
        console.error('❌ Erro ao criar pedido:', error);
        throw new Error(`Insert error: ${error.message}`);
      }

      result = { action: 'created', data };
      console.log('✅ Novo pedido criado:', externalId, 'Valor:', orderData.amount, 'Produtos:', extractedProducts.length);
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
        status: orderData.status,
        products: extractedProducts
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
