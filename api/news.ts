import { fetchGoogleNewsArticles } from '../src/lib/googleNews';
import { INITIAL_CATEGORIES } from '../src/data/initialData';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json', allow: 'GET' },
    });
  }

  try {
    const articles = await fetchGoogleNewsArticles(INITIAL_CATEGORIES);
    return new Response(
      JSON.stringify({
        updatedAt: new Date().toISOString(),
        count: articles.length,
        articles,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 's-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load news wire';
    return new Response(JSON.stringify({ error: message, articles: [] }), {
      status: 502,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
}
