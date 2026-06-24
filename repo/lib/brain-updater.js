import { anthropic } from './anthropic.js';
import { supabase } from './supabase.js';

export async function updateDigitalBrain(userId, userMsg, aiMsg, topic, brain) {
  if (!topic || topic === 'altro') return;

  try {
    const extraction = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: `Extract cognitive insights from this conversation exchange.
Return ONLY valid JSON, no markdown, no preamble, no explanation:
{
  "keywords": ["max 3 new pattern words about this person"],
  "sintesi": "one sentence describing their cognitive pattern in this topic"
}
Only include genuinely new insights not already obvious from context.
If nothing meaningful to extract, return: {"keywords": [], "sintesi": null}`,
      messages: [{
        role: 'user',
        content: `User said: "${userMsg.slice(0, 500)}"\nAI observed: "${aiMsg.slice(0, 500)}"`
      }]
    });

    let extracted;
    try {
      extracted = JSON.parse(extraction.content[0].text);
    } catch {
      return;
    }

    if (!extracted.keywords?.length && !extracted.sintesi) return;

    const keyField  = `keywords_${topic}`;
    const sintField = `sintesi_${topic}`;
    const current   = brain?.[keyField] || [];
    const merged    = [...new Set([...current, ...extracted.keywords])].slice(0, 15);

    const updateData = { [keyField]: merged, updated_at: new Date().toISOString() };
    if (extracted.sintesi) updateData[sintField] = extracted.sintesi;

    await supabase
      .from('digital_brains')
      .upsert({ user_id: userId, ...updateData }, { onConflict: 'user_id' });

  } catch (err) {
    console.error('Brain update failed silently:', err.message);
  }
}
