import type { Article, Category } from '../types';

const ALIASES: Record<string, string[]> = {
  international: ['world', 'global', 'world news', 'kimataifa'],
  football: ['soccer', 'soka'],
  politics: ['siasa', 'government'],
  business: ['biashara', 'economy', 'markets'],
  entertainment: ['burudani', 'culture', 'lifestyle', 'music', 'muziki'],
  technology: ['teknolojia', 'tech', 'science'],
  sports: ['michezo', 'sport', 'football', 'soccer', 'soka'],
  music: ['muziki'],
  jobs: ['kazi', 'careers'],
};

/** Child desks folded into a primary public section */
const DESK_CHILDREN: Record<string, string[]> = {
  sports: ['football'],
  entertainment: ['music'],
};

function norm(value: string | undefined | null): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/^cat_/, '')
    .replace(/-news$/, '')
    .replace(/[_]+/g, '-')
    .replace(/\s+/g, ' ');
}

function slugifyLoose(value: string): string {
  return norm(value).replace(/\s+/g, '-');
}

/** True when an article belongs on a given category desk / homepage section. */
export function articleMatchesCategory(
  article: Article,
  category: Pick<Category, 'slug' | 'name'> & { id?: string; nameSwahili?: string }
): boolean {
  if (!article || article.status !== 'published') return false;

  const slug = slugifyLoose(category.slug);
  const relatedSlugs = [slug, ...(DESK_CHILDREN[slug] || [])];
  const catId = norm(category.id || `cat_${slug}`);
  const articleId = norm(article.categoryId);
  const articleName = norm(article.categoryName);
  const articleNameSlug = slugifyLoose(article.categoryName);
  const labels = [
    category.name,
    category.nameSwahili,
    ...(ALIASES[slug] || []),
    ...relatedSlugs.flatMap(s => ALIASES[s] || [s]),
  ]
    .map(norm)
    .filter(Boolean);

  if (relatedSlugs.some(s => articleId === s || articleId === `cat_${s}` || articleId === catId)) {
    return true;
  }
  if (relatedSlugs.some(s => articleNameSlug === s || articleName === s)) return true;
  if (labels.some(label => articleName === label || articleNameSlug === slugifyLoose(label))) {
    return true;
  }
  if (labels.some(label => articleName.includes(label) && label.length > 3)) return true;

  const tags = (article.tags || []).map(norm);
  if (
    relatedSlugs.some(s => tags.includes(s)) ||
    labels.some(label => tags.includes(label) || tags.includes(slugifyLoose(label)))
  ) {
    return true;
  }

  return false;
}

export function articlesForCategory(articles: Article[], category: Category): Article[] {
  return articles
    .filter(a => articleMatchesCategory(a, category))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
