import React, { useMemo } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { NewsProvider, useNews } from './context/NewsContext';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { HomePage } from './components/HomePage';
import { ArticleDetail } from './components/ArticleDetail';
import { CategoryArchive } from './components/CategoryArchive';
import { StaticPages } from './components/StaticPages';
import { SearchModal } from './components/SearchModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { NewsletterSection } from './components/NewsletterSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { JobAndHealthPage } from './components/JobAndHealthPage';
import { AuthModal } from './components/auth/AuthModal';
import { LanguageWelcomeModal } from './components/LanguageWelcomeModal';
import { AuthorProfilePage } from './components/AuthorProfilePage';
import { AuthorsDirectoryPage } from './components/AuthorsDirectoryPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { analyticsFromView } from './utils/routes';

const AppContent: React.FC = () => {
  const { view } = useNews();
  const { path, route } = useMemo(() => analyticsFromView(view), [view]);

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col justify-between selection:bg-red-700 selection:text-white pb-16 md:pb-0">
      <div>
        <Header />
        <BreakingTicker />

        <div id="main-content">
          {view.type === 'home' && <HomePage />}
          {view.type === 'article' && <ArticleDetail slug={view.slug} />}
          {view.type === 'category' && <CategoryArchive categorySlug={view.categorySlug} />}
          {view.type === 'author' && <AuthorProfilePage authorId={view.authorId} />}
          {view.type === 'authors-directory' && <AuthorsDirectoryPage />}
          {view.type === 'page' && view.pageId === 'job-and-health' && <JobAndHealthPage />}
          {view.type === 'page' && view.pageId !== 'job-and-health' && <StaticPages pageId={view.pageId} />}
          {view.type === 'admin' && <AdminDashboard />}
        </div>
      </div>

      <SearchModal />
      <BookmarksDrawer />
      <NewsletterSection isModal={true} />
      <AuthModal />
      <LanguageWelcomeModal />
      <MobileBottomNav />
      <Footer />

      {/* Vite/React — not Next.js. Tracks SPA view changes via path/route. */}
      <Analytics path={path} route={route} />
    </div>
  );
};

export default function App() {
  return (
    <NewsProvider>
      <AppContent />
    </NewsProvider>
  );
}
