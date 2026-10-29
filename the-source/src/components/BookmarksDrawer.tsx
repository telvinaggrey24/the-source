import React from 'react';
import { useNews } from '../context/NewsContext';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';

export const BookmarksDrawer: React.FC = () => {
  const {
    isBookmarksOpen,
    setIsBookmarksOpen,
    bookmarks,
    toggleBookmark,
    articles,
    setView,
    language,
  } = useNews();

  if (!isBookmarksOpen) return null;

  const savedArticles = articles.filter(a => bookmarks.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-red-700 fill-red-700" />
            <h3 className="font-editorial-heading font-bold text-lg text-stone-900">
              {language === 'sw' ? 'Habari Zilizohifadhiwa' : 'Saved Reading List'} ({savedArticles.length})
            </h3>
          </div>
          <button
            onClick={() => setIsBookmarksOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
            aria-label="Close bookmarks"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <Bookmark className="w-10 h-10 mx-auto mb-3 text-stone-300" />
              <p className="font-editorial-heading font-bold text-base text-stone-800 mb-1">
                {language === 'sw' ? 'Hakuna makala zilizohifadhiwa' : 'Your reading list is empty'}
              </p>
              <p className="text-xs font-sans text-stone-500 max-w-xs mx-auto">
                {language === 'sw'
                  ? 'Bofya alama ya hifadhi kwenye makala yoyote ili kuisoma baadaye hata bila intaneti.'
                  : 'Click the bookmark icon on any article to save it for convenient offline reading later.'}
              </p>
            </div>
          ) : (
            savedArticles.map(art => (
              <div
                key={art.id}
                className="p-3.5 bg-stone-50 border border-stone-200 rounded-xs flex items-start justify-between gap-3 group"
              >
                <div
                  onClick={() => {
                    setView({ type: 'article', slug: art.slug });
                    setIsBookmarksOpen(false);
                  }}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <span className="text-[10px] font-sans font-bold text-red-700 uppercase tracking-wide block mb-1">
                    {art.categoryName}
                  </span>
                  <h4 className="font-editorial-heading font-bold text-sm text-stone-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                  <span className="text-[11px] font-sans text-stone-400 mt-1 block">
                    {art.readTimeMinutes} min read
                  </span>
                </div>

                <button
                  onClick={() => toggleBookmark(art.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove from saved"
                  aria-label="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
          <p className="text-[11px] text-stone-500 font-sans">
            Stories are saved locally to your device browser storage.
          </p>
        </div>
      </div>

      <div className="flex-1" onClick={() => setIsBookmarksOpen(false)} />
    </div>
  );
};
