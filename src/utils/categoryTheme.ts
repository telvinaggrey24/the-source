export interface CategoryTheme {
  slug: string;
  name: string;
  color: string;           // Hex color
  primary?: string;        // Alias for color
  activeBg: string;        // Tailwind active background
  activeBorder: string;    // Tailwind active border
  activeText: string;      // Tailwind active text
  hoverBg: string;         // Tailwind hover bg
  hoverText: string;       // Tailwind hover text
  badgeBg: string;         // Tailwind badge background
  badgeText: string;       // Tailwind badge text
  badgeBorder: string;     // Tailwind badge border
  gradientFrom: string;    // Hero banner gradient from
  gradientVia: string;     // Hero banner gradient via
  gradientTo: string;      // Hero banner gradient to
  tagline: string;         // Short category motto
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  home: {
    slug: 'home',
    name: 'Home',
    color: '#0F172A',
    activeBg: 'bg-stone-900',
    activeBorder: 'border-stone-900',
    activeText: 'text-white',
    hoverBg: 'hover:bg-stone-100',
    hoverText: 'hover:text-stone-900',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-900',
    badgeBorder: 'border-stone-300',
    gradientFrom: 'from-stone-950',
    gradientVia: 'via-slate-900',
    gradientTo: 'to-stone-900',
    tagline: 'Leading digital daily newsroom for East Africa',
  },
  business: {
    slug: 'business',
    name: 'Business',
    color: '#047857',
    activeBg: 'bg-emerald-700',
    activeBorder: 'border-emerald-700',
    activeText: 'text-white',
    hoverBg: 'hover:bg-emerald-50',
    hoverText: 'hover:text-emerald-700',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300',
    gradientFrom: 'from-emerald-950',
    gradientVia: 'via-teal-900',
    gradientTo: 'to-stone-950',
    tagline: 'Markets, Sovereign Trade, Corporate Finance & Investment Hubs',
  },
  politics: {
    slug: 'politics',
    name: 'Politics',
    color: '#991B1B',
    activeBg: 'bg-red-700',
    activeBorder: 'border-red-700',
    activeText: 'text-white',
    hoverBg: 'hover:bg-red-50',
    hoverText: 'hover:text-red-700',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-800',
    badgeBorder: 'border-red-300',
    gradientFrom: 'from-red-950',
    gradientVia: 'via-stone-900',
    gradientTo: 'to-stone-950',
    tagline: 'Parliamentary Affairs, Executive Governance & Regional Diplomacy',
  },
  sports: {
    slug: 'sports',
    name: 'Sports',
    color: '#EA580C',
    activeBg: 'bg-amber-600',
    activeBorder: 'border-amber-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-amber-50',
    hoverText: 'hover:text-amber-700',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-300',
    gradientFrom: 'from-amber-950',
    gradientVia: 'via-stone-900',
    gradientTo: 'to-stone-950',
    tagline: 'Athletics, Continental Championships, Basketball & Motor Racing',
  },
  football: {
    slug: 'football',
    name: 'Football',
    color: '#16A34A',
    activeBg: 'bg-green-600',
    activeBorder: 'border-green-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-green-50',
    hoverText: 'hover:text-green-700',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-800',
    badgeBorder: 'border-green-300',
    gradientFrom: 'from-green-950',
    gradientVia: 'via-emerald-900',
    gradientTo: 'to-stone-950',
    tagline: 'Premier League Matchdays, CAF Champions League & International Fixtures',
  },
  entertainment: {
    slug: 'entertainment',
    name: 'Entertainment',
    color: '#DB2777',
    activeBg: 'bg-pink-600',
    activeBorder: 'border-pink-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-pink-50',
    hoverText: 'hover:text-pink-700',
    badgeBg: 'bg-pink-50',
    badgeText: 'text-pink-800',
    badgeBorder: 'border-pink-300',
    gradientFrom: 'from-pink-950',
    gradientVia: 'via-rose-900',
    gradientTo: 'to-stone-950',
    tagline: 'Cinema, Red Carpet Galas, Television Series & Celebrity Life',
  },
  music: {
    slug: 'music',
    name: 'Music',
    color: '#8B5CF6',
    activeBg: 'bg-purple-600',
    activeBorder: 'border-purple-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-purple-50',
    hoverText: 'hover:text-purple-700',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-300',
    gradientFrom: 'from-purple-950',
    gradientVia: 'via-indigo-900',
    gradientTo: 'to-stone-950',
    tagline: 'Album Releases, Live Concerts, Studio Sessions & Chart Tracking',
  },
  jobs: {
    slug: 'jobs',
    name: 'Jobs',
    color: '#0891B2',
    activeBg: 'bg-sky-600',
    activeBorder: 'border-sky-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-sky-50',
    hoverText: 'hover:text-sky-700',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-800',
    badgeBorder: 'border-sky-300',
    gradientFrom: 'from-sky-950',
    gradientVia: 'via-cyan-900',
    gradientTo: 'to-stone-950',
    tagline: 'Public Service Vacancies, Corporate Careers & High-Growth Tenders',
  },
  technology: {
    slug: 'technology',
    name: 'Technology',
    color: '#2563EB',
    activeBg: 'bg-blue-600',
    activeBorder: 'border-blue-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-blue-50',
    hoverText: 'hover:text-blue-700',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-300',
    gradientFrom: 'from-blue-950',
    gradientVia: 'via-indigo-950',
    gradientTo: 'to-stone-950',
    tagline: 'Artificial Intelligence, Silicon Savanna Startups & Digital Infrastructure',
  },
  international: {
    slug: 'international',
    name: 'International',
    color: '#DC2626',
    activeBg: 'bg-red-600',
    activeBorder: 'border-red-600',
    activeText: 'text-white',
    hoverBg: 'hover:bg-red-50',
    hoverText: 'hover:text-red-700',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-800',
    badgeBorder: 'border-red-300',
    gradientFrom: 'from-red-950',
    gradientVia: 'via-slate-900',
    gradientTo: 'to-stone-950',
    tagline: 'Global Geopolitics, United Nations Treaties & World Affairs',
  },
};

export const getCategoryTheme = (slugOrId?: string, nameFallback?: string): CategoryTheme => {
  if (!slugOrId && !nameFallback) {
    const home = CATEGORY_THEMES.home;
    return { ...home, primary: home.color };
  }
  const clean = (slugOrId || nameFallback || '').toLowerCase().replace('cat_', '').replace('-news', '').trim();
  const theme = CATEGORY_THEMES[clean] || CATEGORY_THEMES.home;
  return { ...theme, primary: theme.color };
};
