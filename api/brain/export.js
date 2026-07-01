import { supabase } from '../../lib/supabase.js';
import { extractAuthUserId } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  const [brain, convos, relations] = await Promise.all([
    supabase.from('digital_brains').select('*').eq('user_id', authUserId).single(),
    supabase.from('conversations').select('role,content,topic_detected,created_at')
      .eq('user_id', authUserId).order('created_at'),
    supabase.from('relations').select('relation_label,created_at').eq('user_id', authUserId)
  ]);

  const exportData = {
    exported_at:    new Date().toISOString(),
    digital_brain:  brain.data,
    conversations:  convos.data,
    relations:      relations.data,
    note: 'Exported from XBRAINET pursuant to GDPR Art. 20 - Right to data portability'
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="xbrainet-brain-export.json"');
  res.status(200).json(exportData);
}
