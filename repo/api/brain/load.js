import { supabase } from '../../lib/supabase.js';
import { extractAuthUserId } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabase.from('digital_brains')
    .select('*').eq('user_id', authUserId).single();
  if (error) return res.status(404).json({ error: 'Brain not found' });
  res.status(200).json(data);
}
