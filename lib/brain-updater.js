import { anthropic } from './anthropic.js';
import { supabase } from './supabase.js';

export async function updateDigitalBrain(userId, userMsg, aiMsg, topic, brain) {
  if (!topic || topic === 'altro') return;

  const keyField  = `keywords_${topic}`;
  const sintField = `sintesi_${topic}`;
  const prevKeys  = brain?.[keyField] || [];
  const prevSint  = brain?.[sintField] || null;

  try {
    const extraction = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      system: `You extract new cognitive insights from a conversation exchange.
Return ONLY valid JSON, no markdown, no preamble:
{
  "keywords": ["1-3 new pattern words NOT already in existing_keywords"],
  "sintesi": "one sentence merging the previous synthesis with new insight, or null if nothing new"
}

Rules:
- keywords: short, specific, lowercase. Skip generic words (e.g. "relationship", "life").
- sintesi: if previous_synthesis exists, update it with the new insight. Keep it under 25 words. If nothing meaningfully new, return null.
- If nothing is worth extracting, return: {"keywords": [], "sintesi": null}`,
      messages: [{
        role: 'user',
        content: `existing_keywords: ${JSON.stringify(prevKeys)}
previous_synthesis: ${prevSint || 'none'}

User said: "${userMsg.slice(0, 500)}"
AI observed: "${aiMsg.slice(0, 500)}"`
      }]
    });

    let extracted;
    try {
      extracted = JSON.parse(extraction.content[0].text);
    } catch {
      return;
    }

    if (!extracted.keywords?.length && !extracted.sintesi) return;

    const merged = [...new Set([...prevKeys, ...(extracted.keywords || [])])].slice(0, 15);

    const updateData = { [keyField]: merged, updated_at: new Date().toISOString() };
    if (extracted.sintesi) updateData[sintField] = extracted.sintesi;

    await supabase
      .from('digital_brains')
      .upsert({ user_id: userId, ...updateData }, { onConflict: 'user_id' });

  } catch (err) {
    console.error('Brain update failed silently:', err.message);
  }
}
