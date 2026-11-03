import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

function readQuery(url: string | undefined, key: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url, 'http://localhost');
    return parsed.searchParams.get(key);
  } catch {
    return null;
  }
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function localApiPlugin(): Plugin {
  return {
    name: 'the-source-local-api',
    configureServer(server) {
      server.middlewares.use('/api/news', async (_req: IncomingMessage, res: ServerResponse) => {
        try {
          const { fetchGoogleNewsArticles } = await server.ssrLoadModule('/src/lib/googleNews.ts');
          const { INITIAL_CATEGORIES } = await server.ssrLoadModule('/src/data/initialData.ts');
          const articles = await fetchGoogleNewsArticles(INITIAL_CATEGORIES);
          json(res, 200, {
            updatedAt: new Date().toISOString(),
            count: articles.length,
            articles,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load news wire';
          json(res, 502, { error: message, articles: [] });
        }
      });

      server.middlewares.use('/api/full-story', async (req: IncomingMessage, res: ServerResponse) => {
        try {
          const url = readQuery(req.url, 'url');
          if (!url) {
            json(res, 400, { error: 'Missing url query parameter', paragraphs: [] });
            return;
          }
          const { fetchFullStory } = await server.ssrLoadModule('/src/lib/fullStory.ts');
          const story = await fetchFullStory(url);
          json(res, story.error && story.paragraphs.length === 0 ? 502 : 200, story);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load full story';
          json(res, 502, { error: message, paragraphs: [] });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
  },
});
