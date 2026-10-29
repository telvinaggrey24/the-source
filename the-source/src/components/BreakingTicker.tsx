import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { ChevronRight, ChevronLeft, Pause, Play } from 'lucide-react';

export const BreakingTicker: React.FC = () => {
  const { articles, setView, language, appearanceSettings } = useNews();

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
      className="bg-[#121212] text-white border-b border-stone-800 overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Breaking News Alert"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4 font-sans relative">
        {/* Fixed BBC-style Breaking badge on the left */}
        <div className="flex items-center gap-2 shrink-0 bg-[#BB1919] text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-2xs z-10 shadow-md">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>{language === 'sw' ? 'Moja kwa Moja' : 'Breaking News'}</span>
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
                onClick={() => setView({ type: 'article', slug: item.slug })}
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-200 hover:text-red-400 hover:underline transition-colors cursor-pointer whitespace-nowrap shrink-0 group"
              >
                <span className="text-[#BB1919] font-black group-hover:text-red-300">
                  [{item.categoryName.toUpperCase()}]
                </span>
                <span className="font-bold text-white group-hover:text-red-200">{item.title}</span>
                <span className="text-stone-600 mx-2" aria-hidden="true">
                  ///
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pause/Play indicator */}
        <div className="hidden sm:flex items-center gap-2 text-stone-400 text-xs shrink-0 z-10 pl-2 border-l border-stone-800">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title={isPaused ? 'Resume sliding' : 'Pause ticker'}
            aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-white text-white" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
            {isPaused ? 'Paused' : 'LIVE TICKER'}
          </span>
        </div>
      </div>
    </div>
  );
};
