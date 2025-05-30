
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processWebhookData } from './data-processor.ts';
import { processOrderInDatabase } from './database.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const requestBody = await req.json();
    
    // Process webhook data
    const orderData = processWebhookData(requestBody);
    
    // Process order in database
    const result = await processOrderInDatabase(orderData, orderData.external_id);

    const responseData = { 
      success: true, 
      message: `Order ${result.action} successfully`,
      order_id: result.data?.[0]?.id,
      external_id: orderData.external_id,
      action: result.action,
      extracted_data: {
        amount: orderData.amount,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        payment_method: orderData.payment_method,
        status: orderData.status,
        products: JSON.parse(orderData.items)
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
