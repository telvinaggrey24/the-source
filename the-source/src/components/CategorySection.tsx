import React from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { ArrowRight } from 'lucide-react';

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
  subtitle,
  layout = 'grid',
}) => {
  const { articles, setView, language } = useNews();

  // Articles for this category
  const categoryArticles = articles
    .filter(
      a =>
        a.status === 'published' &&
        (a.categoryId === `cat_${categorySlug}` ||
          a.categoryId === categorySlug ||
          a.categoryName.toLowerCase() === categorySlug.toLowerCase() ||
          a.categoryId.includes(categorySlug.replace('-news', '')) ||
          a.categoryName.toLowerCase().includes(categorySlug.replace(/-/g, ' ')))
    )
    .slice(0, 4);

  const displayArticles =
    categoryArticles.length > 0
      ? categoryArticles
      : articles.filter(a => a.status === 'published').slice(1, 5);

  if (displayArticles.length === 0) return null;

  const leadArticle = displayArticles[0];
  const remainingArticles = displayArticles.slice(1, 4);

  return (
    <section className="py-6 border-b border-stone-200" aria-label={title}>
      {/* BBC Section Header */}
      <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-stone-900">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-[#BB1919] inline-block" />
          <h2 className="font-sans font-black text-xl sm:text-2xl text-stone-950 uppercase tracking-tight">
            {title}
          </h2>
        </div>

        <button
          onClick={() => setView({ type: 'category', categorySlug })}
          className="text-xs font-sans font-bold text-[#BB1919] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
        >
          <span>{language === 'sw' ? 'Tazama Zote' : 'See all'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {layout === 'featured-left' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7">
            <ArticleCard article={leadArticle} variant="standard" />
          </div>
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {remainingArticles.map(art => (
              <ArticleCard key={art.id} article={art} variant="compact" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.slice(0, 3).map(art => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      )}
    </section>
  );
};
