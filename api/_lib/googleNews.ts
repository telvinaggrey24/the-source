import type { Article, Author, Category } from './types';

const WIRE_AUTHOR: Author = {
  id: 'auth_wire',
  name: 'Wire Desk',
  title: 'News Wire',
  avatar:
    'https://images.unsplash.com/photo-1504711435509-084227bb48b6?auto=format&fit=crop&w=400&h=400&q=80',
  bio: 'Live headlines syndicated from Google News for Tanzania and East Africa.',
  location: 'Dar es Salaam',
  joinedYear: '2026',
};

const FEEDS: Array<{ query: string; label: string }> = [
  { query: 'Tanzania when:7d', label: 'Tanzania' },
  { query: 'East Africa when:7d', label: 'East Africa' },
  { query: 'Dar es Salaam when:7d', label: 'Dar es Salaam' },
  { query: 'Tanzania business OR economy when:7d', label: 'Business' },
  { query: 'Tanzania football OR Simba OR Yanga when:7d', label: 'Football' },
  { query: 'Tanzania politics OR parliament OR government when:7d', label: 'Politics' },
];

const CATEGORY_RULES: Array<{ id: string; name: string; words: string[] }> = [
  {
    id: 'cat_football',
    name: 'Football',
    words: ['football', 'soccer', 'simba', 'yanga', 'premier league', 'caf', 'goal'],
  },
  {
    id: 'cat_sports',
    name: 'Sports',
    words: ['sport', 'athletics', 'olympic', 'cricket', 'boxing', 'tennis'],
  },
  {
    id: 'cat_business',
    name: 'Business',
    words: ['business', 'economy', 'market', 'bank', 'trade', 'finance', 'investment', 'shilling'],
  },
  {
    id: 'cat_politics',
    name: 'Politics',
    words: ['politics', 'election', 'parliament', 'government', 'president', 'minister', 'ccm', 'opposition'],
  },
  {
    id: 'cat_technology',
    name: 'Technology',
    words: ['tech', 'technology', 'ai ', 'digital', 'startup', 'cyber', 'telecom', 'internet'],
  },
  {
    id: 'cat_music',
    name: 'Music',
    words: ['music', 'album', 'song', 'bongo', 'artist', 'concert'],
  },
  {
    id: 'cat_entertainment',
    name: 'Entertainment',
    words: ['entertainment', 'film', 'movie', 'celebrity', 'tv ', 'nollywood'],
  },
  {
    id: 'cat_jobs',
    name: 'Jobs',
    words: ['job', 'employment', 'career', 'recruit', 'vacancy', 'hiring'],
  },
  {
    id: 'cat_international',
    name: 'International',
    words: ['kenya', 'uganda', 'rwanda', 'ethiopia', 'un ', 'africa', 'global', 'china', 'usa'],
  },
];

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1504711435509-084227bb48b6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503694978374-8a65fa3c1183?auto=format&fit=crop&w=1200&q=80',
];

function decodeEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || `wire-${Date.now()}`;
}

