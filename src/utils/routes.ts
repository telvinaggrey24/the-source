import type { ViewState } from '../types';

export type StaticPageId = Extract<ViewState, { type: 'page' }>['pageId'];

const PAGE_IDS = new Set<StaticPageId>([
  'about',
  'contact',
  'policy',
  'privacy',
  'terms',
  'jobs',
  'verify',
  'video',
  'audio',
  'weather',
  'job-and-health',
]);

function isStaticPageId(value: string): value is StaticPageId {
  return PAGE_IDS.has(value as StaticPageId);
}

export function pathFromView(view: ViewState): string {
  switch (view.type) {
    case 'article':
      return `/article/${encodeURIComponent(view.slug)}`;
    case 'category':
      return `/category/${encodeURIComponent(view.categorySlug)}`;
    case 'author':
      return `/author/${encodeURIComponent(view.authorId)}`;
    case 'authors-directory':
      return '/authors';
    case 'admin':
      return '/admin';
    case 'page':
      return `/page/${encodeURIComponent(view.pageId)}`;
    case 'search':
    case 'home':
    default:
      return '/';
  }
}

export function viewFromPath(pathname: string): ViewState {
  const raw = pathname.replace(/\/+$/, '') || '/';
  let path: string;
  try {
    path = decodeURIComponent(raw);
  } catch {
    path = raw;
  }

  if (path === '/' || path === '') return { type: 'home' };
  if (path === '/authors') return { type: 'authors-directory' };
  if (path === '/admin') return { type: 'admin' };

  const article = path.match(/^\/article\/(.+)$/);
  if (article?.[1]) return { type: 'article', slug: article[1] };

  const category = path.match(/^\/category\/(.+)$/);
  if (category?.[1]) return { type: 'category', categorySlug: category[1] };

  const author = path.match(/^\/author\/(.+)$/);
  if (author?.[1]) return { type: 'author', authorId: author[1] };

  const page = path.match(/^\/page\/(.+)$/);
  if (page?.[1] && isStaticPageId(page[1])) return { type: 'page', pageId: page[1] };

  return { type: 'home' };
}

export function analyticsFromView(view: ViewState): { path: string; route: string } {
  switch (view.type) {
    case 'home':
      return { path: '/', route: '/' };
    case 'article':
      return { path: `/article/${view.slug}`, route: '/article/[slug]' };
    case 'category':
      return { path: `/category/${view.categorySlug}`, route: '/category/[slug]' };
    case 'author':
      return { path: `/author/${view.authorId}`, route: '/author/[id]' };
    case 'authors-directory':
      return { path: '/authors', route: '/authors' };
    case 'admin':
      return { path: '/admin', route: '/admin' };
    case 'page':
      return { path: `/page/${view.pageId}`, route: '/page/[id]' };
    case 'search':
      return { path: '/search', route: '/search' };
    default:
      return { path: '/', route: '/' };
  }
}

export function articlePath(slug: string): string {
  return pathFromView({ type: 'article', slug });
}
