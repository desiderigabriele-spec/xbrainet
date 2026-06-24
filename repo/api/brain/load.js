import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const { data, error } = await supabase.from('digital_brains')
    .select('*').eq('user_id', userId).single();
  if (error) return res.status(404).json({ error: 'Brain not found' });
  res.status(200).json(data);
}
