import React from 'react';
import { useNews } from '../context/NewsContext';
import { HeroGrid } from './HeroGrid';
import { CategorySection } from './CategorySection';
import { Sidebar } from './Sidebar';
import { NewsletterSection } from './NewsletterSection';

export const HomePage: React.FC = () => {
  const { articles, language, newsLoading, newsError, refreshNewsWire } = useNews();
  const publishedArticles = articles.filter(a => a.status === 'published');

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
            <CategorySection
              categorySlug="politics"
              title={language === 'sw' ? 'Siasa' : 'Politics'}
              layout="featured-left"
            />
            <CategorySection
              categorySlug="business"
              title={language === 'sw' ? 'Biashara' : 'Business'}
              layout="featured-left"
            />
            <CategorySection
              categorySlug="international"
              title={language === 'sw' ? 'Kimataifa' : 'World'}
              layout="grid"
            />
            <CategorySection
              categorySlug="football"
              title={language === 'sw' ? 'Soka' : 'Football'}
              layout="grid"
            />
            <CategorySection
              categorySlug="technology"
              title={language === 'sw' ? 'Teknolojia' : 'Technology'}
              layout="grid"
            />
            <CategorySection
              categorySlug="entertainment"
              title={language === 'sw' ? 'Burudani' : 'Entertainment'}
              layout="grid"
            />
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
