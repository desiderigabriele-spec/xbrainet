import { supabase } from '../../lib/supabase.js';
import { extractAuthUserId } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'Data required' });

  const { error } = await supabase.from('digital_brains')
    .upsert({ user_id: authUserId, ...data, updated_at: new Date().toISOString() },
             { onConflict: 'user_id' });
  if (error) return res.status(500).json({ error });
  res.status(200).json({ success: true });
}
