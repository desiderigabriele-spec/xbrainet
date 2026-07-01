import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
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
