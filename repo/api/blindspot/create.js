import { supabase } from '../../lib/supabase.js';
import { generateToken } from '../../lib/username.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { userId, questions, tier, expiryDays = 3 } = req.body;

  if (tier === 'free') {
    return res.status(403).json({ error: 'UPGRADE_REQUIRED', message: 'BLIND SPOT requires VEGA or AION plan.' });
  }
  if (!questions?.length) return res.status(400).json({ error: 'At least one question required' });

  const linkToken = generateToken(10);
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase.from('blind_spot_links')
    .insert({ user_id: userId, link_token: linkToken, questions, expires_at: expiresAt })
    .select().single();

  if (error) return res.status(500).json({ error });
  res.status(200).json({
    linkToken,
    url:       `${process.env.NEXT_PUBLIC_URL}/bs/${linkToken}`,
    expiresAt
  });
}
