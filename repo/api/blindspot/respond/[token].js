import { supabase } from '../../../lib/supabase.js';

// Public endpoint — no auth required
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { token } = req.query;

  const { data: link, error } = await supabase.from('blind_spot_links')
    .select('questions, is_active, expires_at').eq('link_token', token).single();

  if (error || !link)  return res.status(404).json({ error: 'Link not found' });
  if (!link.is_active) return res.status(400).json({ error: 'This link has been deactivated' });
  if (new Date(link.expires_at) < new Date()) return res.status(400).json({ error: 'This link has expired' });

  res.status(200).json({ questions: link.questions });
}
