import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { userId, token } = req.query;

  const { data: link, error } = await supabase.from('blind_spot_links')
    .select('ai_report, respondent_count, min_responses, report_generated_at, is_active, expires_at')
    .eq('link_token', token).eq('user_id', userId).single();

  if (error || !link) return res.status(404).json({ error: 'Not found' });

  res.status(200).json({
    report:         link.ai_report,
    respondentCount: link.respondent_count,
    minResponses:   link.min_responses,
    ready:          !!link.ai_report,
    generatedAt:    link.report_generated_at
  });
}
