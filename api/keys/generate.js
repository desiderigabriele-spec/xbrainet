import { supabase } from '../../lib/supabase.js';
import { generateToken } from '../../lib/username.js';
import { extractAuthUserId } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  const { relationLabel, tier } = req.body;

  if (tier === 'free') {
    return res.status(403).json({ error: 'UPGRADE_REQUIRED', message: 'Neural Link requires VEGA or AION plan.' });
  }

  const sessionKey = `LINK-${generateToken(4)}-${generateToken(4)}`;
  const expiresAt  = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase.from('relations')
    .insert({
      user_id:         authUserId,
      session_key:     sessionKey,
      key_expires_at:  expiresAt,
      relation_label:  relationLabel || 'connection'
    })
    .select().single();

  if (error) return res.status(500).json({ error });
  res.status(200).json({ sessionKey, expiresAt, relationId: data.id });
}
