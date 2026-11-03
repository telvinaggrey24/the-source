import React from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { articlesForCategory } from '../utils/categoryMatch';
import type { Category } from '../types';
import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  category: Category;
  layout?: 'grid' | 'featured-left';
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  layout = 'grid',
}) => {
  const { articles, setView, language } = useNews();

  const categoryArticles = articlesForCategory(articles, category).slice(0, 5);
  if (categoryArticles.length === 0) return null;

  const title =
    language === 'sw' && category.nameSwahili ? category.nameSwahili : category.name;
  const lead = categoryArticles[0];
  const rest = categoryArticles.slice(1);

  return (
    <section className="py-5 sm:py-6" aria-label={title}>
      <div className="flex items-end justify-between border-b border-[#121212] pb-2 mb-4 gap-3">
        <div className="min-w-0 flex items-center gap-2.5">
          <span
            className="hidden sm:block w-1 self-stretch min-h-[1.25rem] bg-[#BB1919]"
            style={{ backgroundColor: category.accentColor || '#BB1919' }}
            aria-hidden
          />
          <h2 className="font-bbc-headline text-[1.35rem] sm:text-[1.5rem] font-bold text-[#121212] leading-none truncate">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setView({ type: 'category', categorySlug: category.slug })}
          className="text-[0.8rem] font-bold text-[#121212] hover:text-[#BB1919] inline-flex items-center gap-0.5 cursor-pointer shrink-0"
        >
          {language === 'sw' ? 'Zaidi' : 'More'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {layout === 'featured-left' && categoryArticles.length >= 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 min-w-0">
            <ArticleCard article={lead} variant="standard" />
          </div>
          <div className="lg:col-span-5 min-w-0 divide-y divide-[#E6E6E6]">
            {rest.map(art => (
              <ArticleCard key={art.id} article={art} variant="compact" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categoryArticles.slice(0, 3).map(art => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      )}
    </section>
  );
};
