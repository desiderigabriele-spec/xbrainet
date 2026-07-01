import Stripe from 'stripe';
import { supabase } from '../../lib/supabase.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig  = req.headers['stripe-signature'];
  const body = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Webhook signature failed');
  }

  const entityMap = { vega: 'VEGA', aion: 'AION' };

  if (event.type === 'checkout.session.completed') {
    const { userId, tier } = event.data.object.metadata;
    await supabase.from('users').update({
      tier,
      entity:                 entityMap[tier],
      stripe_customer_id:     event.data.object.customer,
      stripe_subscription_id: event.data.object.subscription
    }).eq('id', userId);
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    await supabase.from('users')
      .update({ tier: 'free', entity: 'LYRA' })
      .eq('stripe_subscription_id', sub.id);
  }

  res.status(200).json({ received: true });
}

async function buffer(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}
