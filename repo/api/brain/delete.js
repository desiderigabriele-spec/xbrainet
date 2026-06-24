import { supabase } from '../../lib/supabase.js';

// GDPR Art. 17 — Right to erasure
export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  await supabase.from('conversations').delete().eq('user_id', userId);
  await supabase.from('blind_spot_links').delete().eq('user_id', userId);
  await supabase.from('relations').delete().eq('user_id', userId);
  await supabase.from('digital_brains').delete().eq('user_id', userId);

  // Anonymise user row — keep for audit trail but remove PII
  await supabase.from('users').update({
    phone_hash: 'DELETED_' + Date.now(),
    username:   'DELETED_' + Date.now()
  }).eq('id', userId);

  res.status(200).json({ success: true });
}
