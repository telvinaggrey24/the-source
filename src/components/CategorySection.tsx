import React from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  categorySlug: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
  layout?: 'grid' | 'featured-left' | 'cards-row';
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categorySlug,
  title,
  layout = 'grid',
}) => {
  const { articles, setView, language } = useNews();

  const categoryArticles = articles
    .filter(
      a =>
        a.status === 'published' &&
        (a.categoryId === `cat_${categorySlug}` ||
          a.categoryId === categorySlug ||
          a.categoryName.toLowerCase() === categorySlug.toLowerCase() ||
          a.categoryName.toLowerCase().includes(categorySlug.replace(/-/g, ' ')))
    )
    .slice(0, 5);

  if (categoryArticles.length === 0) return null;

  const lead = categoryArticles[0];
  const rest = categoryArticles.slice(1);

  return (
    <section className="py-5 sm:py-6" aria-label={title}>
      <div className="flex items-center justify-between border-b border-[#121212] pb-2 mb-4">
        <h2 className="font-bbc-headline text-[1.35rem] sm:text-[1.5rem] font-bold text-[#121212]">
          {title}
        </h2>
        <button
          onClick={() => setView({ type: 'category', categorySlug })}
          className="text-[0.8rem] font-bold text-[#121212] hover:text-[#BB1919] inline-flex items-center gap-0.5 cursor-pointer"
        >
          {language === 'sw' ? 'Zaidi' : 'More'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {layout === 'featured-left' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ArticleCard article={lead} variant="standard" />
          </div>
          <div className="lg:col-span-5 divide-y divide-[#E6E6E6]">
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
