import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { userId, sessionKey } = req.body;

  const { data: relation, error } = await supabase.from('relations')
    .select('*').eq('session_key', sessionKey).single();

  if (error || !relation)      return res.status(404).json({ error: 'Key not found or expired' });
  if (relation.key_used)       return res.status(400).json({ error: 'Key already used' });
  if (new Date(relation.key_expires_at) < new Date()) return res.status(400).json({ error: 'Key expired' });
  if (relation.user_id === userId) return res.status(400).json({ error: 'Cannot connect to yourself' });

  await supabase.from('relations')
    .update({ related_user_id: userId, key_used: true }).eq('id', relation.id);

  res.status(200).json({ success: true, relationId: relation.id, label: relation.relation_label });
}
