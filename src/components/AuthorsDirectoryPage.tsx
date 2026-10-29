import React from 'react';
import { useNews } from '../context/NewsContext';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  Award,
} from 'lucide-react';

export const AuthorsDirectoryPage: React.FC = () => {
  const { authors, getArticlesByAuthor, setView, language } = useNews();

  return (
    <div className="w-full bg-stone-50 min-h-screen text-stone-900 font-sans pb-16">
      {/* 1. Header Banner */}
      <div className="bg-[#121212] text-white py-10 px-4 sm:px-6 border-b-4 border-[#BB1919]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <button
              onClick={() => setView({ type: 'home' })}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Rudi Ukurasa Mkuu' : 'Back to Front Page'}</span>
            </button>
            <div className="bg-white rounded-xs px-3 py-1.5 inline-flex items-center shadow-sm w-fit">
              <img
                src="/assets/logo.png"
                alt="THE SOURCE"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#BB1919] block mb-1">
            THE SOURCE · Newsroom Bureau
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-white mb-3">
            {language === 'sw' ? 'Waandishi na Wahariri Wetu' : 'Our Journalists & Editorial Staff'}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Meet the accredited correspondents, investigative reporters, and columnists delivering verified digital daily journalism across Tanzania, East Africa, and global international desks.
          </p>
        </div>
      </div>

      {/* 2. Authors Roster Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map(author => {
            const authorArticles = getArticlesByAuthor(author.id);
            const totalReads = authorArticles.reduce((acc, c) => acc + c.viewsCount, 0);

            return (
              <div
                key={author.id}
                onClick={() => setView({ type: 'author', authorId: author.id })}
                className="bg-white border border-stone-200 hover:border-[#BB1919] p-6 rounded-xs transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-full object-cover border-2 border-stone-200 group-hover:border-[#BB1919] transition-colors"
                      />
                      <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                        Staff Journalist
                      </span>
                      <h3 className="font-sans font-bold text-lg text-stone-950 group-hover:text-[#BB1919] transition-colors leading-snug">
                        {author.name}
                      </h3>
                      <p className="text-xs text-stone-600 font-medium line-clamp-1 mt-0.5">
                        {author.title}
                      </p>
                    </div>
                  </div>

                  {author.location && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#BB1919] shrink-0" />
                      <span className="truncate">{author.location}</span>
                    </div>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4 font-sans">
                    {author.bio}
                  </p>

                  {author.specialties && author.specialties.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">
                        Reporting Beats
                      </span>
                      <div className="flex flex-wrap gap-1 text-[11px] text-stone-700">
                        {author.specialties.slice(0, 3).map((beat, i) => (
                          <span
                            key={i}
                            className="bg-stone-100 px-2 py-0.5 rounded-2xs font-medium"
                          >
                            {beat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 font-mono text-stone-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {authorArticles.length} stories
                    </span>
                    <span>·</span>
                    <span>{totalReads.toLocaleString()} reads</span>
                  </div>

                  <span className="text-[#BB1919] font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
