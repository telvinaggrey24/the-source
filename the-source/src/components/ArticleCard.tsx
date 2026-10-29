import React, { useState } from 'react';
import { Article } from '../types';
import { useNews } from '../context/NewsContext';
import { Bookmark, Clock, Eye, Newspaper, Play } from 'lucide-react';
import { getCategoryTheme } from '../utils/categoryTheme';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'horizontal' | 'compact' | 'ranking' | 'video';
  rank?: number;
  videoDuration?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  rank,
  videoDuration = '3:15',
}) => {
  const { setView, isBookmarked, toggleBookmark, language } = useNews();
  const [imgError, setImgError] = useState(false);
  const bookmarked = isBookmarked(article.id);
  const catTheme = getCategoryTheme(article.categoryId, article.categoryName);

  // Formatted date or time
  const dateFormatted = new Intl.DateTimeFormat(language === 'sw' ? 'sw-TZ' : 'en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(article.publishedAt));

  const handleCardClick = () => {
    setView({ type: 'article', slug: article.slug });
  };

  // Reusable Image element with zero-broken-image fallback & BBC styling
  const renderImage = (aspectClass: string, className = '', isVideoCard = false) => {
    if (imgError || !article.featuredImage) {
      return (
        <div className={`w-full bg-stone-100 flex flex-col items-center justify-center p-4 text-stone-400 border border-stone-200 ${aspectClass} ${className}`}>
          <Newspaper className="w-8 h-8 text-stone-300 mb-1" />
          <span className="text-xs font-sans font-bold text-stone-500 uppercase tracking-wider">{article.categoryName}</span>
        </div>
      );
    }

    return (
      <div className={`overflow-hidden bg-stone-100 ${aspectClass} ${className} relative`}>
        <img
          src={article.featuredImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          loading="lazy"
        />

        {/* BBC Video duration badge */}
        {(variant === 'video' || isVideoCard) && (
          <div className="absolute bottom-2 left-2 bg-black/85 text-white text-[11px] font-sans font-bold px-2 py-0.5 rounded-2xs flex items-center gap-1.5 shadow-sm">
            <Play className="w-3 h-3 fill-white" />
            <span>{videoDuration}</span>
          </div>
        )}

        {/* Bookmark quick button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(article.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-2xs bg-black/50 backdrop-blur-xs text-white hover:bg-black/80 transition-colors opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer ${
            bookmarked ? 'text-[#BB1919] opacity-100' : ''
          }`}
          title={bookmarked ? 'Remove bookmark' : 'Save article'}
          aria-label={bookmarked ? 'Remove bookmark' : 'Save article'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[#BB1919]' : ''}`} />
        </button>
      </div>
    );
  };

  // 1. Featured Lead Story (BBC Top Story)
  if (variant === 'featured') {
    return (
      <article
        onClick={handleCardClick}
        className="group cursor-pointer bg-white border-b-2 border-stone-200 pb-6 mb-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            {renderImage('aspect-16/10 sm:aspect-16/9 lg:h-full', 'rounded-2xs')}
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between h-full pt-1">
            <div>
              {/* BBC unboxed category kicker with desk color */}
              <div className="flex items-center gap-2 text-xs font-sans mb-2 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5" style={{ color: catTheme.badgeText }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: catTheme.primary }} />
                  {article.categoryName}
                </span>
                <span aria-hidden="true" className="text-stone-300 font-normal">|</span>
                <span className="text-stone-500 font-medium lowercase">Tanzania</span>
              </div>

              {/* BBC Bold Headline: Swahili on top */}
              <h2 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-stone-950 group-hover:text-[#BB1919] group-hover:underline transition-colors leading-tight mb-1 text-balance">
                {article.title}
              </h2>

              {/* English Headline: Down below in English */}
              {article.titleEnglish && (
                <div className="font-serif italic text-sm sm:text-base text-stone-500 mb-3 flex items-baseline gap-1.5 leading-snug">
                  <span className="not-italic font-sans font-bold text-[9px] uppercase tracking-wider px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded-2xs border border-stone-200 shrink-0">EN</span>
                  <span>{article.titleEnglish}</span>
                </div>
              )}

              {/* Swahili Summary */}
              <p className="font-sans text-stone-700 text-sm sm:text-base leading-relaxed line-clamp-3 mb-1.5">
                {article.summary}
              </p>

              {/* English Summary down below */}
              {article.summaryEnglish && (
                <p className="font-sans text-stone-500 text-xs sm:text-sm italic leading-relaxed line-clamp-2 mb-4 pl-2.5 border-l-2 border-stone-300">
                  {article.summaryEnglish}
                </p>
              )}

              {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                <div className="border-t border-stone-100 pt-3 mb-4 hidden sm:block">
                  <ul className="space-y-2 text-xs text-stone-700 font-sans">
                    {article.keyTakeaways.slice(0, 2).map((pt, i) => (
                      <li key={i} className="flex flex-col gap-0.5">
                        <div className="flex items-start gap-2">
                          <span className="text-[#BB1919] font-black">―</span>
                          <span className="line-clamp-1 font-medium text-stone-800">{pt}</span>
                        </div>
                        {article.keyTakeawaysEnglish?.[i] && (
                          <div className="pl-4 text-[11px] text-stone-400 italic line-clamp-1">
                            {article.keyTakeawaysEnglish[i]}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500 font-sans pt-2 border-t border-stone-100">
              <span className="flex items-center gap-1 font-medium text-stone-600">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {dateFormatted}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{article.readTimeMinutes} min read</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setView({ type: 'author', authorId: article.author.id });
                }}
                className="font-bold text-stone-700 hover:text-[#BB1919] hover:underline cursor-pointer"
                title={`View profile of ${article.author.name}`}
              >
                By {article.author.name}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 2. Ranking Variant (BBC Most Read 1-10 by Headings)
  if (variant === 'ranking' && rank !== undefined) {
    return (
      <article
        onClick={handleCardClick}
        className="group cursor-pointer py-3.5 border-b border-stone-200 last:border-b-0 flex items-start gap-3.5"
      >
        <span className="font-sans font-black text-2xl sm:text-3xl text-stone-300 group-hover:text-[#BB1919] transition-colors w-7 tabular-nums shrink-0 leading-none pt-0.5">
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <span
            className="text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1 mb-1"
            style={{ color: catTheme.badgeText }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: catTheme.primary }} />
            {article.categoryName}
          </span>
          {/* Swahili on top */}
          <h4 className="font-sans font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#BB1919] group-hover:underline transition-colors leading-snug line-clamp-2">
            {article.title}
          </h4>
          {/* English down below */}
          {article.titleEnglish && (
            <p className="font-serif italic text-xs text-stone-500 line-clamp-1 mt-0.5">
              {article.titleEnglish}
            </p>
          )}
          <span className="text-[11px] text-stone-400 font-mono mt-1 block">
            {article.viewsCount.toLocaleString()} reads · {article.readTimeMinutes} min
          </span>
        </div>
      </article>
    );
  }

  // 3. Horizontal 2-Column BBC Card
  if (variant === 'horizontal') {
    return (
      <article
        onClick={handleCardClick}
        className="group cursor-pointer pb-4 border-b border-stone-200 flex flex-col sm:flex-row gap-4"
      >
        <div className="w-full sm:w-44 shrink-0">
          {renderImage('aspect-16/10', 'rounded-2xs')}
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <span
              className="text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1"
              style={{ color: catTheme.badgeText }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: catTheme.primary }} />
              {article.categoryName}
            </span>
            {/* Swahili on top */}
            <h3 className="font-sans font-bold text-base text-stone-950 group-hover:text-[#BB1919] group-hover:underline transition-colors leading-snug mb-0.5 line-clamp-2">
              {article.title}
            </h3>
            {/* English down below */}
            {article.titleEnglish && (
              <p className="font-serif italic text-xs text-stone-500 mb-1.5 line-clamp-1">
                {article.titleEnglish}
              </p>
            )}
            <p className="font-sans text-xs text-stone-600 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
            {article.summaryEnglish && (
              <p className="font-sans text-[11px] text-stone-400 italic line-clamp-1 mt-0.5">
                {article.summaryEnglish}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400 font-sans pt-1">
            <span>{dateFormatted}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTimeMinutes} min</span>
          </div>
        </div>
      </article>
    );
  }

  // 4. Video Variant (BBC Video Card with play overlay)
  if (variant === 'video') {
    return (
      <article
        onClick={handleCardClick}
        className="group cursor-pointer flex flex-col justify-between"
      >
        <div>
          {renderImage('aspect-16/9', 'rounded-2xs', true)}
          <div className="pt-2.5">
            <span
              className="text-[11px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1"
              style={{ color: catTheme.badgeText }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: catTheme.primary }} />
              {article.categoryName} · Watch
            </span>
            {/* Swahili on top */}
            <h3 className="font-sans font-bold text-sm sm:text-base text-stone-950 group-hover:text-[#BB1919] group-hover:underline transition-colors leading-snug line-clamp-2">
              {article.title}
            </h3>
            {/* English down below */}
            {article.titleEnglish && (
              <p className="font-serif italic text-xs text-stone-500 line-clamp-1 mt-0.5">
                {article.titleEnglish}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-400 font-sans pt-2">
          <Clock className="w-3 h-3 text-stone-400" />
          <span>{dateFormatted}</span>
        </div>
      </article>
    );
  }

  // 5. Compact Variant
  if (variant === 'compact') {
    return (
      <article
        onClick={handleCardClick}
        className="group cursor-pointer py-3 border-b border-stone-200 last:border-b-0"
      >
        <span
          className="text-[11px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1"
          style={{ color: catTheme.badgeText }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: catTheme.primary }} />
          {article.categoryName}
        </span>
        {/* Swahili on top */}
        <h4 className="font-sans font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#BB1919] group-hover:underline transition-colors leading-snug line-clamp-2 mb-0.5">
          {article.title}
        </h4>
        {/* English down below */}
        {article.titleEnglish && (
          <p className="font-serif italic text-xs text-stone-500 line-clamp-1 mb-1">
            {article.titleEnglish}
          </p>
        )}
        <span className="text-xs text-stone-400 font-sans block">
          {dateFormatted} · {article.readTimeMinutes} min read
        </span>
      </article>
    );
  }

  // 6. Standard Grid Card (BBC 3-column story)
  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col justify-between pb-4 border-b border-stone-200 sm:border-b-0"
    >
      <div>
        {renderImage('aspect-16/10', 'rounded-2xs mb-3')}
        <div>
          <span
            className="text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1"
            style={{ color: catTheme.badgeText }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: catTheme.primary }} />
            {article.categoryName}
          </span>

          {/* Swahili headline on top */}
          <h3 className="font-sans font-bold text-base sm:text-lg text-stone-950 group-hover:text-[#BB1919] group-hover:underline transition-colors leading-snug mb-1 line-clamp-2 text-balance">
            {article.title}
          </h3>

          {/* English headline down below */}
          {article.titleEnglish && (
            <div className="font-serif italic text-xs text-stone-500 line-clamp-1 mb-2 flex items-center gap-1">
              <span className="not-italic font-sans font-bold text-[9px] uppercase tracking-wider px-1 py-0.2 bg-stone-100 text-stone-600 rounded-2xs border border-stone-200">EN</span>
              <span>{article.titleEnglish}</span>
            </div>
          )}

          {/* Swahili summary */}
          <p className="font-sans text-stone-700 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-1">
            {article.summary}
          </p>

          {/* English summary down below */}
          {article.summaryEnglish && (
            <p className="font-sans text-stone-400 text-[11px] italic line-clamp-1 leading-relaxed mb-3">
              {article.summaryEnglish}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-stone-500 font-sans pt-2 border-t border-stone-100">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-stone-400" />
          <span>{dateFormatted}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{article.categoryName}</span>
        </div>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setView({ type: 'author', authorId: article.author.id });
          }}
          className="font-medium text-stone-600 hover:text-[#BB1919] hover:underline cursor-pointer truncate max-w-[120px]"
          title={`By ${article.author.name}`}
        >
          {article.author.name}
        </span>
      </div>
    </article>
  );
};
