import { supabase } from './supabase.js';

const LIMITS = {
  free: { windowMs: 3000,  maxRequests: 1 },
  vega: { windowMs: 1000,  maxRequests: 1 },
  aion: { windowMs: 500,   maxRequests: 1 }
};

/**
 * Returns { allowed: true } or { allowed: false, retryAfterMs: number }
 * Reads+writes last_message_at on the users table — no extra infrastructure.
 */
export async function checkRateLimit(userId, tier) {
  const { windowMs } = LIMITS[tier] || LIMITS.free;
  const now = Date.now();

  const { data: user } = await supabase
    .from('users')
    .select('last_message_at')
    .eq('id', userId)
    .single();

  if (user?.last_message_at) {
    const lastMs = new Date(user.last_message_at).getTime();
    const elapsed = now - lastMs;
    if (elapsed < windowMs) {
      return { allowed: false, retryAfterMs: windowMs - elapsed };
    }
  }

  await supabase
    .from('users')
    .update({ last_message_at: new Date(now).toISOString() })
    .eq('id', userId);

  return { allowed: true };
}
