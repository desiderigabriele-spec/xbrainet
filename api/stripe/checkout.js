import Stripe from 'stripe';
import { extractAuthUserId } from '../../lib/auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  vega: process.env.STRIPE_PRICE_VEGA,
  aion: process.env.STRIPE_PRICE_AION
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  const { tier, username } = req.body;
  if (!PRICES[tier]) return res.status(400).json({ error: 'Invalid tier' });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PRICES[tier], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}?upgrade=success&tier=${tier}`,
    cancel_url:  `${process.env.NEXT_PUBLIC_URL}?upgrade=cancelled`,
    metadata:    { userId: authUserId, tier, username }
  });

  res.status(200).json({ url: session.url });
}
