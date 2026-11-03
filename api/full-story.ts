import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchFullStory } from './_lib/fullStory';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed', paragraphs: [] });
  }

  const raw = req.query?.url;
  const url = Array.isArray(raw) ? raw[0] : raw;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url query parameter', paragraphs: [] });
  }

  try {
    const story = await fetchFullStory(url);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    return res.status(story.error && story.paragraphs.length === 0 ? 502 : 200).json(story);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load full story';
    console.error('[api/full-story]', message, error);
    return res.status(502).json({ error: message, paragraphs: [], sourceUrl: url });
  }
}
