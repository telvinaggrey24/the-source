import React, { useState } from 'react';
import { Article } from '../types';
import { useNews } from '../context/NewsContext';
import { AppLink } from './common/AppLink';
import { localizeArticle } from '../utils/articleLocale';
import { Bookmark, Newspaper } from 'lucide-react';

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
}) => {
  const { isBookmarked, toggleBookmark, setView, language } = useNews();
  const [imgError, setImgError] = useState(false);
  const bookmarked = isBookmarked(article.id);
  const copy = localizeArticle(article, language);

  const dateFormatted = new Intl.DateTimeFormat(language === 'sw' ? 'sw-TZ' : 'en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(article.publishedAt));

  const storyLink = { type: 'article' as const, slug: article.slug };

  const renderImage = (aspectClass: string, className = '') => {
    if (imgError || !article.featuredImage) {
      return (
        <div
          className={`w-full bg-[#F6F6F6] flex items-center justify-center ${aspectClass} ${className}`}
        >
          <Newspaper className="w-8 h-8 text-[#C8C8C8]" />
        </div>
      );
    }

    return (
      <div className={`overflow-hidden bg-[#F6F6F6] ${aspectClass} ${className} relative`}>
        <img
          src={article.featuredImage}
          alt={copy.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(article.id);
          }}
          className={`absolute top-2 right-2 p-1.5 bg-black/55 text-white hover:bg-black/80 transition-colors cursor-pointer ${
            bookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label={bookmarked ? 'Remove bookmark' : 'Save article'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-white' : ''}`} />
        </button>
      </div>
    );
  };

  if (variant === 'featured') {
    return (
      <AppLink view={storyLink} className="group cursor-pointer block">
        {renderImage('aspect-[16/9] sm:aspect-[16/8]')}
        <div className="pt-3 sm:pt-4">
          <span className="text-[#BB1919] text-[0.75rem] font-bold uppercase tracking-[0.04em]">
            {article.categoryName}
          </span>
          <h2 className="font-bbc-headline mt-1.5 text-[1.65rem] sm:text-[2.15rem] lg:text-[2.5rem] font-bold text-[#121212] leading-[1.15] group-hover:underline decoration-[#121212] underline-offset-2">
            {copy.title}
          </h2>
          <p className="mt-2.5 text-[0.95rem] text-[#3A3A3A] leading-relaxed line-clamp-3 max-w-3xl">
            {copy.summary}
          </p>
          <div className="mt-3 flex items-center gap-2 text-[0.75rem] text-[#6E6E6E]">
            <span>{dateFormatted}</span>
            <span aria-hidden="true">·</span>
            <span
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (!article.isWireStory) setView({ type: 'author', authorId: article.author.id });
              }}
              className={article.isWireStory ? '' : 'hover:underline cursor-pointer'}
            >
              {article.author.name}
            </span>
          </div>
        </div>
      </AppLink>
    );
  }

  if (variant === 'ranking' && rank !== undefined) {
    return (
      <AppLink
        view={storyLink}
        className="group cursor-pointer py-3.5 flex items-start gap-3"
      >
        <span className="font-bbc-headline text-[1.75rem] font-bold text-[#BB1919] w-7 tabular-nums shrink-0 leading-none pt-0.5">
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bbc-headline text-[1rem] sm:text-[1.05rem] font-bold text-[#121212] leading-snug group-hover:underline">
            {copy.title}
          </h3>
          <span className="mt-1 block text-[0.7rem] font-bold uppercase tracking-wide text-[#6E6E6E]">
            {article.categoryName}
          </span>
        </div>
      </AppLink>
    );
  }

  if (variant === 'horizontal') {
    return (
      <AppLink
        view={storyLink}
        className="group cursor-pointer py-4 border-b border-[#E6E6E6] last:border-b-0 flex gap-3 sm:gap-4"
      >
        <div className="w-[7.5rem] sm:w-36 shrink-0">{renderImage('aspect-[16/10]')}</div>
        <div className="min-w-0 flex-1">
          <span className="text-[#BB1919] text-[0.7rem] font-bold uppercase tracking-[0.04em]">
            {article.categoryName}
          </span>
          <h3 className="font-bbc-headline mt-1 text-[1.05rem] font-bold text-[#121212] leading-snug line-clamp-3 group-hover:underline">
            {copy.title}
          </h3>
          <span className="mt-2 block text-[0.7rem] text-[#6E6E6E]">{dateFormatted}</span>
        </div>
      </AppLink>
    );
  }

  if (variant === 'compact') {
    return (
      <AppLink
        view={storyLink}
        className="group cursor-pointer py-3 border-b border-[#E6E6E6] last:border-b-0 block"
      >
        <span className="text-[#BB1919] text-[0.7rem] font-bold uppercase tracking-[0.04em]">
          {article.categoryName}
        </span>
        <h3 className="font-bbc-headline mt-1 text-[1.05rem] font-bold text-[#121212] leading-snug line-clamp-3 group-hover:underline">
          {copy.title}
        </h3>
        <span className="mt-1.5 block text-[0.7rem] text-[#6E6E6E]">{dateFormatted}</span>
      </AppLink>
    );
  }

  return (
    <AppLink view={storyLink} className="group cursor-pointer block">
      {renderImage('aspect-[16/10] mb-2.5')}
      <span className="text-[#BB1919] text-[0.7rem] font-bold uppercase tracking-[0.04em]">
        {article.categoryName}
      </span>
      <h3 className="font-bbc-headline mt-1 text-[1.15rem] sm:text-[1.25rem] font-bold text-[#121212] leading-snug line-clamp-3 group-hover:underline">
        {copy.title}
      </h3>
      <p className="mt-1.5 text-[0.875rem] text-[#3A3A3A] leading-relaxed line-clamp-2">
        {copy.summary}
      </p>
      <span className="mt-2 block text-[0.7rem] text-[#6E6E6E]">{dateFormatted}</span>
    </AppLink>
  );
};
