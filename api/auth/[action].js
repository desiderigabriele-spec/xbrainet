import twilio from 'twilio';
import { supabase } from '../../lib/supabase.js';
import { generateUsername, hashPhoneForLookup } from '../../lib/username.js';
import { signToken } from '../../lib/auth.js';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Consolidated auth endpoint. URLs stay /api/auth/send-otp and /api/auth/verify-otp
// (Vercel passes the last path segment as req.query.action).
export default async function handler(req, res) {
  const { action } = req.query;
  if (action === 'send-otp')   return sendOtp(req, res);
  if (action === 'verify-otp') return verifyOtp(req, res);
  return res.status(404).json({ error: 'Unknown action' });
}

async function sendOtp(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  const normalized = phone.startsWith('+') ? phone : `+39${phone}`;

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: normalized, channel: 'sms' });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('OTP send error:', err.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}

async function verifyOtp(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone, code, lang = 'en' } = req.body;
  if (!phone || !code) return res.status(400).json({ error: 'Phone and code required' });

  const normalized = phone.startsWith('+') ? phone : `+39${phone}`;

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: normalized, code });
    if (check.status !== 'approved') {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }
  } catch {
    return res.status(400).json({ error: 'Verification failed' });
  }

  const phoneHash = hashPhoneForLookup(phone);

  let { data: user } = await supabase.from('users')
    .select('*').eq('phone_hash', phoneHash).single();

  if (!user) {
    const username = generateUsername();
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        phone_hash: phoneHash,
        username,
        tier: 'free',
        entity: 'LYRA',
        preferred_language: lang,
        gdpr_consent_at: new Date().toISOString()
      })
      .select()
      .single();
    if (createError) return res.status(500).json({ error: 'Failed to create user' });
    user = newUser;
  } else {
    await supabase.from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);
  }

  const { data: brain } = await supabase
    .from('digital_brains')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const token = signToken(user.id);

  res.status(200).json({
    success: true,
    token,
    userId:    user.id,
    username:  user.username,
    tier:      user.tier,
    entity:    user.entity,
    isNewUser: !brain?.onboarding_complete,
    brain:     brain || null
  });
}
