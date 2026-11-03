import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function googleNewsApiPlugin(): Plugin {
  return {
    name: 'google-news-api',
    configureServer(server) {
      server.middlewares.use('/api/news', async (_req, res, next) => {
        try {
          const { fetchGoogleNewsArticles } = await server.ssrLoadModule('/src/lib/googleNews.ts');
          const { INITIAL_CATEGORIES } = await server.ssrLoadModule('/src/data/initialData.ts');
          const articles = await fetchGoogleNewsArticles(INITIAL_CATEGORIES);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(
            JSON.stringify({
              updatedAt: new Date().toISOString(),
              count: articles.length,
              articles,
            })
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load news wire';
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: message, articles: [] }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), googleNewsApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
  },
});
