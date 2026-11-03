import React from 'react';
import { useNews } from '../context/NewsContext';
import type { SiteLanguage } from '../utils/locale';

/**
 * First-visit only: ask the reader if they want original Kiswahili or English.
 * Never auto-translates — only applies after they tap a choice.
 */
export const LanguageWelcomeModal: React.FC = () => {
  const { languageManual, setLanguage, view } = useNews();

  // Don't interrupt CMS
  if (languageManual || view.type === 'admin') return null;

  const choose = (lang: SiteLanguage) => {
    setLanguage(lang);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-welcome-title"
    >
      <div className="w-full max-w-md bg-white text-[#121212] shadow-xl border border-[#E6E6E6]">
        <div className="px-5 pt-5 pb-4 border-b border-[#E6E6E6]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#BB1919] mb-2">
            THE SOURCE
          </p>
          <h2 id="lang-welcome-title" className="font-bbc-headline text-xl font-bold leading-snug">
            Choose your language
          </h2>
          <p className="mt-2 text-sm text-[#5A5A5A] leading-relaxed">
            Stories stay in the original language until you pick. You can change this anytime with{' '}
            <span className="font-bold text-[#121212]">SW / EN</span> in the header.
          </p>
          <p className="mt-2 text-sm text-[#5A5A5A] leading-relaxed">
            Chagua lugha. Habari zinabaki katika lugha asilia hadi uchague. Unaweza kubadilisha wakati
            wowote.
          </p>
        </div>

        <div className="p-4 grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => choose('sw')}
            className="w-full px-4 py-3.5 bg-[#121212] hover:bg-[#BB1919] text-white text-left cursor-pointer transition-colors"
          >
            <span className="block text-sm font-bold">Kiswahili — original</span>
            <span className="block text-xs text-white/70 mt-0.5">Keep stories in the original language</span>
          </button>
          <button
            type="button"
            onClick={() => choose('en')}
            className="w-full px-4 py-3.5 border border-[#121212] hover:bg-[#F6F6F6] text-[#121212] text-left cursor-pointer transition-colors"
          >
            <span className="block text-sm font-bold">English — translation</span>
            <span className="block text-xs text-[#6E6E6E] mt-0.5">
              Show English when a translation is available
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
