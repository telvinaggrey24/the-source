import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
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

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function localApiPlugin(): Plugin {
  return {
    name: 'the-source-local-api',
    configureServer(server) {
      server.middlewares.use('/api/news', async (req: IncomingMessage, res: ServerResponse) => {
        try {
          const mod = await server.ssrLoadModule('/api/news.js');
          const fakeReq = { method: 'GET', on() {} };
          const fakeRes = {
            statusCode: 200,
            headers: {} as Record<string, string>,
            setHeader(k: string, v: string) {
              this.headers[k] = v;
              res.setHeader(k, v);
            },
            end(body?: string) {
              res.statusCode = fakeRes.statusCode;
              if (!res.getHeader('Content-Type')) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
              }
              res.end(body || JSON.stringify({ error: 'Empty news response', articles: [] }));
            },
          };
          await mod.default(fakeReq, fakeRes);
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

      server.middlewares.use('/api/upload', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method && req.method !== 'POST') {
          res.setHeader('Allow', 'POST');
          json(res, 405, { error: 'Method not allowed' });
          return;
        }
        try {
          const raw = await readBody(req);
          // Re-use the same serverless handler logic via dynamic import of the JS module
          const mod = await server.ssrLoadModule('/api/upload.js');
          const fakeReq = {
            method: 'POST',
            body: raw ? JSON.parse(raw) : {},
            on() {},
          };
          const chunks: string[] = [];
          const fakeRes = {
            statusCode: 200,
            setHeader() {},
            end(body?: string) {
              if (body) chunks.push(body);
              res.statusCode = fakeRes.statusCode;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(chunks.join('') || JSON.stringify({ error: 'Empty upload response' }));
            },
          };
          await mod.default(fakeReq, fakeRes);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Upload failed';
          json(res, 500, { error: message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (!(key in process.env)) process.env[key] = value;
  }

  return {
    plugins: [react(), tailwindcss(), localApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
    },
  };
});
