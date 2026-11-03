import React, { useMemo, useState } from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { articlesForCategory } from '../utils/categoryMatch';
import { getCategoryTheme } from '../utils/categoryTheme';
import { ArrowLeft } from 'lucide-react';

interface CategoryArchiveProps {
  categorySlug: string;
}

export const CategoryArchive: React.FC<CategoryArchiveProps> = ({ categorySlug }) => {
  const { categories, articles, setView, language } = useNews();
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [visibleCount, setVisibleCount] = useState(9);

  const theme = getCategoryTheme(categorySlug);
  const category = categories.find(c => c.slug === categorySlug) || {
    id: `cat_${categorySlug}`,
    name: theme.name,
    nameSwahili: theme.name,
    slug: categorySlug,
    description: theme.tagline,
    accentColor: theme.color,
    isActive: true,
  };

  const title =
    language === 'sw' && category.nameSwahili ? category.nameSwahili : category.name;

  const matchedArticles = useMemo(
    () => articlesForCategory(articles, category),
    // category fields — avoid recreating on every render via object identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [articles, category.id, category.slug, category.name, category.nameSwahili]
  );

  const sortedArticles = useMemo(() => {
    const list = [...matchedArticles];
    if (sortBy === 'popular') {
      return list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    }
    return list;
  }, [matchedArticles, sortBy]);

  const displayedArticles = sortedArticles.slice(0, visibleCount);
  const hasMore = visibleCount < sortedArticles.length;

  const deskLinks = categories
    .filter(c => c.isActive !== false && c.slug !== categorySlug)
    .slice(0, 8);

  return (
    <div className="w-full bg-white text-[#121212]">
      <div className="border-b border-[#E6E6E6] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <button
            type="button"
            onClick={() => setView({ type: 'home' })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5A5A] hover:text-[#BB1919] cursor-pointer mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {language === 'sw' ? 'Nyumbani' : 'Home'}
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#121212] pb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <span
                  className="w-1 h-7"
                  style={{ backgroundColor: category.accentColor || theme.color }}
                  aria-hidden
                />
                <h1 className="font-bbc-headline text-3xl sm:text-4xl font-bold leading-none tracking-tight">
                  {title}
                </h1>
              </div>
              <p className="text-sm text-[#5A5A5A] mt-2 max-w-2xl leading-relaxed">
                {category.description || theme.tagline}
              </p>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#6E6E6E] shrink-0">
              {matchedArticles.length}{' '}
              {matchedArticles.length === 1
                ? language === 'sw'
                  ? 'habari'
                  : 'story'
                : language === 'sw'
                  ? 'habari'
                  : 'stories'}
            </p>
          </div>

          {deskLinks.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4">
              {deskLinks.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setView({ type: 'category', categorySlug: cat.slug })}
                  className="text-xs font-bold uppercase tracking-wide text-[#5A5A5A] hover:text-[#BB1919] cursor-pointer"
                >
                  {language === 'sw' && cat.nameSwahili ? cat.nameSwahili : cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-[#E6E6E6]">
          <h2 className="font-bbc-headline text-lg font-bold text-[#121212]">
            {language === 'sw' ? 'Habari zote' : 'All stories'}
          </h2>
          <div className="flex items-center border border-[#E6E6E6]">
            <button
              type="button"
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                sortBy === 'latest'
                  ? 'bg-[#121212] text-white'
                  : 'bg-white text-[#5A5A5A] hover:text-[#121212]'
              }`}
            >
              {language === 'sw' ? 'Mpya' : 'Latest'}
            </button>
            <button
              type="button"
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                sortBy === 'popular'
                  ? 'bg-[#121212] text-white'
                  : 'bg-white text-[#5A5A5A] hover:text-[#121212]'
              }`}
            >
              {language === 'sw' ? 'Zilizosomwa' : 'Most read'}
            </button>
          </div>
        </div>

        {displayedArticles.length === 0 ? (
          <div className="py-16 text-center border border-[#E6E6E6] px-6">
            <p className="font-bbc-headline text-xl font-bold text-[#121212]">
              {language === 'sw'
                ? `Hakuna habari katika ${title} bado`
                : `No articles published in ${title} yet`}
            </p>
            <p className="text-sm text-[#5A5A5A] mt-2 max-w-md mx-auto">
              {language === 'sw'
                ? 'Angalia ukurasa wa mbele au chapisha habari mpya kutoka CMS.'
                : 'Check the homepage or publish a new story from the CMS.'}
            </p>
            <button
              type="button"
              onClick={() => setView({ type: 'home' })}
              className="mt-6 px-5 py-2.5 bg-[#BB1919] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#A01616] cursor-pointer"
            >
              {language === 'sw' ? 'Rudi nyumbani' : 'Back to homepage'}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedArticles.map(art => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + 9)}
                  className="px-8 py-3 bg-[#121212] hover:bg-[#BB1919] text-white text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
                >
                  {language === 'sw' ? 'Pakia zaidi' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
