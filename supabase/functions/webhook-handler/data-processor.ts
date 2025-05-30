
import { OrderData } from './types.ts';
import { extractNumericValue, extractTextValue, extractProductsInfo, extractPaymentMethod } from './extractors.ts';

export const processWebhookData = (requestBody: any): OrderData => {
  console.log('🎯 WEBHOOK RECEBIDO - Dados completos:', JSON.stringify(requestBody, null, 2));

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
  const orderData: OrderData = {
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

  return orderData;
};
