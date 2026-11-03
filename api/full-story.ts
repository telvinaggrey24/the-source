import { fetchFullStory } from '../src/lib/fullStory';

export default async function handler(
  req: { method?: string; query?: Record<string, string | string[] | undefined> },
  res: {
    setHeader: (k: string, v: string) => void;
    status: (n: number) => { json: (b: unknown) => void };
  }
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const raw = req.query?.url;
  const url = Array.isArray(raw) ? raw[0] : raw;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    const story = await fetchFullStory(url);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    return res.status(story.error && story.paragraphs.length === 0 ? 502 : 200).json(story);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load full story';
    return res.status(502).json({ error: message, paragraphs: [], sourceUrl: url });
  }
}
