import React, { useMemo } from 'react';
import { useNews } from '../context/NewsContext';
import { HeroGrid } from './HeroGrid';
import { CategorySection } from './CategorySection';
import { Sidebar } from './Sidebar';
import { NewsletterSection } from './NewsletterSection';
import { articlesForCategory } from '../utils/categoryMatch';

const SECTION_ORDER = [
  'politics',
  'business',
  'international',
  'sports',
  'technology',
  'entertainment',
];

const FEATURED_LAYOUT = new Set(['politics', 'business', 'international']);

export const HomePage: React.FC = () => {
  const { articles, language, newsLoading, newsError, refreshNewsWire, activeCategories } =
    useNews();
  const publishedArticles = articles.filter(a => a.status === 'published');

  const categorySections = useMemo(() => {
    const published = articles.filter(a => a.status === 'published');
    const withStories = activeCategories
      .map(cat => ({
        category: cat,
        count: articlesForCategory(published, cat).length,
      }))
      .filter(row => row.count > 0);

    return withStories.sort((a, b) => {
      const ai = SECTION_ORDER.indexOf(a.category.slug);
      const bi = SECTION_ORDER.indexOf(b.category.slug);
      const aRank = ai === -1 ? 99 : ai;
      const bRank = bi === -1 ? 99 : bi;
      if (aRank !== bRank) return aRank - bRank;
      return b.count - a.count;
    });
  }, [activeCategories, articles]);

  if (newsLoading && publishedArticles.length === 0) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 h-8 w-8 border-2 border-[#BB1919] border-t-transparent rounded-full animate-spin" />
          <p className="font-bbc-headline text-sm font-bold text-[#121212]">
            {language === 'sw' ? 'Inapakia habari…' : 'Loading news…'}
          </p>
        </div>
      </div>
    );
  }

  if ((newsError || publishedArticles.length === 0) && !newsLoading) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md space-y-4">
          <p className="font-bbc-headline text-lg font-bold text-[#121212]">
            {newsError || 'No stories available'}
          </p>
          <button
            type="button"
            onClick={() => void refreshNewsWire()}
            className="px-5 py-2.5 bg-[#BB1919] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#A01616] cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-[#121212]">
      <HeroGrid />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <main className="lg:col-span-8 min-w-0 divide-y divide-[#E6E6E6]">
            {categorySections.length === 0 ? (
              <p className="py-8 text-sm text-[#5A5A5A]">
                {language === 'sw'
                  ? 'Hakuna makundi yenye habari kwa sasa.'
                  : 'No category sections with stories yet.'}
              </p>
            ) : (
              categorySections.map(({ category }) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  layout={FEATURED_LAYOUT.has(category.slug) ? 'featured-left' : 'grid'}
                />
              ))
            )}
          </main>

          <div className="lg:col-span-4 min-w-0">
            <Sidebar />
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
};
