import React from 'react';
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
import { DonateSection } from './components/donate/DonateSection';
import { DonateModal } from './components/donate/DonateModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthorProfilePage } from './components/AuthorProfilePage';
import { AuthorsDirectoryPage } from './components/AuthorsDirectoryPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { view } = useNews();

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col justify-between selection:bg-red-700 selection:text-white pb-16 md:pb-0">
      <div>
        {/* Navigation Header */}
        <Header />

        {/* Breaking News urgent alert ticker */}
        <BreakingTicker />

        {/* Dynamic View Router */}
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

        {/* Donate Section Situated above footer */}
        {view.type !== 'admin' && <DonateSection />}
      </div>

      {/* Global Overlays & Modals */}
      <SearchModal />
      <BookmarksDrawer />
      <NewsletterSection isModal={true} />
      <AuthModal />
      <DonateModal />

      {/* Mobile Bottom Navigation Bar (Phone) */}
      <MobileBottomNav />

      {/* Footer */}
      <Footer />
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
