import { supabase } from '../../lib/supabase.js';
import { extractAuthUserId } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token required' });

  const { data: link, error } = await supabase.from('blind_spot_links')
    .select('ai_report, respondent_count, min_responses, report_generated_at, is_active, expires_at')
    .eq('link_token', token).eq('user_id', authUserId).single();

  if (error || !link) return res.status(404).json({ error: 'Not found' });

  res.status(200).json({
    report:         link.ai_report,
    respondentCount: link.respondent_count,
    minResponses:   link.min_responses,
    ready:          !!link.ai_report,
    generatedAt:    link.report_generated_at
  });
}
