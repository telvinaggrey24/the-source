import React from 'react';
import { useNews } from '../context/NewsContext';
import { HeroGrid } from './HeroGrid';
import { ArticleCard } from './ArticleCard';
import { CategorySection } from './CategorySection';
import { Sidebar } from './Sidebar';
import { AdBanner } from './AdBanner';
import { NewsletterSection } from './NewsletterSection';
import {
  Briefcase,
  ArrowRight,
  CheckCircle,
  Video,
  Radio,
  Play,
  CloudSun,
  ShieldAlert,
  TrendingUp,
  User,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { articles, authors, setView, language } = useNews();
  const publishedArticles = articles.filter(a => a.status === 'published');

  const sportsArticles = publishedArticles.filter(a => a.categoryId === 'cat_sports');
  const bongoArticles = publishedArticles.filter(a => a.categoryId === 'cat_entertainment');
  const techArticles = publishedArticles.filter(a => a.categoryId === 'cat_tech');
  const politicsArticles = publishedArticles.filter(a => a.categoryId === 'cat_politics');

  return (
    <div className="w-full font-sans">
      {/* 1. Header Leaderboard Ad */}
      <AdBanner slot="header_leaderboard" />

      {/* 1b. Real-Time Markets & Economy Pulse Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 sm:px-6 border-y border-stone-800 font-mono overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap">
          <div className="flex items-center gap-1.5 text-red-400 font-bold tracking-wider shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="uppercase text-[11px]">Markets Pulse:</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-stone-300">
            <span className="flex items-center gap-1.5">
              <span className="text-stone-400 font-sans font-medium">DSE All Share:</span>
              <span className="tabular-nums font-bold text-emerald-400">2,184.20 (+0.84%)</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-stone-400 font-sans font-medium">USD / TZS:</span>
              <span className="tabular-nums font-bold text-white">2,642.50</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-stone-400 font-sans font-medium">EUR / TZS:</span>
              <span className="tabular-nums font-bold text-white">2,884.10</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-stone-400 font-sans font-medium">Brent Crude:</span>
              <span className="tabular-nums font-bold text-stone-200">$76.40/bbl</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-stone-400 font-sans font-medium">Gold (Ounce):</span>
              <span className="tabular-nums font-bold text-amber-300">$2,748.10 (+1.2%)</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-stone-400 font-sans font-medium">Arabica Coffee:</span>
              <span className="tabular-nums font-bold text-emerald-400">$3.82/kg (+2.1%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. BBC Hero Grid (Top Lead Story + Secondary + Most Read) */}
      <HeroGrid />

      {/* 2b. Newsroom Voices & Bureau Columnists Rail */}
      <section className="bg-stone-50 py-6 border-b border-stone-200" aria-label="Journalists and Columnists">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-5 bg-[#BB1919] inline-block" />
              <h2 className="font-sans font-black text-lg text-stone-950 uppercase tracking-tight">
                {language === 'sw' ? 'Sauti za Waandishi Wetu' : 'Newsroom Voices & Columnists'}
              </h2>
              <span className="hidden sm:inline text-xs text-stone-500 font-medium font-sans">
                · Informed perspectives across Tanzania & the region
              </span>
            </div>
            <button
              onClick={() => setView({ type: 'authors-directory' })}
              className="text-xs font-bold text-[#BB1919] hover:underline uppercase flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'sw' ? 'Waandishi Wote' : 'All 6 Staff'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {authors.map(author => (
              <div
                key={author.id}
                onClick={() => setView({ type: 'author', authorId: author.id })}
                className="bg-white border border-stone-200 hover:border-[#BB1919] p-3.5 rounded-xs transition-all hover:shadow-2xs cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-2.5 mx-auto w-16 h-16">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 group-hover:border-[#BB1919] transition-colors"
                    />
                    <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-0.5 rounded-full shadow-2xs">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>
                  <h4 className="font-sans font-bold text-xs text-stone-900 group-hover:text-[#BB1919] transition-colors text-center line-clamp-1">
                    {author.name}
                  </h4>
                  <p className="text-[10px] text-stone-500 font-sans text-center line-clamp-1 mt-0.5">
                    {author.title.split(' ')[0]} {author.title.split(' ')[1] || ''}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-stone-100 text-center">
                  <span className="text-[10px] font-bold text-[#BB1919] uppercase tracking-wider inline-flex items-center gap-0.5 group-hover:underline">
                    <span>View Stories</span>
                    &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE SOURCE VERIFY SPOTLIGHT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-[#121212] text-white p-5 sm:p-6 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-emerald-500 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-xs shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                  THE SOURCE VERIFY
                </span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-2xs">
                  FACT CHECK
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white mt-0.5">
                Investigating Viral Claims on Mtwara Gas Pressure & National Power Reserves
              </h3>
            </div>
          </div>
          <button
            onClick={() => setView({ type: 'page', pageId: 'verify' })}
            className="px-4 py-2 bg-white text-black hover:bg-[#BB1919] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors shrink-0 cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Read Verification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. BBC VIDEO WATCH CAROUSEL */}
      <section className="bg-stone-100 py-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-stone-900">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#BB1919] inline-block" />
              <h2 className="font-sans font-black text-xl text-stone-950 uppercase tracking-tight flex items-center gap-2">
                <span>Must Watch Video</span>
                <span className="text-xs font-bold text-stone-500 font-mono normal-case">· 4K Documentaries</span>
              </h2>
            </div>
            <button
              onClick={() => setView({ type: 'page', pageId: 'video' })}
              className="text-xs font-bold text-[#BB1919] hover:underline uppercase flex items-center gap-1"
            >
              <span>All Videos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Inside the SGR Electric Cab: Driving 160km/h through Morogoro',
                cat: 'Infrastructure',
                dur: '4:20',
                img: '/src/assets/images/hero_lead_tanzania_rail_1793043305338.jpg',
              },
              {
                title: 'Dar es Salaam Port: Deep Water Berths and 24-Hour Operations',
                cat: 'Maritime',
                dur: '5:45',
                img: '/src/assets/images/news_dar_skyline_port_1793043304700.jpg',
              },
              {
                title: 'Kariakoo Derby: The Unrivaled Energy of Simba and Yanga',
                cat: 'Sport',
                dur: '6:12',
                img: '/src/assets/images/news_sports_derby_1793043306272.jpg',
              },
              {
                title: 'Swahili Sound: How Bongo Flava Conquered Global Dance Floors',
                cat: 'Culture',
                dur: '5:10',
                img: '/src/assets/images/news_bongo_culture_1793043307640.jpg',
              },
            ].map((v, i) => (
              <div
                key={i}
                onClick={() => setView({ type: 'page', pageId: 'video' })}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 rounded-2xs overflow-hidden mb-2 bg-stone-900">
                    <img
                      src={v.img}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-10 h-10 bg-[#BB1919] text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/85 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-2xs font-mono">
                      {v.dur}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#BB1919] uppercase tracking-wide block mb-0.5">
                    {v.cat}
                  </span>
                  <h3 className="font-bold text-sm text-stone-900 group-hover:text-[#BB1919] group-hover:underline transition-colors line-clamp-2 leading-snug">
                    {v.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Main 2-Column Content + Sidebar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main 8-column Editorial Feed */}
          <main className="lg:col-span-8 space-y-8">
            {/* Business Section */}
            <CategorySection
              categorySlug="business"
              title={language === 'sw' ? 'Biashara na Uchumi' : 'Business & Markets'}
              layout="featured-left"
            />

            {/* Politics Section */}
            <CategorySection
              categorySlug="politics"
              title={language === 'sw' ? 'Siasa za Bunge & Serikali' : 'Politics & Governance'}
              layout="grid"
            />

            {/* International Section */}
            <CategorySection
              categorySlug="international"
              title={language === 'sw' ? 'Habari za Kimataifa' : 'International News'}
              layout="grid"
            />

            {/* Dual Column: Football & Sports */}
            <section className="py-6 border-b border-stone-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-stone-900">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-5 bg-[#BB1919]" />
                      <h3 className="font-sans font-black text-lg text-stone-950 uppercase">
                        {language === 'sw' ? 'Soka' : 'Football'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setView({ type: 'category', categorySlug: 'football' })}
                      className="text-xs font-bold text-[#BB1919] hover:underline uppercase"
                    >
                      More &rarr;
                    </button>
                  </div>
                  {publishedArticles.find(a => a.categoryId === 'cat_football' || a.categoryId === 'cat_sports') && (
                    <ArticleCard article={publishedArticles.find(a => a.categoryId === 'cat_football' || a.categoryId === 'cat_sports')!} variant="standard" />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-stone-900">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-5 bg-[#BB1919]" />
                      <h3 className="font-sans font-black text-lg text-stone-950 uppercase">
                        {language === 'sw' ? 'Burudani' : 'Entertainment'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setView({ type: 'category', categorySlug: 'entertainment' })}
                      className="text-xs font-bold text-[#BB1919] hover:underline uppercase"
                    >
                      More &rarr;
                    </button>
                  </div>
                  {publishedArticles.find(a => a.categoryId === 'cat_entertainment' || a.categoryId === 'cat_music') && (
                    <ArticleCard article={publishedArticles.find(a => a.categoryId === 'cat_entertainment' || a.categoryId === 'cat_music')!} variant="standard" />
                  )}
                </div>
              </div>
            </section>

            {/* Technology & Education */}
            <CategorySection
              categorySlug="technology"
              title={language === 'sw' ? 'Sayansi na Teknolojia' : 'Technology & Innovation'}
              layout="grid"
            />

            {/* BBC Radio / Podcast Bulletin Banner */}
            <div className="bg-[#121212] text-white p-6 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#BB1919] rounded-full flex items-center justify-center shrink-0">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-widest block">
                    HABARI CENTRAL RADIO BULLETIN
                  </span>
                  <h4 className="font-bold text-lg text-white">Dira ya Habari: Matangazo ya Leo</h4>
                  <p className="text-xs text-stone-400">14-minute daily audio briefing with local correspondents.</p>
                </div>
              </div>
              <button
                onClick={() => setView({ type: 'page', pageId: 'audio' })}
                className="px-4 py-2 bg-[#BB1919] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer shrink-0 inline-flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Listen Now</span>
              </button>
            </div>

            {/* National Career & Opportunities Noticeboard */}
            <section className="bg-stone-50 border border-stone-200 p-6 rounded-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-stone-900">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#BB1919]" />
                  <h3 className="font-sans font-black text-lg text-stone-950 uppercase">
                    {language === 'sw' ? 'Nafasi za Kazi na Fursa za Kitaifa' : 'Jobs, Tenders & Career Board'}
                  </h3>
                </div>
                <button
                  onClick={() => setView({ type: 'page', pageId: 'jobs' })}
                  className="text-xs font-bold text-[#BB1919] hover:underline uppercase"
                >
                  Full Board &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div
                  onClick={() => setView({ type: 'article', slug: 'utumishi-announces-12000-civil-service-vacancies-across-districts' })}
                  className="p-4 bg-white border border-stone-200 hover:border-[#BB1919] transition-colors cursor-pointer rounded-xs"
                >
                  <span className="text-[10px] font-bold text-[#BB1919] uppercase block mb-1">
                    Public Service · UTUMISHI
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 mb-1 leading-snug">
                    12,500 Civil Service Vacancies: Education, Healthcare & Engineering
                  </h4>
                  <span className="text-stone-500 font-mono text-[11px]">Deadline: 20 Nov 2026</span>
                </div>

                <div
                  onClick={() => setView({ type: 'article', slug: 'tanzania-universities-launch-free-ai-stem-fellowships' })}
                  className="p-4 bg-white border border-stone-200 hover:border-[#BB1919] transition-colors cursor-pointer rounded-xs"
                >
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                    Higher Education · Fellowships
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 mb-1 leading-snug">
                    5,000 Fully Funded STEM & AI Research Grants (UDSM & NM-AIST)
                  </h4>
                  <span className="text-stone-500 font-mono text-[11px]">Applications Open Nov 1</span>
                </div>
              </div>
            </section>
          </main>

          {/* Right 4-column Rail (Sidebar) */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* 6. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
};