function pickCategory(title: string, source: string): { id: string; name: string } {
  const hay = `${title} ${source}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.words.some(w => hay.includes(w))) {
      return { id: rule.id, name: rule.name };
    }
  }
  return { id: 'cat_politics', name: 'Politics' };
}

function splitTitle(rawTitle: string): { title: string; source: string } {
  const cleaned = decodeEntities(rawTitle).trim();
  const parts = cleaned.split(/\s+-\s+/);
  if (parts.length >= 2) {
    const source = parts.pop()!.trim();
    return { title: parts.join(' - ').trim(), source };
  }
  return { title: cleaned, source: 'Google News' };
}

function extractItems(xml: string): Array<{
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}> {
  const items: Array<{
    title: string;
    link: string;
    pubDate: string;
    description: string;
    source: string;
  }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const grab = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return m ? decodeEntities(m[1]).trim() : '';
    };
    const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
    const titleRaw = grab('title');
    const { title, source: titleSource } = splitTitle(titleRaw);
    items.push({
      title,
      link: grab('link'),
      pubDate: grab('pubDate'),
      description: stripTags(grab('description')),
      source: sourceMatch ? decodeEntities(sourceMatch[1]).trim() : titleSource,
    });
  }
  return items;
}

async function fetchRss(url: string, timeoutMs = 8000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; TheSourceBot/1.0; +https://thesource.co.tz)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-TZ,en;q=0.9,sw;q=0.8',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Google News RSS failed (${res.status})`);
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchSearchFeed(query: string): Promise<string> {
  const url =
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}` +
    `&hl=en-TZ&gl=TZ&ceid=TZ:en`;
  return fetchRss(url);
}

export function getWireAuthor(): Author {
  return WIRE_AUTHOR;
}

export async function fetchGoogleNewsArticles(
  categories: Category[] = []
): Promise<Article[]> {
  // Parallel with per-feed timeouts — keeps Vercel under maxDuration
  const jobs = [
    fetchRss('https://news.google.com/rss?hl=en-TZ&gl=TZ&ceid=TZ:en'),
    ...FEEDS.map(feed => fetchSearchFeed(feed.query)),
  ];
  const settled = await Promise.allSettled(jobs);
  const xmlChunks = settled
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(Boolean);

  if (xmlChunks.length === 0) {
    throw new Error('All Google News feeds failed. Try again in a moment.');
  }

  const seen = new Set<string>();
  const articles: Article[] = [];

  for (const xml of xmlChunks) {
    if (!xml) continue;
    for (const item of extractItems(xml)) {
      const key = item.title.toLowerCase();
      if (!item.title || !item.link || seen.has(key)) continue;
      seen.add(key);

      const mapped = pickCategory(item.title, item.source);
      const category =
        categories.find(c => c.id === mapped.id) ||
        ({ id: mapped.id, name: mapped.name } as Category);

      const publishedAt = item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString();
      const summary =
        item.description ||
        `${item.title} — reporting via ${item.source}. Open the full story on the publisher’s site.`;
      const slug = `${slugify(item.title)}-${articles.length + 1}`;
      const image = PLACEHOLDER_IMAGES[articles.length % PLACEHOLDER_IMAGES.length];

      articles.push({
        id: `wire_${articles.length + 1}_${slugify(item.title).slice(0, 24)}`,
        slug,
        title: item.title,
        titleEnglish: item.title,
        subtitle: `Via ${item.source}`,
        subtitleEnglish: `Via ${item.source}`,
        summary,
        summaryEnglish: summary,
        content: [
          summary,
          `This is a live wire headline from Google News. THE SOURCE links to the original publisher for the full report.`,
          `Source: ${item.source}`,
        ],
        contentEnglish: [
          summary,
          `This is a live wire headline from Google News. THE SOURCE links to the original publisher for the full report.`,
          `Source: ${item.source}`,
        ],
        categoryId: category.id,
        categoryName: category.name,
        featuredImage: image,
        imageCaption: item.title,
        imageCredit: item.source,
        imageAltText: item.title,
        author: {
          ...WIRE_AUTHOR,
          name: item.source || WIRE_AUTHOR.name,
          title: 'Wire source',
        },
        publishedAt,
        readTimeMinutes: 2,
        viewsCount: 0,
        isBreaking: articles.length < 3,
        isFeaturedHero: articles.length === 0,
        isTrending: articles.length < 8,
        isEditorsPick: articles.length < 5,
        tags: ['wire', 'google-news', category.name.toLowerCase()],
        status: 'published',
        reactions: { insightful: 0, inspiring: 0, surprised: 0, concerned: 0 },
        comments: [],
        commentsEnabled: false,
        seoMetaTitle: item.title,
        seoMetaDescription: summary.slice(0, 160),
        seoCanonicalUrl: item.link,
        seoSocialImage: image,
        sourceUrl: item.link,
        isWireStory: true,
      });
    }
  }

  articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return articles.slice(0, 80).map((article, index) => ({
    ...article,
    isFeaturedHero: index === 0,
    isBreaking: index < 3,
    isTrending: index < 10,
    isEditorsPick: index < 6,
  }));
}
