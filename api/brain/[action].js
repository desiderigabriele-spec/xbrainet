import { supabase } from '../../lib/supabase.js';
import { extractAuthUserId } from '../../lib/auth.js';

// Consolidated Digital Brain endpoint. URLs stay /api/brain/load|save|delete|export.
export default async function handler(req, res) {
  const authUserId = extractAuthUserId(req);
  if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

  const { action } = req.query;
  if (action === 'load')   return loadBrain(req, res, authUserId);
  if (action === 'save')   return saveBrain(req, res, authUserId);
  if (action === 'delete') return deleteBrain(req, res, authUserId);
  if (action === 'export') return exportBrain(req, res, authUserId);
  return res.status(404).json({ error: 'Unknown action' });
}

async function loadBrain(req, res, authUserId) {
  if (req.method !== 'GET') return res.status(405).end();
  const { data, error } = await supabase.from('digital_brains')
    .select('*').eq('user_id', authUserId).single();
  if (error) return res.status(404).json({ error: 'Brain not found' });
  res.status(200).json(data);
}

async function saveBrain(req, res, authUserId) {
  if (req.method !== 'POST') return res.status(405).end();
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'Data required' });

  const { error } = await supabase.from('digital_brains')
    .upsert({ user_id: authUserId, ...data, updated_at: new Date().toISOString() },
             { onConflict: 'user_id' });
  if (error) return res.status(500).json({ error });
  res.status(200).json({ success: true });
}

async function deleteBrain(req, res, authUserId) {
  if (req.method !== 'DELETE') return res.status(405).end();

  await supabase.from('conversations').delete().eq('user_id', authUserId);
  await supabase.from('blind_spot_links').delete().eq('user_id', authUserId);
  await supabase.from('relations').delete().eq('user_id', authUserId);
  await supabase.from('digital_brains').delete().eq('user_id', authUserId);

  await supabase.from('users').update({
    phone_hash: 'DELETED_' + Date.now(),
    username:   'DELETED_' + Date.now()
  }).eq('id', authUserId);

  res.status(200).json({ success: true });
}

async function exportBrain(req, res, authUserId) {
  if (req.method !== 'GET') return res.status(405).end();

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
