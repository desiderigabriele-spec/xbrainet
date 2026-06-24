import Anthropic from '@anthropic-ai/sdk';
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const MODELS = {
  free: 'claude-haiku-4-5-20251001',
  vega: 'claude-sonnet-4-6',
  aion: 'claude-opus-4-8'
};
