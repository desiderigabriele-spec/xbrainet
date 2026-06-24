import { anthropic, MODELS } from '../lib/anthropic.js';
import { supabase } from '../lib/supabase.js';
import { detectTopic } from '../lib/topic-detector.js';
import { buildSystemPrompt } from '../lib/system-prompts.js';
import { updateDigitalBrain } from '../lib/brain-updater.js';

const FREE_DAILY_LIMIT = 10;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, message, entity, tier, lang = 'en' } = req.body;
  if (!userId || !message) return res.status(400).json({ error: 'Missing params' });

  if (tier === 'free') {
    const { data: user } = await supabase
      .from('users').select('messages_today, messages_reset_at').eq('id', userId).single();

    const today = new Date().toISOString().split('T')[0];
    if (user.messages_reset_at !== today) {
      await supabase.from('users')
        .update({ messages_today: 0, messages_reset_at: today }).eq('id', userId);
    } else if (user.messages_today >= FREE_DAILY_LIMIT) {
      return res.status(429).json({
        error: 'DAILY_LIMIT_REACHED',
        message: lang === 'it'
          ? 'LYRA: Hai raggiunto il limite di 10 messaggi giornalieri. Passa a VEGA per messaggi illimitati.'
          : 'LYRA: You have reached your 10 daily message limit. Upgrade to VEGA for unlimited messages.'
      });
    }
  }

  const { data: brain } = await supabase
    .from('digital_brains').select('*').eq('user_id', userId).single();

  const topic = await detectTopic(message);

  const { data: history } = await supabase
    .from('conversations')
    .select('role, content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  const messages = [...(history || []).reverse(), { role: 'user', content: message }];

  const systemPrompt = buildSystemPrompt(entity, brain, topic, lang);
  const model        = MODELS[tier] || MODELS.free;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 300,
      system: systemPrompt,
      messages
    });

    const aiMessage = response.content[0].text;

    await supabase.from('conversations').insert([
      { user_id: userId, role: 'user',      content: message,   entity, topic_detected: topic },
      { user_id: userId, role: 'assistant', content: aiMessage, entity, topic_detected: topic }
    ]);

    if (tier === 'free') {
      await supabase.rpc('increment', { row_id: userId, column_name: 'messages_today' });
    }

    updateDigitalBrain(userId, message, aiMessage, topic, brain).catch(console.error);

    res.status(200).json({ message: aiMessage, topic });

  } catch (err) {
    console.error('AI response error:', err.message);
    res.status(500).json({ error: 'AI response failed. Please try again.' });
  }
}
