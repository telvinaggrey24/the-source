import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { getCategoryTheme } from '../utils/categoryTheme';
import { ArrowLeft, Clock, Flame, Tag, Sparkles } from 'lucide-react';

interface CategoryArchiveProps {
  categorySlug: string;
}

export const CategoryArchive: React.FC<CategoryArchiveProps> = ({ categorySlug }) => {
  const { categories, articles, setView, language } = useNews();
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [visibleCount, setVisibleCount] = useState(6);

  const theme = getCategoryTheme(categorySlug);

  // Find category by slug or name
  const category = categories.find(c => c.slug === categorySlug) || {
    id: `cat_${categorySlug}`,
    name: theme.name,
    nameSwahili: theme.name,
    slug: categorySlug,
    description: theme.tagline,
    accentColor: theme.color,
  };

  // Filter articles for this category
  const matchedArticles = articles.filter(a => {
    if (a.status !== 'published') return false;
    const catSlugNorm = categorySlug.toLowerCase().replace('-news', '');
    return (
      a.categoryId.toLowerCase().includes(catSlugNorm) ||
      a.categoryId === `cat_${catSlugNorm}` ||
      a.categoryName.toLowerCase() === category.name.toLowerCase() ||
      a.categoryName.toLowerCase().includes(catSlugNorm) ||
      a.tags.some(t => t.toLowerCase().includes(catSlugNorm))
    );
  });

  // Sort articles
  const sortedArticles = [...matchedArticles].sort((a, b) => {
    if (sortBy === 'popular') return (b.viewsCount || 0) - (a.viewsCount || 0);
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const displayedArticles = sortedArticles.slice(0, visibleCount);
  const hasMore = visibleCount < sortedArticles.length;

  return (
    <div className="w-full font-sans">
      {/* 1. TOP DEDICATED CATEGORY HERO BANNER WITH VIBRANT COLOR */}
      <div
        className={`w-full bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} text-white py-8 sm:py-12 px-4 sm:px-6 border-b-4 shadow-md relative overflow-hidden`}
        style={{ borderBottomColor: theme.color }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            {/* Breadcrumb & Official Logo */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={() => setView({ type: 'home' })}
                className="hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1.5"
              >
                <img
                  src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                  alt="The Source"
                  className="h-7 w-auto object-contain bg-white rounded px-1.5 py-0.5 shadow-2xs"
                />
              </button>
              <span className="text-white/40">&bull;</span>
              <button
                onClick={() => setView({ type: 'home' })}
                className="hover:text-white transition-colors cursor-pointer text-stone-300 font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <span className="text-white/40">&bull;</span>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-white shadow-2xs"
                style={{ backgroundColor: theme.color }}
              >
                {theme.name} Desk
              </span>
            </div>

            {/* Category Title & Tagline */}
            <div>
              <h1 className="font-editorial-heading font-black text-3xl sm:text-5xl tracking-tight uppercase leading-none text-white drop-shadow-xs">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-stone-200 mt-2 max-w-2xl font-sans leading-relaxed">
                {category.description || theme.tagline}
              </p>
            </div>

            {/* Category Metrics Pill */}
            <div className="flex items-center gap-3 text-xs text-stone-300 pt-1 font-mono">
              <span className="bg-white/10 px-2.5 py-1 rounded-sm border border-white/15">
                {matchedArticles.length} {matchedArticles.length === 1 ? 'Report' : 'Published Reports'}
              </span>
              <span className="text-white/40">&bull;</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Desk Feed
              </span>
            </div>
          </div>

          {/* Quick Category Switcher on Top */}
          <div className="bg-black/35 backdrop-blur-xs p-3.5 rounded-lg border border-white/10 max-w-md w-full">
            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block mb-2">
              Browse Other Desks:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { slug: 'music', label: 'Music', col: '#8B5CF6' },
                { slug: 'sports', label: 'Sports', col: '#EA580C' },
                { slug: 'football', label: 'Football', col: '#16A34A' },
                { slug: 'business', label: 'Business', col: '#047857' },
                { slug: 'politics', label: 'Politics', col: '#991B1B' },
                { slug: 'technology', label: 'Technology', col: '#2563EB' },
                { slug: 'entertainment', label: 'Entertainment', col: '#DB2777' },
                { slug: 'jobs', label: 'Jobs', col: '#0891B2' },
                { slug: 'international', label: 'World', col: '#DC2626' },
              ].map(catItem => {
                const isCurrent = catItem.slug === categorySlug;
                return (
                  <button
                    key={catItem.slug}
                    onClick={() => setView({ type: 'category', categorySlug: catItem.slug })}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-white text-stone-900 shadow-md font-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: catItem.col }}
                    />
                    <span>{catItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN ARTICLES FEED & SORT CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Sort & Filter Controls Bar */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b-2 border-stone-900">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-6 inline-block rounded-2xs"
              style={{ backgroundColor: theme.color }}
            />
            <h2 className="font-sans font-black text-lg sm:text-xl text-stone-950 uppercase tracking-tight">
              {category.name} Stories & In-Depth Reports
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-stone-500 hidden sm:inline">
              Sort:
            </span>
            <div className="flex items-center p-1 bg-stone-100 rounded-md border border-stone-200">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                  sortBy === 'latest'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {language === 'sw' ? 'Mpya Zaidi' : 'Latest'}
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                  sortBy === 'popular'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {language === 'sw' ? 'Zilizosomwa' : 'Most Read'}
              </button>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {displayedArticles.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 border border-stone-200 rounded-lg p-6 space-y-4">
            <p className="font-sans font-black text-xl text-stone-800">
              No articles published in {category.name} yet
            </p>
            <p className="text-stone-500 text-xs font-sans max-w-md mx-auto">
              Our bureau correspondents are preparing breaking news and analytical dispatches for this desk.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setView({ type: 'home' })}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
              >
                Return to Frontpage
              </button>
              <button
                onClick={() => setView({ type: 'admin' })}
                className="px-4 py-2 bg-[#BB1919] hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
              >
                Publish New Story
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedArticles.map(art => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="px-8 py-3 bg-[#121212] hover:bg-[#BB1919] text-white font-sans text-xs font-black uppercase tracking-widest rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  {language === 'sw' ? 'Pakia Zaidi' : 'Load More Stories'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
