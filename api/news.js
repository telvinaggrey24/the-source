/**
 * News wire: NewsData.io + NewsAPI.org, with Google News RSS fallback.
 * Keys: NEWSDATA_API_KEY, NEWSAPI_API_KEY (server-only, never VITE_).
 */

const WIRE_AUTHOR = {
  id: 'auth_wire',
  name: 'Wire Desk',
  title: 'News Wire',
  avatar:
    'https://images.unsplash.com/photo-1504711435509-084227bb48b6?auto=format&fit=crop&w=400&h=400&q=80',
  bio: 'Live headlines for Tanzania and East Africa.',
  location: 'Dar es Salaam',
  joinedYear: '2026',
};

const CATEGORY_RULES = [
  { id: 'cat_football', name: 'Football', words: ['football', 'soccer', 'simba', 'yanga', 'premier league', 'caf', 'goal'] },
  { id: 'cat_sports', name: 'Sports', words: ['sport', 'athletics', 'olympic', 'cricket', 'boxing', 'tennis'] },
  { id: 'cat_business', name: 'Business', words: ['business', 'economy', 'market', 'bank', 'trade', 'finance', 'investment', 'shilling'] },
  { id: 'cat_politics', name: 'Politics', words: ['politics', 'election', 'parliament', 'government', 'president', 'minister', 'ccm', 'opposition'] },
  { id: 'cat_technology', name: 'Technology', words: ['tech', 'technology', 'ai ', 'digital', 'startup', 'cyber', 'telecom', 'internet'] },
  { id: 'cat_entertainment', name: 'Entertainment', words: ['entertainment', 'film', 'movie', 'celebrity', 'tv ', 'music', 'bongo'] },
  { id: 'cat_international', name: 'International', words: ['kenya', 'uganda', 'rwanda', 'ethiopia', 'un ', 'africa', 'global', 'china', 'usa', 'mali'] },
];

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1504711435509-084227bb48b6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503694978374-8a65fa3c1183?auto=format&fit=crop&w=1200&q=80',
];

const NEWSDATA_QUERIES = [
  { country: 'tz', language: 'en' },
  { q: 'Tanzania OR "Dar es Salaam" OR "East Africa"', language: 'en' },
  { q: 'Simba OR Yanga OR "Premier League" Tanzania', language: 'en', category: 'sports' },
];

