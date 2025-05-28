
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
    console.log('Received webhook data:', JSON.stringify(requestBody, null, 2));

    // Extract external_id with better fallback logic
    const externalId = requestBody.external_id || 
                      requestBody.id || 
                      requestBody.order_id || 
                      requestBody.transaction_id || 
                      `WH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Extract order data from webhook payload with improved field mapping
    const orderData = {
      external_id: externalId,
      customer_name: requestBody.customer?.name || requestBody.customer_name || requestBody.payer?.name || 'Cliente Webhook',
      customer_email: requestBody.customer?.email || requestBody.customer_email || requestBody.payer?.email || 'webhook@exemplo.com',
      customer_phone: requestBody.customer?.phone || requestBody.customer_phone || requestBody.payer?.phone,
      customer_document: requestBody.customer?.document || requestBody.customer_document || requestBody.payer?.document,
      customer_birth_date: requestBody.customer?.birth_date || requestBody.customer_birth_date || requestBody.payer?.birth_date,
      customer_gender: requestBody.customer?.gender || requestBody.customer_gender || requestBody.payer?.gender,
      
      amount: Number(requestBody.amount || requestBody.value || requestBody.total || 0),
      paid_amount: Number(requestBody.paid_amount || requestBody.amount || requestBody.value || requestBody.total || 0),
      discount_amount: Number(requestBody.discount_amount || requestBody.discount || 0),
      tax_amount: Number(requestBody.tax_amount || requestBody.tax || 0),
      shipping_amount: Number(requestBody.shipping_amount || requestBody.shipping || 0),
      refund_amount: Number(requestBody.refund_amount || requestBody.refund || 0),
      
      payment_method: requestBody.payment_method || requestBody.method || requestBody.payment_type || 'webhook',
      payment_gateway: requestBody.payment_gateway || requestBody.gateway || requestBody.provider,
      transaction_id: requestBody.transaction_id || requestBody.gateway_transaction_id || requestBody.tid,
      installments: Number(requestBody.installments || requestBody.parcelas || 1),
      
      status: requestBody.status || 'pending',
      paid_at: requestBody.paid_at ? new Date(requestBody.paid_at).toISOString() : null,
      due_date: requestBody.due_date ? new Date(requestBody.due_date).toISOString() : null,
      cancelled_at: requestBody.cancelled_at ? new Date(requestBody.cancelled_at).toISOString() : null,
      cancelled_reason: requestBody.cancelled_reason || requestBody.cancel_reason,
      expired_at: requestBody.expired_at ? new Date(requestBody.expired_at).toISOString() : null,
      refund_reason: requestBody.refund_reason,
      
      // Address data with improved mapping
      address_street: requestBody.address?.street || requestBody.customer?.address?.street || requestBody.payer?.address?.street,
      address_number: requestBody.address?.number || requestBody.customer?.address?.number || requestBody.payer?.address?.number,
      address_complement: requestBody.address?.complement || requestBody.customer?.address?.complement || requestBody.payer?.address?.complement,
      address_neighborhood: requestBody.address?.neighborhood || requestBody.customer?.address?.neighborhood || requestBody.payer?.address?.neighborhood,
      address_city: requestBody.address?.city || requestBody.customer?.address?.city || requestBody.payer?.address?.city,
      address_state: requestBody.address?.state || requestBody.customer?.address?.state || requestBody.payer?.address?.state,
      address_zip_code: requestBody.address?.zip_code || requestBody.customer?.address?.zip_code || requestBody.payer?.address?.zip_code,
      address_country: requestBody.address?.country || requestBody.customer?.address?.country || requestBody.payer?.address?.country || 'Brasil',
      
      // Billing address
      billing_address_street: requestBody.billing_address?.street || requestBody.billing?.street,
      billing_address_number: requestBody.billing_address?.number || requestBody.billing?.number,
      billing_address_complement: requestBody.billing_address?.complement || requestBody.billing?.complement,
      billing_address_neighborhood: requestBody.billing_address?.neighborhood || requestBody.billing?.neighborhood,
      billing_address_city: requestBody.billing_address?.city || requestBody.billing?.city,
      billing_address_state: requestBody.billing_address?.state || requestBody.billing?.state,
      billing_address_zip_code: requestBody.billing_address?.zip_code || requestBody.billing?.zip_code,
      billing_address_country: requestBody.billing_address?.country || requestBody.billing?.country,
      
      // Payment specific data
      pix_key: requestBody.pix_key || requestBody.pix?.key || requestBody.qr_code_key,
      barcode: requestBody.barcode || requestBody.boleto?.barcode || requestBody.payment_code,
      payment_link: requestBody.payment_link || requestBody.checkout_url || requestBody.payment_url,
      
      // Additional data
      items: requestBody.items ? JSON.stringify(requestBody.items) : null,
      metadata: requestBody.metadata ? JSON.stringify(requestBody.metadata) : JSON.stringify(requestBody),
      secure_url: requestBody.secure_url || requestBody.checkout_url || requestBody.payment_url,
      qr_code: requestBody.qr_code || requestBody.pix_qr_code || requestBody.qr_code_base64,
      notes: requestBody.notes || requestBody.description || requestBody.comments,
      tags: requestBody.tags || (requestBody.tags ? [requestBody.tags] : null),
      
      // Webhook tracking
      webhook_source: requestBody.source || requestBody.webhook_source || 'unknown',
      webhook_event: requestBody.event || requestBody.webhook_event || 'order_update',
    };

    console.log('Processed order data:', JSON.stringify(orderData, null, 2));
    console.log('Looking for existing order with external_id:', externalId);

    // Check if order already exists with better error handling
    const { data: existingOrder, error: selectError } = await supabaseClient
      .from('orders')
      .select('id, status, updated_at')
      .eq('external_id', externalId)
      .maybeSingle();

    if (selectError) {
      console.error('Error checking for existing order:', selectError);
      throw new Error(`Database query error: ${selectError.message}`);
    }

    let result;
    if (existingOrder) {
      console.log('Found existing order:', existingOrder.id, 'with status:', existingOrder.status);
      
      // Update existing order with current timestamp
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
        console.error('Error updating order:', error);
        throw new Error(`Update error: ${error.message}`);
      }

      result = { action: 'updated', data, previous_status: existingOrder.status };
      console.log('Order updated successfully:', externalId, 'New status:', orderData.status);
    } else {
      console.log('No existing order found, creating new order');
      
      // Insert new order
      const { data, error } = await supabaseClient
        .from('orders')
        .insert(orderData)
        .select();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error(`Insert error: ${error.message}`);
      }

      result = { action: 'created', data };
      console.log('Order created successfully:', externalId);
    }

    const responseData = { 
      success: true, 
      message: `Order ${result.action} successfully`,
      order_id: result.data?.[0]?.id,
      external_id: externalId,
      action: result.action
    };

    if (result.previous_status) {
      responseData.previous_status = result.previous_status;
      responseData.new_status = orderData.status;
    }

    console.log('Webhook response:', responseData);

    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    
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
