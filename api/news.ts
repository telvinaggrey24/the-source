import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchGoogleNewsArticles } from './_lib/googleNews';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed', articles: [] });
  }

  try {
    const articles = await fetchGoogleNewsArticles([]);
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=600');
    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      count: articles.length,
      articles,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load news wire';
    console.error('[api/news]', message, error);
    return res.status(502).json({ error: message, articles: [] });
  }
}
