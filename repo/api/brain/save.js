import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { userId, data } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const { error } = await supabase.from('digital_brains')
    .upsert({ user_id: userId, ...data, updated_at: new Date().toISOString() },
             { onConflict: 'user_id' });
  if (error) return res.status(500).json({ error });
  res.status(200).json({ success: true });
}
