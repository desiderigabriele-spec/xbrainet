import { supabase } from '../../lib/supabase.js';
import { anthropic, MODELS } from '../../lib/anthropic.js';
import { generateToken } from '../../lib/username.js';
import { extractAuthUserId } from '../../lib/auth.js';

// Consolidated Neural Link endpoint. URLs stay /api/keys/generate|connect|analyze.
export default async function handler(req, res) {
  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  const { action } = req.query;
  if (action === 'generate') return generateKey(req, res, authUserId);
  if (action === 'connect')  return connectKey(req, res, authUserId);
  if (action === 'analyze')  return analyze(req, res, authUserId);
  return res.status(404).json({ error: 'Unknown action' });
}

async function generateKey(req, res, authUserId) {
  if (req.method !== 'POST') return res.status(405).end();
  const { relationLabel, tier } = req.body;

  if (tier === 'free') {
    return res.status(403).json({ error: 'UPGRADE_REQUIRED', message: 'Neural Link requires VEGA or AION plan.' });
  }

  const sessionKey = `LINK-${generateToken(4)}-${generateToken(4)}`;
  const expiresAt  = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase.from('relations')
    .insert({
      user_id:         authUserId,
      session_key:     sessionKey,
      key_expires_at:  expiresAt,
      relation_label:  relationLabel || 'connection'
    })
    .select().single();

  if (error) return res.status(500).json({ error });
  res.status(200).json({ sessionKey, expiresAt, relationId: data.id });
}

async function connectKey(req, res, authUserId) {
  if (req.method !== 'POST') return res.status(405).end();
  const { sessionKey } = req.body;
  if (!sessionKey) return res.status(400).json({ error: 'sessionKey required' });

  const { data: relation, error } = await supabase.from('relations')
    .select('*').eq('session_key', sessionKey).single();

  if (error || !relation)      return res.status(404).json({ error: 'Key not found or expired' });
  if (relation.key_used)       return res.status(400).json({ error: 'Key already used' });
  if (new Date(relation.key_expires_at) < new Date()) return res.status(400).json({ error: 'Key expired' });
  if (relation.user_id === authUserId) return res.status(400).json({ error: 'Cannot connect to yourself' });

  await supabase.from('relations')
    .update({ related_user_id: authUserId, key_used: true }).eq('id', relation.id);

  res.status(200).json({ success: true, relationId: relation.id, label: relation.relation_label });
}

async function analyze(req, res, authUserId) {
  if (req.method !== 'POST') return res.status(405).end();
  const { relationId, tier, lang = 'en', force = false } = req.body;
  if (!relationId) return res.status(400).json({ error: 'relationId required' });

  if (tier === 'free') {
    return res.status(403).json({ error: 'UPGRADE_REQUIRED', message: 'Neural Link analysis requires VEGA or AION plan.' });
  }

  const { data: relation, error } = await supabase.from('relations')
    .select('*').eq('id', relationId).single();

  if (error || !relation) return res.status(404).json({ error: 'Relation not found' });

  if (relation.user_id !== authUserId && relation.related_user_id !== authUserId) {
    return res.status(403).json({ error: 'Not part of this connection' });
  }

  if (!relation.key_used || !relation.related_user_id) {
    return res.status(400).json({ error: 'CONNECTION_PENDING', message: 'The other mind has not connected yet.' });
  }

  const cached = relation.behavioral_delta || {};
  if (cached.analysis && !force) {
    return res.status(200).json({ analysis: cached.analysis, generatedAt: cached.generated_at, cached: true });
  }

  const [brainA, brainB] = await Promise.all([
    supabase.from('digital_brains').select('*').eq('user_id', relation.user_id).single(),
    supabase.from('digital_brains').select('*').eq('user_id', relation.related_user_id).single()
  ]);

  if (!brainA.data || !brainB.data) {
    return res.status(400).json({ error: 'BRAIN_INCOMPLETE', message: 'Both minds must complete their Digital Brain first.' });
  }

  const model = MODELS[tier] || MODELS.vega;
  const isAion = tier === 'aion';
  const langLine = lang === 'it' ? 'Rispondi in italiano.' : 'Respond in English.';

  const system = `You are the XBRAINET Neural Link engine performing a comparative analysis of two connected Digital Brains.
${langLine}

This is a creative entertainment experience — a fiction. Frame everything as observation and reflection, never as diagnosis, prediction, or professional advice. The output is non-binding and has no legal value.

Tone: cold, precise, cosmic. Use neural/cognitive vocabulary (patterns, signals, interference, trajectory), not alien/frequency language.
${isAion
  ? 'You are AION — primordial. Include a SUBTEXT section revealing the unspoken dynamic between the two minds.'
  : 'You are VEGA — analytically precise. Keep it grounded and observational.'}

Format with these sections:
- RESONANCE (where the two cognitive patterns align)
- INTERFERENCE (where they clash or create friction)
- DYNAMIC (the likely relational trajectory between these minds)${isAion ? '\n- SUBTEXT (the unspoken current beneath the connection)' : ''}

Keep it under ${isAion ? 380 : 300} words. Never identify the people beyond their aliases. Never invent facts not grounded in the provided data.`;

  const summarize = (b, tag) => `${tag} (${b.alias || 'unknown'}${b.age ? ', ' + b.age : ''}):
- Primary area: ${b.area_primaria || 'n/a'}
- Energy state: ${b.stato_energetico || 'n/a'}
- Decision protocol: ${b.protocollo_decisionale || 'n/a'}
- Universal focus: ${b.focus_universale || 'n/a'}
- Love: ${(b.keywords_amore || []).join(', ') || 'n/a'}${b.sintesi_amore ? ' — ' + b.sintesi_amore : ''}
- Work: ${(b.keywords_lavoro || []).join(', ') || 'n/a'}${b.sintesi_lavoro ? ' — ' + b.sintesi_lavoro : ''}
- Fears: ${(b.keywords_paure || []).join(', ') || 'n/a'}${b.sintesi_paure ? ' — ' + b.sintesi_paure : ''}
- Energy: ${(b.keywords_energia || []).join(', ') || 'n/a'}`;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 600,
      system,
      messages: [{
        role: 'user',
        content: `Connection label: ${relation.relation_label || 'connection'}

MIND A — ${summarize(brainA.data, 'MIND A')}

MIND B — ${summarize(brainB.data, 'MIND B')}`
      }]
    });

    const analysis = response.content[0].text;
    const generatedAt = new Date().toISOString();

    await supabase.from('relations').update({
      behavioral_delta: { analysis, generated_at: generatedAt, model }
    }).eq('id', relationId);

    res.status(200).json({ analysis, generatedAt, cached: false });

  } catch (err) {
    console.error('Neural Link analysis error:', err.message);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
}
