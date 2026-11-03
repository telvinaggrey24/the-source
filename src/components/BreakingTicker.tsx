import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { ChevronRight, ChevronLeft, Pause, Play } from 'lucide-react';

export const BreakingTicker: React.FC = () => {
  const { articles, openArticle, language, appearanceSettings } = useNews();

  if (appearanceSettings?.breakingNewsEnabled === false) return null;

  const breakingArticles = articles.filter(a => a.isBreaking && a.status === 'published');
  const [isPaused, setIsPaused] = useState(false);

  // If custom ticker text is set in admin appearance settings, prioritize it
  const customTickerText = appearanceSettings?.breakingNewsTicker?.trim();

  // If fewer than 2 breaking articles, grab other urgent/trending ones to give a rich ticker experience
  const baseItems = breakingArticles.length >= 2 
    ? breakingArticles 
    : [...breakingArticles, ...articles.filter(a => a.isTrending && a.status === 'published').slice(0, 4)];

  if (baseItems.length === 0 && !customTickerText) return null;

  // Duplicate items for continuous seamless loop
  const duplicatedItems = [...baseItems, ...baseItems];

  return (
    <div
      className="bg-[#F6F6F6] text-[#121212] border-b border-[#E6E6E6] overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Breaking News Alert"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3 font-sans relative">
        <div className="flex items-center gap-2 shrink-0 bg-[#BB1919] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>{language === 'sw' ? 'Moja kwa Moja' : 'Live'}</span>
        </div>

        {/* Continuous ticker track sliding from right to left */}
        <div className="flex-1 overflow-hidden relative mask-fade-edges">
          <div
            className={`animate-marquee-rtl flex items-center gap-8 ${
              isPaused ? '[animation-play-state:paused]' : ''
            }`}
          >
            {duplicatedItems.map((item, idx) => (
              <button
                key={`${item.id}-${idx}`}
                onClick={() => openArticle(item)}
                className="inline-flex items-center gap-2 text-xs text-[#3A3A3A] hover:text-[#BB1919] transition-colors cursor-pointer whitespace-nowrap shrink-0 group"
              >
                <span className="text-[#BB1919] font-bold">
                  {item.categoryName}
                </span>
                <span className="font-semibold text-[#121212] group-hover:underline">{item.title}</span>
                <span className="text-[#C8C8C8] mx-1" aria-hidden="true">
                  ·
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pause/Play indicator */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="hidden sm:flex p-1 text-[#6E6E6E] hover:text-[#121212] cursor-pointer shrink-0 border-l border-[#E6E6E6] pl-2"
          title={isPaused ? 'Resume' : 'Pause'}
          aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
