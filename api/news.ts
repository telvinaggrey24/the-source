import { fetchGoogleNewsArticles } from '../src/lib/googleNews';
import { INITIAL_CATEGORIES } from '../src/data/initialData';

export default async function handler(
  req: { method?: string },
  res: {
    setHeader: (k: string, v: string) => void;
    status: (n: number) => { json: (b: unknown) => void };
  }
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const articles = await fetchGoogleNewsArticles(INITIAL_CATEGORIES);
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=600');
    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      count: articles.length,
      articles,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load news wire';
    console.error('[api/news]', message);
    return res.status(502).json({ error: message, articles: [] });
  }
}
