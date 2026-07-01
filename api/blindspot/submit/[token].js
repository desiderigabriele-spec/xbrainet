import { supabase } from '../../../lib/supabase.js';
import { anthropic } from '../../../lib/anthropic.js';

// Public endpoint — no auth required
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { token } = req.query;
  const { answers } = req.body;

  const { data: link, error } = await supabase.from('blind_spot_links')
    .select('*').eq('link_token', token).single();

  if (error || !link || !link.is_active) return res.status(404).json({ error: 'Link not found or inactive' });
  if (new Date(link.expires_at) < new Date()) return res.status(400).json({ error: 'Link expired' });

  // Aggregate responses — never store individual attribution
  const currentResponses = link.responses || [];
  currentResponses.push({ submitted_at: new Date().toISOString(), answers });

  const newCount = link.respondent_count + 1;

  await supabase.from('blind_spot_links').update({
    responses:        currentResponses,
    respondent_count: newCount
  }).eq('id', link.id);

  if (newCount >= link.min_responses && !link.ai_report) {
    generateBlindSpotReport(link.id, link.user_id, currentResponses, link.questions)
      .catch(console.error);
  }

  res.status(200).json({ success: true, message: 'Thank you. Your feedback has been submitted anonymously.' });
}

async function generateBlindSpotReport(linkId, userId, responses, questions) {
  const { data: brain } = await supabase.from('digital_brains')
    .select('*').eq('user_id', userId).single();

  const responseSummary = responses.map(r =>
    Object.entries(r.answers).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n')
  ).join('\n---\n');

  const brainSummary = brain ? `
Self-perception patterns:
- Core area: ${brain.area_primaria}
- Energy state: ${brain.stato_energetico}
- Decision approach: ${brain.protocollo_decisionale}
- Fears keywords: ${(brain.keywords_paure || []).join(', ')}
- Love keywords: ${(brain.keywords_amore || []).join(', ')}
` : 'No Digital Brain data available.';

  const report = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: `You are XBRAINET analyzing BLIND SPOT feedback.
Your task: compare what this person thinks of themselves with how others perceive them.
Identify the GAP — the blind spot.
Be cold, precise, constructive. Never identify individual respondents.
Format as 3 sections: PATTERN OBSERVED / BLIND SPOT IDENTIFIED / REFLECTION PROMPT
Keep it under 400 words. Frame everything as observation, not diagnosis.`,
    messages: [{
      role: 'user',
      content: `SELF-PERCEPTION (Digital Brain):\n${brainSummary}\n\nEXTERNAL FEEDBACK (${responses.length} anonymous responses):\n${responseSummary}`
    }]
  });

  await supabase.from('blind_spot_links').update({
    ai_report:            report.content[0].text,
    report_generated_at:  new Date().toISOString()
  }).eq('id', linkId);
}
