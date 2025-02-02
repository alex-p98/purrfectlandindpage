import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const priceToScans = {
  'price_1Qo8TUCOvOG1UFSmRbo38vLP': 1,  // $5 for 1 scan
  'price_1Qo8TGCOvOG1UFSm5GlRMQju': 5,  // $10 for 5 scans
  'price_1Qo8TzCOvOG1UFSm5uR6YpH8': 20, // $15 for 20 scans
};

serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature || '',
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const priceId = session.line_items?.data[0]?.price?.id;

      if (!userId || !priceId) {
        throw new Error('Missing user ID or price ID');
      }

      const scansToAdd = priceToScans[priceId as keyof typeof priceToScans];
      
      if (!scansToAdd) {
        throw new Error('Invalid price ID');
      }

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { data: usage, error: fetchError } = await supabaseClient
        .from('user_usage')
        .select('scans_this_month')
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      const currentScans = usage?.scans_this_month || 0;
      const newScanCount = currentScans + scansToAdd;

      const { error: updateError } = await supabaseClient
        .from('user_usage')
        .update({ scans_this_month: newScanCount })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { status: 400 }
    );
  }
});