const PREFIXES = [
  'VEGA','LYRA','AION','NOVA','FLUX','NEXUS',
  'ZETA','ORION','ATLAS','HELIX','SIRIUS','CYGNUS'
];
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateUsername() {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const digits  = String(Math.floor(1000 + Math.random() * 9000));
  const suffix  = Array(2).fill(0)
    .map(() => LETTERS[Math.floor(Math.random() * LETTERS.length)])
    .join('');
  return `${prefix}-${digits}-${suffix}`;
}

export function generateToken(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  return Array(length).fill(0)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
}
