
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

    // Extract order data from webhook payload
    const orderData = {
      external_id: requestBody.external_id || requestBody.id || `WH-${Date.now()}`,
      customer_name: requestBody.customer?.name || requestBody.customer_name || 'Cliente Webhook',
      customer_email: requestBody.customer?.email || requestBody.customer_email || 'webhook@exemplo.com',
      customer_phone: requestBody.customer?.phone || requestBody.customer_phone,
      customer_document: requestBody.customer?.document || requestBody.customer_document,
      amount: Number(requestBody.amount || requestBody.value || 0),
      paid_amount: Number(requestBody.paid_amount || requestBody.amount || 0),
      payment_method: requestBody.payment_method || requestBody.method || 'webhook',
      status: requestBody.status || 'pending',
      paid_at: requestBody.paid_at ? new Date(requestBody.paid_at).toISOString() : null,
      
      // Address data
      address_street: requestBody.address?.street || requestBody.customer?.address?.street,
      address_number: requestBody.address?.number || requestBody.customer?.address?.number,
      address_complement: requestBody.address?.complement || requestBody.customer?.address?.complement,
      address_neighborhood: requestBody.address?.neighborhood || requestBody.customer?.address?.neighborhood,
      address_city: requestBody.address?.city || requestBody.customer?.address?.city,
      address_state: requestBody.address?.state || requestBody.customer?.address?.state,
      address_zip_code: requestBody.address?.zip_code || requestBody.customer?.address?.zip_code,
      address_country: requestBody.address?.country || requestBody.customer?.address?.country || 'Brasil',
      
      // Additional data
      items: requestBody.items ? JSON.stringify(requestBody.items) : null,
      metadata: requestBody.metadata ? JSON.stringify(requestBody.metadata) : JSON.stringify(requestBody),
      secure_url: requestBody.secure_url || requestBody.checkout_url,
      qr_code: requestBody.qr_code || requestBody.pix_qr_code,
    };

    console.log('Processed order data:', JSON.stringify(orderData, null, 2));

    // Check if order already exists
    const { data: existingOrder } = await supabaseClient
      .from('orders')
      .select('id')
      .eq('external_id', orderData.external_id)
      .single();

    let result;
    if (existingOrder) {
      // Update existing order
      const { data, error } = await supabaseClient
        .from('orders')
        .update({
          ...orderData,
          updated_at: new Date().toISOString()
        })
        .eq('external_id', orderData.external_id)
        .select();

      if (error) throw error;
      result = { action: 'updated', data };
      console.log('Order updated:', orderData.external_id);
    } else {
      // Insert new order
      const { data, error } = await supabaseClient
        .from('orders')
        .insert(orderData)
        .select();

      if (error) throw error;
      result = { action: 'created', data };
      console.log('Order created:', orderData.external_id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Order ${result.action} successfully`,
        order_id: result.data?.[0]?.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
