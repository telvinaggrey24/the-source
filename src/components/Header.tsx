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
    appearanceSettings,
    websiteSettings,
  } = useNews();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  const isCurrentCategory = (slug: string) =>
    view.type === 'category' && view.categorySlug === slug;

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
    { label: 'World', slug: 'international' },
  ];

  const visibleNavItems = MAIN_NAV_ITEMS.filter(item => {
    if (item.isHome) return true;
    const cat = activeCategories.find(c => c.slug === item.slug);
    return cat ? cat.isActive !== false : true;
  });

  const goNav = (item: (typeof MAIN_NAV_ITEMS)[number]) => {
    if (item.isHome) setView({ type: 'home' });
    else setView({ type: 'category', categorySlug: item.slug });
  };

  return (
    <header
      className="w-full bg-white text-[#121212] border-b border-[#E6E6E6] sticky top-0 z-40"
      aria-label="Main navigation"
    >
      {websiteSettings.maintenanceMode && (
        <div className="bg-amber-500 text-stone-950 px-4 py-1.5 text-xs font-bold">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Maintenance mode is on — public edits are limited.
            </span>
            <button
              type="button"
              onClick={() => setView({ type: 'admin' })}
              className="underline text-[11px] font-bold uppercase cursor-pointer"
            >
              Open CMS
            </button>
          </div>
        </div>
      )}

      {/* Single professional bar: logo + nav + tools */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-14 sm:h-16">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setView({ type: 'home' })}
              className="flex items-center gap-3 cursor-pointer focus:outline-none shrink-0 group"
              aria-label={`${appearanceSettings?.siteName || 'THE SOURCE'} Home`}
            >
              <img
                src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                alt="THE SOURCE"
                className="h-9 sm:h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
              <span className="hidden lg:block font-bbc-headline text-[1.15rem] font-bold tracking-tight text-[#121212] leading-none">
                {appearanceSettings?.siteName || 'THE SOURCE'}
              </span>
            </button>

            <span className="hidden xl:inline text-[11px] text-[#6E6E6E] border-l border-[#E6E6E6] pl-4 font-medium">
              {todayFormatted}
            </span>
          </div>

          <nav
            className="hidden md:flex items-center gap-0.5 flex-1 justify-center min-w-0 overflow-x-auto no-scrollbar"
            aria-label="Sections"
          >
            {visibleNavItems.map(item => {
              const isSelected = item.isHome ? view.type === 'home' : isCurrentCategory(item.slug);
              const theme = getCategoryTheme(item.slug);
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => goNav(item)}
                  className={`px-2.5 lg:px-3 py-1.5 text-[11px] lg:text-xs font-bold uppercase tracking-wide whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                    isSelected
                      ? 'text-[#121212] border-[#BB1919]'
                      : 'text-[#5A5A5A] border-transparent hover:text-[#121212] hover:border-[#C8C8C8]'
                  }`}
                  style={isSelected ? { color: theme.color === '#121212' ? '#BB1919' : theme.color } : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#5A5A5A] hover:text-[#121212] cursor-pointer"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsBookmarksOpen(true)}
              className="relative p-2 text-[#5A5A5A] hover:text-[#121212] cursor-pointer"
              title="Saved"
              aria-label="Saved stories"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarks.length > 0 && (
                <span className="absolute top-1 right-0.5 min-w-[14px] h-3.5 px-0.5 bg-[#BB1919] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-[#5A5A5A] hover:text-[#121212] cursor-pointer"
              title="Sign in"
            >
              <User className="w-4 h-4" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Sign in'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewsletterOpen(true)}
              className="hidden lg:inline-flex px-3 py-1.5 bg-[#121212] hover:bg-[#BB1919] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Newsletter
            </button>

            <button
              type="button"
              onClick={() => setView({ type: 'admin' })}
              className={`hidden sm:flex items-center gap-1 px-2 py-1.5 text-[11px] font-bold cursor-pointer ${
                view.type === 'admin' ? 'text-[#BB1919]' : 'text-[#8A8A8A] hover:text-[#BB1919]'
              }`}
              title="Staff CMS"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdminAuthenticated ? 'CMS' : 'Staff'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#121212] cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 flex">
          <div className="w-[85%] max-w-sm bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6E6E6]">
              <img
                src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                alt="THE SOURCE"
                className="h-8 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#5A5A5A] cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="px-2 py-3 space-y-0.5 flex-1" aria-label="Mobile sections">
              {visibleNavItems.map(item => {
                const isSelected = item.isHome ? view.type === 'home' : isCurrentCategory(item.slug);
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => {
                      goNav(item);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm font-bold uppercase tracking-wide cursor-pointer ${
                      isSelected ? 'text-[#BB1919] bg-[#F6F6F6]' : 'text-[#121212] hover:bg-[#F6F6F6]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="border-t border-[#E6E6E6] mt-2 pt-2 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setView({ type: 'authors-directory' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#3A3A3A] cursor-pointer"
                >
                  Journalists
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView({ type: 'admin' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-[#BB1919] cursor-pointer flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Staff CMS
                </button>
              </div>
            </nav>

            <div className="border-t border-[#E6E6E6] p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:+255622754599"
                  className="py-2.5 px-2 bg-[#121212] text-white text-center font-bold flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call desk
                </a>
                <a
                  href="https://wa.me/255622754599"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-2 bg-[#128C7E] text-white text-center font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 border border-[#E6E6E6] text-sm font-bold text-[#121212] cursor-pointer"
              >
                {currentUser ? `Signed in as ${currentUser.name}` : 'Sign in'}
              </button>
            </div>
          </div>
          <button
            type="button"
            className="flex-1 cursor-pointer"
            aria-label="Close menu overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
};