const NEWSAPI_QUERIES = [
  { q: 'Tanzania OR "Dar es Salaam" OR "East Africa"', sortBy: 'publishedAt', language: 'en', pageSize: '40' },
  { q: 'Simba OR Yanga OR Taifa Stars', sortBy: 'publishedAt', language: 'en', pageSize: '20' },
];

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function slugify(value) {
  const base = String(value || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || `wire-${Date.now()}`;
}

function daysAgoIsoDate(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function pickCategory(title, source, apiCategory) {
  const api = String(apiCategory || '').toLowerCase();
  if (api.includes('sport')) return { id: 'cat_sports', name: 'Sports' };
  if (api.includes('business') || api.includes('top')) return { id: 'cat_business', name: 'Business' };
  if (api.includes('politic')) return { id: 'cat_politics', name: 'Politics' };
  if (api.includes('tech') || api.includes('science')) return { id: 'cat_technology', name: 'Technology' };
  if (api.includes('entertainment')) return { id: 'cat_entertainment', name: 'Entertainment' };

  const hay = `${title} ${source}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.words.some((w) => hay.includes(w))) return { id: rule.id, name: rule.name };
  }
  return { id: 'cat_international', name: 'International' };
}

function mapWireItem(item, index, providerTag) {
  const title = String(item.title || '').trim();
  const link = String(item.link || item.url || '').trim();
  if (!title || !link || title === '[Removed]') return null;

  const source =
    item.source_name ||
    item.source_id ||
    (item.source && item.source.name) ||
    (Array.isArray(item.creator) && item.creator[0]) ||
    providerTag;
  const apiCat = Array.isArray(item.category) ? item.category[0] : item.category;
  const category = pickCategory(title, source, apiCat);
  const description = String(item.description || item.content || '').trim();
  const summary =
    description &&
    description !== 'ONLY AVAILABLE IN PAID PLANS' &&
    !description.startsWith('[Removed]')
      ? description
      : `${title} — reporting via ${source}.`;
  const image =
    item.image_url ||
    item.urlToImage ||
    PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

  let publishedAt;
  try {
    const rawDate = item.pubDate || item.publishedAt;
    publishedAt = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString();
  } catch {
    publishedAt = new Date().toISOString();
  }

  const slug = `${slugify(title)}-${index + 1}`;
  const idSeed = item.article_id || slugify(link).slice(0, 20) || slugify(title).slice(0, 24);

  return {
    id: `${providerTag}_${idSeed}_${index}`,
    slug,
    title,
    titleEnglish: title,
    subtitle: `Via ${source}`,
    subtitleEnglish: `Via ${source}`,
    summary,
    summaryEnglish: summary,
    content: [
      summary,
      'Full story available from the original publisher.',
      `Source: ${source}`,
    ],
    contentEnglish: [
      summary,
      'Full story available from the original publisher.',
      `Source: ${source}`,
    ],
    categoryId: category.id,
    categoryName: category.name,
    featuredImage: image,
    imageCaption: title,
    imageCredit: source,
    imageAltText: title,
    author: {
      ...WIRE_AUTHOR,
      name: source,
      title: 'Wire source',
    },
    publishedAt,
    readTimeMinutes: 2,
    viewsCount: 0,
    isBreaking: index < 3,
    isFeaturedHero: index === 0,
    isTrending: index < 8,
    isEditorsPick: index < 5,
    tags: ['wire', providerTag, category.name.toLowerCase()],
    status: 'published',
    reactions: { insightful: 0, inspiring: 0, surprised: 0, concerned: 0 },
    comments: [],
    commentsEnabled: false,
    seoMetaTitle: title,
    seoMetaDescription: summary.slice(0, 160),
    seoCanonicalUrl: link,
    seoSocialImage: image,
    sourceUrl: link,
    isWireStory: true,
  };
}

async function fetchJson(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchNewsData(apiKey) {
  const jobs = NEWSDATA_QUERIES.map(async (params) => {
    const url = new URL('https://newsdata.io/api/1/latest');
    url.searchParams.set('apikey', apiKey);
    for (const [k, v] of Object.entries(params)) {
      if (v) url.searchParams.set(k, v);
    }
    const { res, data } = await fetchJson(url.toString());
    if (!res.ok || data.status === 'error') {
      throw new Error(data?.results?.message || data?.message || `NewsData HTTP ${res.status}`);
    }
    return Array.isArray(data.results) ? data.results : [];
  });

  const settled = await Promise.allSettled(jobs);
  const rows = [];
  for (const r of settled) {
    if (r.status === 'fulfilled') rows.push(...r.value);
  }
  return rows.map((item) => ({ ...item, _provider: 'newsdata' }));
}

/**
 * NewsAPI.org — GET /v2/everything
 * Example: ?q=Apple&from=YYYY-MM-DD&sortBy=popularity&apiKey=API_KEY
 */
async function fetchNewsApiOrg(apiKey) {
  const from = daysAgoIsoDate(3);
  const jobs = NEWSAPI_QUERIES.map(async (params) => {
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('from', from);
    for (const [k, v] of Object.entries(params)) {
      if (v) url.searchParams.set(k, v);
    }
    const { res, data } = await fetchJson(url.toString());
    if (!res.ok || data.status === 'error') {
      throw new Error(data?.message || `NewsAPI.org HTTP ${res.status}`);
    }
    return Array.isArray(data.articles) ? data.articles : [];
  });

  const settled = await Promise.allSettled(jobs);
  const rows = [];
  for (const r of settled) {
    if (r.status === 'fulfilled') rows.push(...r.value);
  }

  // Normalize to shared wire shape
  return rows.map((a) => ({
    title: a.title,
    link: a.url,
    description: a.description,
    content: a.content,
    source_name: a.source?.name,
    pubDate: a.publishedAt,
    image_url: a.urlToImage,
    article_id: slugify(a.url || a.title).slice(0, 24),
    category: [],
    _provider: 'newsapi',
  }));
}

async function fetchGoogleFallback() {
  const feeds = [
    'https://news.google.com/rss?hl=en-TZ&gl=TZ&ceid=TZ:en',
    'https://news.google.com/rss/search?q=Tanzania&hl=en-TZ&gl=TZ&ceid=TZ:en',
  ];
  const xmlChunks = [];
  for (const feed of feeds) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);
      try {
        const res = await fetch(feed, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TheSourceBot/1.0; +https://thesource.co.tz)',
            Accept: 'application/rss+xml, application/xml, text/xml, */*',
          },
          signal: controller.signal,
        });
        if (res.ok) xmlChunks.push(await res.text());
      } finally {
        clearTimeout(timer);
      }
    } catch {
      // skip
    }
  }

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  for (const xml of xmlChunks) {
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const grab = (tag) => {
        const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
        return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
      };
      const titleRaw = grab('title');
      const parts = titleRaw.split(/\s+-\s+/);
      const source = parts.length >= 2 ? parts.pop().trim() : 'Google News';
      const title = parts.join(' - ').trim() || titleRaw;
      items.push({
        title,
        link: grab('link'),
        description: grab('description').replace(/<[^>]+>/g, ' ').trim(),
        source_name: source,
        pubDate: grab('pubDate'),
        article_id: undefined,
        image_url: null,
        category: [],
        _provider: 'google',
      });
    }
  }
  return items;
}

async function buildArticles() {
  const newsdataKey = (process.env.NEWSDATA_API_KEY || '').trim();
  const newsapiKey = (process.env.NEWSAPI_API_KEY || process.env.NEWS_API_KEY || '').trim();

  const providers = [];
  const batches = [];

  if (newsdataKey) {
    batches.push(
      fetchNewsData(newsdataKey)
        .then((rows) => {
          providers.push('newsdata.io');
          return rows;
        })
        .catch((err) => {
          console.error('[api/news] NewsData failed:', err instanceof Error ? err.message : err);
          return [];
        })
    );
  }

  if (newsapiKey) {
    batches.push(
      fetchNewsApiOrg(newsapiKey)
        .then((rows) => {
          providers.push('newsapi.org');
          return rows;
        })
        .catch((err) => {
          console.error('[api/news] NewsAPI.org failed:', err instanceof Error ? err.message : err);
          return [];
        })
    );
  }

  const settled = await Promise.all(batches);
  let rawItems = settled.flat();

  if (rawItems.length === 0) {
    rawItems = await fetchGoogleFallback();
    if (rawItems.length) providers.push('google-news-fallback');
  }

  if (rawItems.length === 0) {
    throw new Error(
      'News wire returned no articles. Set NEWSDATA_API_KEY and/or NEWSAPI_API_KEY, then retry.'
    );
  }

  const seen = new Set();
  const articles = [];
  for (const item of rawItems) {
    const key = String(item.title || '')
      .toLowerCase()
      .trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const mapped = mapWireItem(item, articles.length, item._provider || 'wire');
    if (mapped) articles.push(mapped);
  }

  articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return {
    providers,
    articles: articles.slice(0, 80).map((article, index) => ({
      ...article,
      isFeaturedHero: index === 0,
      isBreaking: index < 3,
      isTrending: index < 10,
      isEditorsPick: index < 6,
    })),
  };
}

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed', articles: [] });
  }

  try {
    const { articles, providers } = await buildArticles();
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=600');
    return sendJson(res, 200, {
      updatedAt: new Date().toISOString(),
      count: articles.length,
      provider: providers.join('+') || 'unknown',
      providers,
      articles,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load news wire';
    console.error('[api/news]', message);
    return sendJson(res, 502, { error: message, articles: [] });
  }
}
