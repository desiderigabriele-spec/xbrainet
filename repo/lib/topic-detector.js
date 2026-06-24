import { anthropic } from './anthropic.js';

const TOPICS = ['amore','lavoro','amicizia','interessi','paure','energia','altro'];

export async function detectTopic(message) {
  try {
    const res = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      system: `Classify into ONE topic: ${TOPICS.join(', ')}. Reply with only the single word in Italian.`,
      messages: [{ role: 'user', content: message }]
    });
    const topic = res.content[0].text.trim().toLowerCase();
    return TOPICS.includes(topic) ? topic : 'altro';
  } catch {
    return 'altro';
  }
}
