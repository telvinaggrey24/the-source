import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { Heart, ArrowRight, X, Sparkles } from 'lucide-react';

export const StickyDonateBar: React.FC = () => {
  const { language, setIsDonateModalOpen } = useNews();
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setHasScrolled(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show after user has scrolled down a bit to not clutter initial page load
  if (!isVisible || !hasScrolled) return null;

  const scrollToDonateSection = () => {
    const el = document.getElementById('donate-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsDonateModalOpen(true);
    }
  };

  return (
    <div
      className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-md text-white border-t-2 border-[#BB1919] px-4 py-2.5 sm:py-3 shadow-2xl transition-all duration-300 no-print"
      role="complementary"
      aria-label="Support The Sun Bar"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
        {/* Left pitch */}
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="w-7 h-7 bg-[#BB1919] rounded-full flex items-center justify-center shrink-0">
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white leading-tight">
              {language === 'sw'
                ? 'Unga mkono uandishi wa habari wa kila siku wa kidijitali.'
                : 'Support fearless digital daily journalism across East Africa.'}
            </p>
            <p className="text-[11px] text-stone-400 hidden md:block">
              {language === 'sw'
                ? 'The Sun inategemea michango ya wasomaji kama wewe kuendelea bila paywall.'
                : 'No corporate paywalls. Powered by contributions from civic readers like you.'}
            </p>
          </div>
        </div>

        {/* Right CTA and Preset Chips */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={scrollToDonateSection}
            className="hidden sm:inline-block px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-bold rounded-2xs border border-stone-700 transition-colors cursor-pointer"
          >
            5,000 TZS
          </button>
          <button
            onClick={scrollToDonateSection}
            className="hidden sm:inline-block px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-bold rounded-2xs border border-stone-700 transition-colors cursor-pointer"
          >
            10,000 TZS
          </button>
          <button
            onClick={scrollToDonateSection}
            className="px-4 py-1.5 bg-[#BB1919] hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider rounded-2xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Heart className="w-3 h-3 fill-white" />
            <span>{language === 'sw' ? 'Changia Sasa' : 'Contribute'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Dismiss button */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-stone-400 hover:text-white rounded-xs transition-colors cursor-pointer ml-1"
            aria-label="Dismiss donation prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
