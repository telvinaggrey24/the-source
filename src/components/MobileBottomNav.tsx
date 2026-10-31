import React from 'react';
import { useNews } from '../context/NewsContext';
import {
  Home,
  Newspaper,
  Trophy,
  Users,
  SlidersHorizontal,
  Shield,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    view,
    setView,
    currentUser,
    isAdminAuthenticated,
    language,
  } = useNews();

  const isHome = view.type === 'home';
  const isBusiness = view.type === 'category' && view.categorySlug === 'business';
  const isSports = view.type === 'category' && view.categorySlug === 'sports';
  const isAuthors = view.type === 'authors-directory' || view.type === 'author';
  const isAdmin = view.type === 'admin';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-1 py-1 flex items-center justify-around select-none no-print"
      aria-label="Mobile Navigation"
    >
      {/* 1. Home */}
      <button
        onClick={() => setView({ type: 'home' })}
        className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 transition-colors cursor-pointer rounded-xs ${
          isHome ? 'text-[#BB1919] font-bold' : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <Home className={`w-5 h-5 mb-0.5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] leading-tight tracking-tight">Home</span>
      </button>

      {/* 2. Business Category */}
      <button
        onClick={() => setView({ type: 'category', categorySlug: 'business' })}
        className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 transition-colors cursor-pointer rounded-xs ${
          isBusiness ? 'text-[#BB1919] font-bold' : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <Newspaper className={`w-5 h-5 mb-0.5 ${isBusiness ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] leading-tight tracking-tight">
          {language === 'sw' ? 'Biashara' : 'Business'}
        </span>
      </button>

      {/* 3. Sports Category */}
      <button
        onClick={() => setView({ type: 'category', categorySlug: 'sports' })}
        className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 transition-colors cursor-pointer rounded-xs ${
          isSports ? 'text-[#BB1919] font-bold' : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <Trophy className={`w-5 h-5 mb-0.5 ${isSports ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] leading-tight tracking-tight">
          {language === 'sw' ? 'Michezo' : 'Sports'}
        </span>
      </button>

      {/* 4. Journalists / Staff */}
      <button
        onClick={() => setView({ type: 'authors-directory' })}
        className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 transition-colors cursor-pointer rounded-xs ${
          isAuthors ? 'text-[#BB1919] font-bold' : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <Users className={`w-5 h-5 mb-0.5 ${isAuthors ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] leading-tight tracking-tight">
          {language === 'sw' ? 'Waandishi' : 'Staff'}
        </span>
      </button>

      {/* 5. Dashboard / Control / Account */}
      <button
        onClick={() => {
          if (isAdminAuthenticated) {
            setView({ type: 'admin' });
          } else {
            // Direct toggle to admin dashboard or auth
            setView({ type: 'admin' });
          }
        }}
        className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 transition-colors cursor-pointer rounded-xs relative ${
          isAdmin ? 'text-[#BB1919] font-bold' : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <div className="relative">
          {isAdminAuthenticated ? (
            <Shield className={`w-5 h-5 mb-0.5 text-[#BB1919] ${isAdmin ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          ) : (
            <SlidersHorizontal className={`w-5 h-5 mb-0.5 ${isAdmin ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          )}
          {currentUser && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
          )}
        </div>
        <span className="text-[10px] leading-tight tracking-tight">
          {language === 'sw' ? 'Kidhibiti' : 'Dashboard'}
        </span>
      </button>
    </nav>
  );
};
