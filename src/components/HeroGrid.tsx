import React from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';

/**
 * BBC News–style top stories:
 * large lead + two media promos underneath + most-read rail.
 */
export const HeroGrid: React.FC = () => {
  const { publicArticles, language, appearanceSettings } = useNews();
  const published = publicArticles;

  if (published.length === 0) return null;

  const featuredId = appearanceSettings?.featuredStoryId;
  const lead =
    (featuredId && published.find(a => a.id === featuredId)) || published[0];

  const rest = published.filter(a => a.id !== lead.id);
  const secondary = rest.slice(0, 4);
  const mostRead = rest.slice(0, 5);

  return (
    <section className="bg-white border-b border-[#E6E6E6]" aria-label="Top stories">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Lead + dual promos — BBC primary column */}
          <div className="lg:col-span-8 min-w-0">
            <ArticleCard article={lead} variant="featured" />

            {secondary.length > 0 && (
              <div className="mt-5 pt-5 border-t border-[#E6E6E6] grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {secondary.slice(0, 2).map(art => (
                  <ArticleCard key={art.id} article={art} variant="standard" />
                ))}
              </div>
            )}

            {secondary.length > 2 && (
              <div className="mt-5 pt-5 border-t border-[#E6E6E6] grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-6">
                {secondary.slice(2, 4).map(art => (
                  <ArticleCard key={art.id} article={art} variant="horizontal" />
                ))}
              </div>
            )}
          </div>

          {/* Most Read — BBC numbered list */}
          <aside className="lg:col-span-4 min-w-0">
            <div className="lg:sticky lg:top-20">
              <div className="flex items-end justify-between border-b border-[#121212] pb-2 mb-1">
                <h2 className="font-bbc-headline text-[1.25rem] font-bold text-[#121212] leading-none">
                  {language === 'sw' ? 'Zilizosomwa zaidi' : 'Most read'}
                </h2>
              </div>
              <ol className="divide-y divide-[#E6E6E6]">
                {mostRead.map((art, idx) => (
                  <li key={art.id}>
                    <ArticleCard article={art} variant="ranking" rank={idx + 1} />
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
