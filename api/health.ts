import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Minimal probe — if this fails, API routing itself is broken. */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json({ ok: true, service: 'the-source', ts: new Date().toISOString() });
}
