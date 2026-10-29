import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { Flame, ArrowRight, ChevronLeft, ChevronRight, Clock, Pause, Play } from 'lucide-react';

export const HeroGrid: React.FC = () => {
  const { articles, language, setView, appearanceSettings } = useNews();
  const publishedArticles = articles.filter(a => a.status === 'published');

  const customHero = appearanceSettings?.featuredStoryId
    ? publishedArticles.find(a => a.id === appearanceSettings.featuredStoryId)
    : null;

  // Candidate pool for top stories slider (prioritize custom hero if set)
  const topSliderCandidates = customHero
    ? [customHero, ...publishedArticles.filter(a => a.id !== customHero.id).slice(0, 4)]
    : publishedArticles.slice(0, 5);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(180); // 3 minutes = 180 seconds

  // 3-minute sliding timer: ticks down every second
  useEffect(() => {
    if (topSliderCandidates.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Advance slide and reset to 180 seconds
          setActiveSlideIndex(curr => (curr + 1) % topSliderCandidates.length);
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [topSliderCandidates.length, isPaused]);

  if (topSliderCandidates.length === 0) return null;

  const currentHeroArticle = topSliderCandidates[activeSlideIndex] || topSliderCandidates[0];

  // Secondary sub-features excluding the current active slide
  const subFeatures = publishedArticles
    .filter(a => a.id !== currentHeroArticle.id)
    .slice(0, 3);

  const trendingArticles = [...publishedArticles]
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, 5);

  // Manual navigation handlers
  const handleNextSlide = () => {
    setActiveSlideIndex(prev => (prev + 1) % topSliderCandidates.length);
    setSecondsRemaining(180);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex(prev => (prev - 1 + topSliderCandidates.length) % topSliderCandidates.length);
    setSecondsRemaining(180);
  };

  const handleSelectSlide = (idx: number) => {
    setActiveSlideIndex(idx);
    setSecondsRemaining(180);
  };

  // Format MM:SS for countdown timer
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const progressPercent = ((180 - secondsRemaining) / 180) * 100;

  return (
    <section
      className="py-6 border-b border-stone-200"
      aria-label="Top stories slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* BBC Red Section Header + 3-Minute Slide Controls */}
        <div className="flex flex-wrap items-center justify-between pb-2 mb-4 border-b-2 border-stone-900 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#BB1919] inline-block" />
            <h2 className="font-sans font-black text-xl sm:text-2xl tracking-tight text-stone-950 uppercase">
              {language === 'sw' ? 'Habari Kuu' : 'Top Stories'}
            </h2>
          </div>

          {/* 3-Minute Timer & Controls */}
          <div className="flex items-center gap-3 text-xs font-sans">
            {/* Countdown Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-stone-100 border border-stone-300 px-3 py-1 rounded-2xs text-stone-700">
              <Clock className="w-3.5 h-3.5 text-[#BB1919]" />
              <span className="font-medium text-[11px]">
                {isPaused ? 'Slides paused' : `Next story in: ${timeFormatted}`}
              </span>
              <div className="w-12 bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#BB1919] h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-1.5">
              {topSliderCandidates.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeSlideIndex === idx
                      ? 'bg-[#BB1919] w-6'
                      : 'bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Manual Slide Arrows */}
            <div className="flex items-center gap-1 border-l border-stone-300 pl-2">
              <button
                onClick={handlePrevSlide}
                className="p-1 text-stone-700 hover:text-[#BB1919] hover:bg-stone-100 rounded-2xs cursor-pointer transition-colors"
                title="Previous top story"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSlide}
                className="p-1 text-stone-700 hover:text-[#BB1919] hover:bg-stone-100 rounded-2xs cursor-pointer transition-colors"
                title="Next top story"
                aria-label="Next story"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column BBC News Layout: Most Read on the Left, Lead Story on the Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Rail (lg:col-span-4): BBC Most Read 1-5 by Headings + Special Report */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            {/* BBC Most Read box */}
            <div className="bg-stone-50 border border-stone-200 p-5 rounded-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-stone-900">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#BB1919]" />
                  <h3 className="font-sans font-black text-base uppercase tracking-tight text-stone-950">
                    {language === 'sw' ? 'Zilizosomwa Zaidi' : 'Most Read Headings'}
                  </h3>
                </div>
                <span className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">
                  1 - 5
                </span>
              </div>

              <div className="divide-y divide-stone-200">
                {trendingArticles.map((art, idx) => (
                  <ArticleCard key={art.id} article={art} variant="ranking" rank={idx + 1} />
                ))}
              </div>
            </div>

            {/* Sub-feature #3 / Special Report */}
            {subFeatures[2] && (
              <div className="bg-white border border-stone-200 p-4 rounded-xs">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#BB1919] block mb-2">
                  Editor's Recommendation
                </span>
                <ArticleCard article={subFeatures[2]} variant="standard" />
              </div>
            )}
          </div>

          {/* Right Area (lg:col-span-8): Main 3-Minute Sliding Lead Story + Sub-features */}
          <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
            <div className="transition-opacity duration-500 ease-in-out">
              <ArticleCard article={currentHeroArticle} variant="featured" />
            </div>

            {/* 2 Sub-stories underneath */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-stone-200">
              {subFeatures.slice(0, 2).map(art => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
