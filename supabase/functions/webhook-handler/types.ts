
export interface OrderData {
  external_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_document?: string;
  customer_birth_date?: string;
  customer_gender?: string;
  
  amount: number;
  paid_amount: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  refund_amount: number;
  
  payment_method: string;
  payment_gateway?: string;
  transaction_id?: string;
  installments: number;
  
  status: string;
  paid_at?: string;
  due_date?: string;
  cancelled_at?: string;
  cancelled_reason?: string;
  expired_at?: string;
  refund_reason?: string;
  
  // Address data
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  address_country?: string;
  
  // Billing address
  billing_address_street?: string;
  billing_address_number?: string;
  billing_address_complement?: string;
  billing_address_neighborhood?: string;
  billing_address_city?: string;
  billing_address_state?: string;
  billing_address_zip_code?: string;
  billing_address_country?: string;
  
  // Payment specific data
  pix_key?: string;
  barcode?: string;
  payment_link?: string;
  
  // Additional data
  items: string;
  metadata?: string;
  secure_url?: string;
  qr_code?: string;
  notes?: string;
  tags?: any;
  
  // Webhook tracking
  webhook_source: string;
  webhook_event: string;
}

export interface ProductInfo {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  category?: string;
}
