import { supabase } from '../../lib/supabase.js';
import { extractAuthUserId } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  await supabase.from('conversations').delete().eq('user_id', authUserId);
  await supabase.from('blind_spot_links').delete().eq('user_id', authUserId);
  await supabase.from('relations').delete().eq('user_id', authUserId);
  await supabase.from('digital_brains').delete().eq('user_id', authUserId);

  await supabase.from('users').update({
    phone_hash: 'DELETED_' + Date.now(),
    username:   'DELETED_' + Date.now()
  }).eq('id', authUserId);

  res.status(200).json({ success: true });
}
