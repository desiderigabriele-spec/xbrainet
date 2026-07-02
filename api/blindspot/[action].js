import { supabase } from '../../lib/supabase.js';
import { generateToken } from '../../lib/username.js';
import { extractAuthUserId } from '../../lib/auth.js';

// Consolidated owner-facing BLIND SPOT endpoint. URLs stay /api/blindspot/create|report.
// (Public respondent endpoints live in respond/[token].js and submit/[token].js.)
export default async function handler(req, res) {
  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  const { action } = req.query;
  if (action === 'create') return createLink(req, res, authUserId);
  if (action === 'report') return getReport(req, res, authUserId);
  return res.status(404).json({ error: 'Unknown action' });
}

async function createLink(req, res, authUserId) {
  if (req.method !== 'POST') return res.status(405).end();
  const { questions, tier, expiryDays = 3 } = req.body;

  if (tier === 'free') {
    return res.status(403).json({ error: 'UPGRADE_REQUIRED', message: 'BLIND SPOT requires VEGA or AION plan.' });
  }
  if (!questions?.length) return res.status(400).json({ error: 'At least one question required' });

  const linkToken = generateToken(10);
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase.from('blind_spot_links')
    .insert({ user_id: authUserId, link_token: linkToken, questions, expires_at: expiresAt })
    .select().single();

  if (error) return res.status(500).json({ error });
  res.status(200).json({
    linkToken,
    url:       `${process.env.NEXT_PUBLIC_URL}/bs/${linkToken}`,
    expiresAt
  });
}

async function getReport(req, res, authUserId) {
  if (req.method !== 'GET') return res.status(405).end();
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token required' });

  const { data: link, error } = await supabase.from('blind_spot_links')
    .select('ai_report, respondent_count, min_responses, report_generated_at, is_active, expires_at')
    .eq('link_token', token).eq('user_id', authUserId).single();

  if (error || !link) return res.status(404).json({ error: 'Not found' });

  res.status(200).json({
    report:          link.ai_report,
    respondentCount: link.respondent_count,
    minResponses:    link.min_responses,
    ready:           !!link.ai_report,
    generatedAt:     link.report_generated_at
  });
}
