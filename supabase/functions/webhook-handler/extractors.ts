
import { ProductInfo } from './types.ts';

// Função para extrair valores numéricos e detectar se está em centavos
export const extractNumericValue = (value: any): number => {
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
export const extractTextValue = (value: any, fallback: string = ''): string => {
  if (value === null || value === undefined) return fallback;
  return String(value).trim() || fallback;
};

// Função para extrair informações dos produtos do payload
export const extractProductsInfo = (requestBody: any): ProductInfo[] => {
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

  let extractedProducts: ProductInfo[] = [];

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
export const extractPaymentMethod = (requestBody: any): string => {
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
