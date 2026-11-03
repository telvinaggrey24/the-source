/**
 * Self-contained full-story extractor. Zero local imports for Vercel ESM safety.
 */

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function decodeEntities(text) {
  return String(text || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTags(html) {
  return decodeEntities(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim()
  );
}

function extractTitle(html) {
  const og =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  if (og?.[1]) return decodeEntities(og[1]).trim();
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? decodeEntities(title[1]).replace(/\s+/g, ' ').trim() : undefined;
}

function extractParagraphsFromHtml(html) {
  const articleMatch =
    html.match(/<article[\s\S]*?<\/article>/i) ||
    html.match(/<main[\s\S]*?<\/main>/i) ||
    html.match(
      /<div[^>]+class=["'][^"']*(?:article|story|post|content|entry)[^"']*["'][^>]*>[\s\S]*?<\/div>/i
    );

  const scope = articleMatch?.[0] || html;
  const pTags = [...scope.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1]))
    .filter((p) => p.length > 60)
    .filter((p) => !/cookie|subscribe|newsletter|sign in|log in|advertisement/i.test(p));

  if (pTags.length >= 2) return pTags.slice(0, 60);

  return stripTags(scope)
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 80)
    .slice(0, 40);
}

async function fetchFullStory(sourceUrl) {
  if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) {
    return { sourceUrl, paragraphs: [], error: 'Invalid article URL' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(sourceUrl, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': BROWSER_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,sw;q=0.8',
      },
    });

    if (!res.ok) {
      return {
        sourceUrl,
        paragraphs: [],
        error: `Publisher returned ${res.status}`,
      };
    }

    const html = await res.text();
    const finalUrl = res.url || sourceUrl;
    const paragraphs = extractParagraphsFromHtml(html);
    const title = extractTitle(html);

    if (paragraphs.length === 0) {
      return {
        sourceUrl,
        finalUrl,
        title,
        paragraphs: [],
        error:
          'This publisher blocked full-text reading. Open the original page for the complete story.',
      };
    }

    return { sourceUrl, finalUrl, title, paragraphs };
  } catch (error) {
    return {
      sourceUrl,
      paragraphs: [],
      error: error instanceof Error ? error.message : 'Failed to load full story',
    };
  } finally {
    clearTimeout(timer);
  }
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readQuery(req, key) {
  try {
    const host = req.headers?.host || 'localhost';
    const url = new URL(req.url || '/', `http://${host}`);
    return url.searchParams.get(key);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed', paragraphs: [] });
  }

  const url = (req.query && req.query.url) || readQuery(req, 'url');
  const sourceUrl = Array.isArray(url) ? url[0] : url;
  if (!sourceUrl) {
    return sendJson(res, 400, { error: 'Missing url query parameter', paragraphs: [] });
  }

  try {
    const story = await fetchFullStory(String(sourceUrl));
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    return sendJson(
      res,
      story.error && story.paragraphs.length === 0 ? 502 : 200,
      story
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load full story';
    return sendJson(res, 502, { error: message, paragraphs: [], sourceUrl });
  }
}
