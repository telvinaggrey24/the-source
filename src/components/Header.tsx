import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { getCategoryTheme } from '../utils/categoryTheme';
import {
  Search,
  Bookmark,
  Menu,
  X,
  Shield,
  User,
  Heart,
  Phone,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeCategories,
    view,
    setView,
    bookmarks,
    setIsBookmarksOpen,
    setIsSearchOpen,
    setIsNewsletterOpen,
    isAdminAuthenticated,
    currentUser,
    setIsAuthModalOpen,
    setIsDonateModalOpen,
    appearanceSettings,
    websiteSettings,
  } = useNews();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Formatted date in English
  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const isCurrentCategory = (slug: string) => {
    return view.type === 'category' && view.categorySlug === slug;
  };

  // The 10 standardized English categories requested
  const MAIN_NAV_ITEMS = [
    { label: 'Home', slug: 'home', isHome: true },
    { label: 'Business', slug: 'business' },
    { label: 'Politics', slug: 'politics' },
    { label: 'Sports', slug: 'sports' },
    { label: 'Football', slug: 'football' },
    { label: 'Entertainment', slug: 'entertainment' },
    { label: 'Music', slug: 'music' },
    { label: 'Jobs', slug: 'jobs' },
    { label: 'Technology', slug: 'technology' },
    { label: 'International', slug: 'international' },
  ];

  // Filter with activeCategories to keep synchronized with admin enable/disable
  const visibleNavItems = MAIN_NAV_ITEMS.filter(item => {
    if (item.isHome) return true;
    const cat = activeCategories.find(c => c.slug === item.slug);
    return cat ? cat.isActive !== false : true;
  });

  return (
    <header className="w-full bg-white text-stone-900 border-b border-stone-200 sticky top-0 z-40 shadow-xs" aria-label="Main navigation">
      {/* Maintenance Mode Warning Banner if enabled */}
      {websiteSettings.maintenanceMode && (
        <div className="bg-amber-500 text-stone-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between border-b border-amber-600">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-stone-950" />
              <span>Maintenance Mode is active. Website modifications are restricted to administrators.</span>
            </span>
            <button
              onClick={() => setView({ type: 'admin' })}
              className="underline text-[11px] font-bold uppercase hover:text-white"
            >
              Open CMS Controls &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 1. MASTER BRAND TOP BAR */}
      <div className="bg-[#121212] text-white text-xs py-2 px-4 sm:px-6 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-sans">
          {/* Official Logo (Top Strip Resized) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView({ type: 'home' })}
              className="flex items-center gap-2 cursor-pointer focus:outline-hidden group"
              aria-label={`${appearanceSettings?.siteName || 'THE SOURCE'} Home`}
            >
              <img
                src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                alt="The Source"
                className="h-8 w-auto object-contain bg-white rounded-xs px-2 py-0.5 shadow-2xs group-hover:opacity-90 transition-opacity"
              />
            </button>

            <span className="hidden sm:inline-block text-stone-400 text-[11px] font-medium border-l border-stone-800 pl-3">
              {todayFormatted}
            </span>
          </div>

          {/* Right Utility Navigation: Sign In, Donate, Saved, Search, Staff CMS */}
          <div className="flex items-center gap-3">
            {/* Newsroom Hotline Pill */}
            <a
              href={`tel:${appearanceSettings.contactPhone.replace(/\s+/g, '')}`}
              className="hidden xl:flex items-center gap-1.5 text-stone-300 hover:text-white px-2 py-0.5 rounded-2xs bg-stone-900 border border-stone-800 text-[11px] font-mono transition-colors cursor-pointer"
              title={`Newsroom Desk: ${appearanceSettings.contactPhone}`}
            >
              <Phone className="w-3 h-3 text-[#BB1919]" />
              <span>{appearanceSettings.contactPhone}</span>
            </a>

            {/* Reader Log In */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold px-2 py-1 rounded-2xs hover:bg-stone-800"
              title="Reader Account / Sign In"
            >
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign in'}
              </span>
              {currentUser && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>

            {/* Donate Trigger Button */}
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="px-2.5 py-1 bg-[#BB1919] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="Support Digital Daily Journalism"
            >
              <Heart className="w-3 h-3 fill-white" />
              <span className="hidden sm:inline">Donate</span>
            </button>

            <span aria-hidden="true" className="text-stone-700 hidden sm:inline">|</span>

            {/* Bookmarks */}
            <button
              onClick={() => setIsBookmarksOpen(true)}
              className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Saved reading list"
            >
              <Bookmark className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Saved</span>
              {bookmarks.length > 0 && (
                <span className="w-4 h-4 bg-[#BB1919] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {bookmarks.length}
                </span>
              )}
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer p-1"
              title="Search The Source"
            >
              <Search className="w-4 h-4 text-stone-400" />
              <span className="hidden sm:inline font-semibold">Search</span>
            </button>

            {/* Admin CMS Portal Trigger */}
            <button
              onClick={() => setView({ type: 'admin' })}
              className={`flex items-center gap-1 text-xs font-bold cursor-pointer px-2 py-1 rounded-2xs transition-colors ${
                view.type === 'admin'
                  ? 'bg-[#BB1919] text-white'
                  : 'text-red-400 hover:text-red-300 hover:bg-stone-900'
              }`}
              title="Admin CMS & Control Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">
                {isAdminAuthenticated ? 'Admin CMS' : 'Staff'}
              </span>
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-stone-300 hover:text-white cursor-pointer ml-1"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. EDITORIAL MASTHEAD BANNER WITH OFFICIAL LOGO */}
      <div className="bg-[#121212] text-white py-3.5 sm:py-5 px-4 sm:px-6 shadow-sm border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setView({ type: 'home' })}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-left cursor-pointer focus:outline-hidden group"
          >
            <div className="bg-white p-2 rounded shadow-md border border-stone-200 shrink-0">
              <img
                src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                alt="THE SOURCE — Real News • Real People • Real Impact"
                className="h-12 sm:h-16 md:h-20 w-auto object-contain group-hover:scale-[1.01] transition-transform"
              />
            </div>
            <div className="text-center sm:text-left self-center">
              <span className="text-[11px] sm:text-xs text-red-500 font-black tracking-widest uppercase block">
                Daily Update
              </span>
              <span className="text-xs text-stone-300 font-medium tracking-tight">
                Tanzania &bull; East Africa &bull; Global Affairs
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-3 text-xs font-sans text-stone-300">
            {/* Phone hotline */}
            <a
              href="tel:+255622754599"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-2xs text-[11px] font-mono tracking-tight transition-colors cursor-pointer text-stone-200 shadow-2xs"
              title="Newsroom Phone Hotline"
            >
              <Phone className="w-3.5 h-3.5 text-[#BB1919]" />
              <span>Desk: +255 622 754 599</span>
            </a>

            {/* WhatsApp Tip Desk */}
            <a
              href="https://wa.me/255622754599"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-2xs text-[11px] font-mono tracking-tight text-emerald-300 transition-colors cursor-pointer shadow-2xs"
              title="Confidential WhatsApp Tip Desk (+255 622 754 599)"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: 622754599</span>
            </a>

            <span aria-hidden="true" className="text-stone-700">&bull;</span>
            <span className="font-mono text-stone-400">Dar es Salaam 29°C</span>
            <span aria-hidden="true" className="text-stone-700">&bull;</span>
            <span className="font-mono tabular-nums text-stone-300">USD/TZS 2,642</span>
          </div>
        </div>
      </div>

      {/* 3. HORIZONTAL MAIN NAVIGATION MENU (Desktop: Colored Category Tabs) */}
      <nav className="bg-white border-b border-stone-200 hidden md:block" aria-label="Desktop category navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-sans font-bold">
          <div className="flex items-center space-x-1.5 py-1.5 overflow-x-auto no-scrollbar">
            {visibleNavItems.map(item => {
              const isSelected = item.isHome ? view.type === 'home' : isCurrentCategory(item.slug);
              const theme = getCategoryTheme(item.slug);
              return (
                <button
                  key={item.slug}
                  onClick={() => {
                    if (item.isHome) {
                      setView({ type: 'home' });
                    } else {
                      setView({ type: 'category', categorySlug: item.slug });
                    }
                  }}
                  className={`py-2 px-3 rounded-md transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider text-[11px] lg:text-xs flex items-center gap-1.5 ${
                    isSelected
                      ? `${theme.activeBg} text-white font-black shadow-sm scale-102`
                      : `text-stone-700 ${theme.hoverBg} ${theme.hoverText}`
                  }`}
                  style={isSelected ? { backgroundColor: theme.color } : {}}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-transform ${isSelected ? 'bg-white scale-110' : ''}`}
                    style={!isSelected ? { backgroundColor: theme.color } : {}}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0 py-1 pl-2">
            <button
              onClick={() => setIsNewsletterOpen(true)}
              className="px-3 py-1.5 bg-stone-900 text-white text-[11px] uppercase tracking-wider font-bold hover:bg-[#BB1919] transition-colors rounded-md cursor-pointer shadow-2xs"
            >
              Newsletter
            </button>
          </div>
        </div>
      </nav>

      {/* 4. RESPONSIVE MOBILE DRAWER MENU (Hamburger with Logo & Color Badges) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full overflow-y-auto p-5 flex flex-col justify-between shadow-2xl animate-slide-right">
            <div>
              {/* Drawer Header with Official Logo */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <img
                  src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                  alt="The Source"
                  className="h-9 w-auto object-contain bg-white rounded p-1 shadow-2xs"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer rounded-xs"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Exact English Navigation Menu on Mobile with Category Colors */}
              <div className="py-4 space-y-1.5 text-sm font-sans font-bold">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-3 pb-1 block">
                  Main Categories
                </span>

                {visibleNavItems.map(item => {
                  const isSelected = item.isHome ? view.type === 'home' : isCurrentCategory(item.slug);
                  const theme = getCategoryTheme(item.slug);
                  return (
                    <button
                      key={item.slug}
                      onClick={() => {
                        if (item.isHome) {
                          setView({ type: 'home' });
                        } else {
                          setView({ type: 'category', categorySlug: item.slug });
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2.5 px-3 rounded-md uppercase tracking-wide transition-all flex items-center justify-between ${
                        isSelected
                          ? `${theme.activeBg} text-white font-black shadow-sm`
                          : `text-stone-800 ${theme.hoverBg} ${theme.hoverText}`
                      }`}
                      style={isSelected ? { backgroundColor: theme.color } : {}}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white' : ''}`}
                          style={!isSelected ? { backgroundColor: theme.color } : {}}
                        />
                        <span>{item.label}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="border-t border-stone-200 pt-3 mt-2 space-y-1">
                  <button
                    onClick={() => {
                      setView({ type: 'authors-directory' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 text-stone-700 hover:text-red-700 text-xs font-semibold"
                  >
                    Our Journalists
                  </button>

                  <button
                    onClick={() => {
                      setView({ type: 'page', pageId: 'verify' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 text-emerald-700 hover:text-emerald-800 text-xs font-bold"
                  >
                    The Source Verify (Fact Check)
                  </button>

                  <button
                    onClick={() => {
                      setView({ type: 'admin' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 text-stone-600 hover:text-red-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-red-600" />
                    <span>Admin CMS Portal</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-stone-200 pt-4 space-y-2">
              {/* Quick Mobile Contact Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:+255622754599"
                  className="py-2 px-2 bg-stone-900 text-white rounded text-center font-bold flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <Phone className="w-3.5 h-3.5 text-red-500" />
                  <span>Desk: 622 754 599</span>
                </a>
                <a
                  href="https://wa.me/255622754599"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 bg-emerald-600 text-white rounded text-center font-bold flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WA: 622754599</span>
                </a>
              </div>

              <button
                onClick={() => {
                  setIsDonateModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#BB1919] text-white font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Support The Source (Donate)</span>
              </button>

              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-xs"
              >
                {currentUser ? `Signed In (${currentUser.name})` : 'Reader Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
