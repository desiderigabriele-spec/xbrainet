import twilio from 'twilio';
import bcrypt from 'bcryptjs';
import { supabase } from '../../lib/supabase.js';
import { generateUsername } from '../../lib/username.js';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
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

  // Find existing user — O(n) bcrypt compare, acceptable for MVP
  const { data: allUsers } = await supabase.from('users').select('*');
  let user = null;
  for (const u of allUsers || []) {
    if (await bcrypt.compare(normalized, u.phone_hash)) {
      user = u;
      break;
    }
  }

  if (!user) {
    const phoneHash = await bcrypt.hash(normalized, 10);
    const username  = generateUsername();
    const { data: newUser, error } = await supabase
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
    if (error) return res.status(500).json({ error: 'Failed to create user' });
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

  res.status(200).json({
    success: true,
    userId:    user.id,
    username:  user.username,
    tier:      user.tier,
    entity:    user.entity,
    isNewUser: !brain?.onboarding_complete,
    brain:     brain || null
  });
}
