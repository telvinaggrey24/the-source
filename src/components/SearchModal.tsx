import React, { useState, useEffect, useRef } from 'react';
import { useNews } from '../context/NewsContext';
import { Search, X, Clock, ArrowRight, Tag } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    articles,
    categories,
    setView,
    language,
  } = useNews();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Filter articles
  const cleanQuery = query.trim().toLowerCase();
  const searchResults = articles.filter(art => {
    if (art.status !== 'published') return false;
    if (selectedCategory !== 'all' && art.categoryId !== selectedCategory) return false;

    if (!cleanQuery) return true;

    return (
      art.title.toLowerCase().includes(cleanQuery) ||
      art.summary.toLowerCase().includes(cleanQuery) ||
      art.categoryName.toLowerCase().includes(cleanQuery) ||
      art.author.name.toLowerCase().includes(cleanQuery) ||
      art.tags.some(t => t.toLowerCase().includes(cleanQuery))
    );
  });

  const popularTags = ['Tanzania SGR', 'Dar Port', 'Simba SC', 'Yanga SC', 'Tech', 'Dodoma', 'UTUMISHI', 'Bongo Flava'];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-start justify-center pt-8 sm:pt-20 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xs shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[85vh]">
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={language === 'sw' ? 'Tafuta habari, mada, au mwandishi...' : 'Search articles, topics, or journalists...'}
            className="w-full text-base sm:text-lg font-sans text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-sans font-bold text-stone-500 hover:text-stone-900 uppercase px-2 py-1 rounded-2xs cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Filter controls row */}
        <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-semibold uppercase tracking-wider text-[11px]">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-white border border-stone-300 text-stone-800 text-xs py-1 px-2 rounded-2xs focus:outline-hidden"
            >
              <option value="all">All Departments ({articles.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-stone-400 font-mono text-[11px]">
            {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found
          </span>
        </div>

        {/* Popular Tags */}
        {!cleanQuery && (
          <div className="px-5 py-3 border-b border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-stone-400 font-sans uppercase tracking-wider text-[10px] shrink-0 font-bold">
              Trending:
            </span>
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xs whitespace-nowrap transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Search Results List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 divide-y divide-stone-100 flex-1">
          {searchResults.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <p className="font-editorial-heading font-bold text-lg mb-1">No articles match your query</p>
              <p className="text-xs font-sans">Try searching for keywords like "SGR", "Dar es Salaam", "Simba", "Economy", or "Jobs".</p>
            </div>
          ) : (
            searchResults.map(art => (
              <div
                key={art.id}
                onClick={() => {
                  setView({ type: 'article', slug: art.slug });
                  setIsSearchOpen(false);
                }}
                className="pt-3 first:pt-0 group cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-sans text-stone-400 uppercase tracking-wide mb-1 font-semibold">
                    <span className="text-red-700">{art.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.readTimeMinutes} min</span>
                    <span aria-hidden="true">·</span>
                    <span>By {art.author.name}</span>
                  </div>

                  <h4 className="font-editorial-heading font-bold text-base sm:text-lg text-stone-950 group-hover:text-red-700 transition-colors line-clamp-1 leading-snug">
                    {art.title}
                  </h4>

                  <p className="font-editorial-body text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="shrink-0 self-center hidden sm:block">
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-red-700 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
