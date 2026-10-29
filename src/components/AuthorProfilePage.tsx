import React, { useState, useMemo } from 'react';
import { useNews } from '../context/NewsContext';
import {
  ArrowLeft,
  Mail,
  Share2,
  Check,
  Send,
  Calendar,
  MapPin,
  Award,
  GraduationCap,
  Sparkles,
  BookOpen,
  Eye,
  Clock,
  MessageSquare,
  Search,
  ExternalLink,
  ShieldCheck,
  Filter,
  CheckCircle,
} from 'lucide-react';

interface AuthorProfilePageProps {
  authorId: string;
}

export const AuthorProfilePage: React.FC<AuthorProfilePageProps> = ({ authorId }) => {
  const { authors, getAuthorById, getArticlesByAuthor, setView, language } = useNews();

  // Retrieve current author or fallback
  const author = getAuthorById(authorId) || authors[0];
  const allAuthorArticles = getArticlesByAuthor(author.id);

  // Search & Filter State within Author's Articles
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'readTime'>('newest');

  // Tip Modal / Box state
  const [tipMessage, setTipMessage] = useState('');
  const [tipSender, setTipSender] = useState('');
  const [tipSent, setTipSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filtered & sorted articles
  const filteredArticles = useMemo(() => {
    return allAuthorArticles
      .filter(art => {
        if (selectedCategory !== 'all' && art.categoryId !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            art.title.toLowerCase().includes(q) ||
            art.summary.toLowerCase().includes(q) ||
            art.categoryName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return b.viewsCount - a.viewsCount;
        }
        if (sortBy === 'readTime') {
          return b.readTimeMinutes - a.readTimeMinutes;
        }
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [allAuthorArticles, selectedCategory, searchQuery, sortBy]);

  // Aggregate author stats
  const totalViews = useMemo(() => {
    return allAuthorArticles.reduce((acc, curr) => acc + curr.viewsCount, 0);
  }, [allAuthorArticles]);

  const uniqueCategories = useMemo(() => {
    const map = new Map<string, string>();
    allAuthorArticles.forEach(art => {
      map.set(art.categoryId, art.categoryName);
    });
    return Array.from(map.entries());
  }, [allAuthorArticles]);

  // Copy Profile Link
  const handleCopyProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Submit news lead
  const handleSendTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipMessage.trim()) return;
    setTipSent(true);
    setTimeout(() => {
      setTipMessage('');
      setTipSender('');
      setTipSent(false);
    }, 4000);
  };

  // Other journalists from the newsroom
  const otherAuthors = authors.filter(a => a.id !== author.id);

  return (
    <div className="w-full bg-white text-stone-900 font-sans pb-16">
      {/* 1. Breadcrumbs & Editorial Action Bar */}
      <div className="bg-stone-100 border-b border-stone-200 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <button
              onClick={() => setView({ type: 'home' })}
              className="flex items-center gap-1.5 hover:opacity-85 transition-opacity cursor-pointer mr-1"
            >
              <img
                src="/assets/logo.png"
                alt="THE SOURCE"
                className="h-5 w-auto object-contain"
              />
            </button>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <button
              onClick={() => setView({ type: 'home' })}
              className="hover:text-[#BB1919] font-medium transition-colors cursor-pointer"
            >
              {language === 'sw' ? 'Mwanzo' : 'Home'}
            </button>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <button
              onClick={() => setView({ type: 'authors-directory' })}
              className="hover:text-[#BB1919] font-medium transition-colors cursor-pointer"
            >
              {language === 'sw' ? 'Waandishi na Wahariri' : 'Journalists & Bureau Staff'}
            </button>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span className="font-bold text-stone-950 truncate max-w-xs">{author.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyProfile}
              className="flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-50 rounded-xs text-xs font-semibold text-stone-700 transition-colors cursor-pointer shadow-2xs"
              title="Copy link to author profile"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Profile'}</span>
            </button>
            <button
              onClick={() => setView({ type: 'authors-directory' })}
              className="flex items-center gap-1 px-3 py-1 bg-stone-900 text-white hover:bg-[#BB1919] rounded-xs text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Staff</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Author Profile Hero Card (Authoritative Newsroom Masthead) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10">
        <div className="bg-stone-50 border border-stone-200 p-6 sm:p-8 lg:p-10 rounded-xs relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Author Portrait & Verification Stamp */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative mb-4 group">
                <img
                  src={author.avatar}
                  alt={author.name}
                  referrerPolicy="no-referrer"
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div
                  className="absolute bottom-1 right-2 bg-emerald-700 text-white p-1.5 rounded-full shadow-md"
                  title="Accredited Staff Journalist — Habari Central / THE SOURCE"
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Verified Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-300 rounded-full text-[11px] font-sans font-bold text-stone-700 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Verified Newsroom Staff</span>
              </div>

              {/* Bureau Location & Tenure */}
              <div className="space-y-1.5 text-xs text-stone-600 font-sans w-full border-t border-stone-200 pt-3">
                {author.location && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <MapPin className="w-3.5 h-3.5 text-[#BB1919] shrink-0" />
                    <span>{author.location}</span>
                  </div>
                )}
                {author.joinedYear && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Reporting with The Desk since {author.joinedYear}</span>
                  </div>
                )}
                {author.email && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start truncate">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a
                      href={`mailto:${author.email}`}
                      className="text-[#BB1919] hover:underline font-medium"
                    >
                      {author.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-200 w-full justify-center sm:justify-start">
                {author.twitter && (
                  <a
                    href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-black text-white hover:bg-stone-800 text-xs font-mono rounded-xs transition-colors flex items-center gap-1"
                  >
                    <span>𝕏</span>
                    <span>{author.twitter}</span>
                  </a>
                )}
                {author.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${author.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-[#0A66C2] text-white hover:bg-[#004182] text-xs font-sans font-semibold rounded-xs transition-colors flex items-center gap-1"
                  >
                    <span>in</span>
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right: Author Biography, Specialties, Awards & Performance Metrics */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="border-b border-stone-200 pb-4 mb-4">
                  <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#BB1919] block mb-1">
                    Editorial Desk · Author Profile
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-sans font-black text-stone-950 tracking-tight mb-2">
                    {author.name}
                  </h1>
                  <p className="text-base sm:text-lg text-stone-700 font-medium leading-snug">
                    {author.title}
                  </p>
                </div>

                {/* Narrative Biography */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-mono">
                    Journalistic Biography
                  </h3>
                  <p className="text-stone-800 font-sans text-sm sm:text-base leading-relaxed">
                    {author.bio ||
                      `${author.name} is a contributing correspondent for Habari Central, specializing in investigative journalism and public interest reporting across East Africa.`}
                  </p>
                </div>

                {/* Beat Specialties */}
                {author.specialties && author.specialties.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-mono">
                      Core Reporting Beats & Specialties
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs font-sans text-stone-700">
                      {author.specialties.map((beat, i) => (
                        <span
                          key={i}
                          className="bg-white border border-stone-300 px-2.5 py-1 rounded-xs font-medium"
                        >
                          {beat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education & Honors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                  {author.education && (
                    <div className="flex items-start gap-2.5 text-xs text-stone-700">
                      <GraduationCap className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-stone-900">Academic Background</span>
                        <span className="text-stone-600">{author.education}</span>
                      </div>
                    </div>
                  )}
                  {author.awards && author.awards.length > 0 && (
                    <div className="flex items-start gap-2.5 text-xs text-stone-700">
                      <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-stone-900">Citations & Fellowships</span>
                        <span className="text-stone-600">{author.awards.join(' · ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Quantitative Rigor Scorecards (Tabular figures) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-stone-200 bg-white p-4 rounded-xs border border-stone-200">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
                    Published Stories
                  </span>
                  <span className="font-mono tabular-nums text-xl sm:text-2xl font-black text-stone-950">
                    {allAuthorArticles.length}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
                    Total Readers
                  </span>
                  <span className="font-mono tabular-nums text-xl sm:text-2xl font-black text-[#BB1919]">
                    {totalViews.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
                    Avg Read Time
                  </span>
                  <span className="font-mono tabular-nums text-xl sm:text-2xl font-black text-stone-950">
                    {Math.round(
                      allAuthorArticles.reduce((acc, c) => acc + c.readTimeMinutes, 0) /
                        (allAuthorArticles.length || 1)
                    )}{' '}
                    min
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
                    Editorial Status
                  </span>
                  <span className="font-sans text-xs font-bold text-emerald-700 block mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Active Staff
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Articles Roster & News Tip Desk */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Filter toolbar + Articles List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filter & Sort Bar */}
            <div className="bg-white border border-stone-200 p-4 rounded-xs shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-[#BB1919] inline-block" />
                  <h2 className="font-sans font-black text-lg text-stone-950 uppercase tracking-tight">
                    Articles by {author.name}
                  </h2>
                  <span className="font-mono text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-2xs">
                    {filteredArticles.length}
                  </span>
                </div>

                {/* Sort selection */}
                <div className="flex items-center gap-2 text-xs font-sans">
                  <span className="text-stone-500 font-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-stone-50 border border-stone-300 rounded-xs px-2.5 py-1 text-xs font-medium text-stone-800 cursor-pointer focus:outline-hidden focus:border-[#BB1919]"
                  >
                    <option value="newest">Newest Published</option>
                    <option value="popular">Most Read / Popular</option>
                    <option value="readTime">Longest Deep Reads</option>
                  </select>
                </div>
              </div>

              {/* Search & Topic Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-stone-100">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search in this author's stories..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xs pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-stone-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Topic Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar text-xs font-sans">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1 rounded-xs font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === 'all'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    All Topics
                  </button>
                  {uniqueCategories.map(([catId, catName]) => (
                    <button
                      key={catId}
                      onClick={() => setSelectedCategory(catId)}
                      className={`px-2.5 py-1 rounded-xs font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                        selectedCategory === catId
                          ? 'bg-[#BB1919] text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {catName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Zero State */}
            {filteredArticles.length === 0 && (
              <div className="bg-stone-50 border border-stone-200 p-8 text-center rounded-xs">
                <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h4 className="font-bold text-stone-900 text-base mb-1">No articles found</h4>
                <p className="text-xs text-stone-500 mb-4 font-sans">
                  No published stories matched your current search or topic filter for {author.name}.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 bg-[#BB1919] text-white text-xs font-bold uppercase rounded-xs hover:bg-red-800 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Articles Roster Cards */}
            <div className="space-y-4">
              {filteredArticles.map(art => {
                const pubDate = new Intl.DateTimeFormat(language === 'sw' ? 'sw-TZ' : 'en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(art.publishedAt));

                return (
                  <article
                    key={art.id}
                    onClick={() => setView({ type: 'article', slug: art.slug })}
                    className="group cursor-pointer bg-white border border-stone-200 hover:border-[#BB1919] p-4 sm:p-5 rounded-xs transition-colors flex flex-col sm:flex-row gap-5"
                  >
                    {/* Thumbnail */}
                    <div className="w-full sm:w-56 aspect-16/10 rounded-2xs overflow-hidden bg-stone-100 shrink-0 relative">
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                      />
                      {art.isBreaking && (
                        <div className="absolute top-2 left-2 bg-[#BB1919] text-white text-[10px] font-black uppercase px-1.5 py-0.5 tracking-wider">
                          Breaking
                        </div>
                      )}
                    </div>

                    {/* Metadata & Editorial Text */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#BB1919] mb-1.5">
                          <span>{art.categoryName}</span>
                          <span aria-hidden="true" className="text-stone-300 font-normal">·</span>
                          <span className="text-stone-500 font-medium lowercase font-mono">
                            {art.readTimeMinutes} min read
                          </span>
                        </div>

                        <h3 className="font-sans font-bold text-base sm:text-lg text-stone-950 group-hover:text-[#BB1919] group-hover:underline transition-colors leading-snug mb-2">
                          {art.title}
                        </h3>

                        <p className="font-sans text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3">
                          {art.summary}
                        </p>
                      </div>

                      {/* Card Footer: Date, Views, Comments */}
                      <div className="flex items-center justify-between text-xs font-sans text-stone-400 pt-3 border-t border-stone-100">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 font-medium text-stone-600">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            {pubDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-[11px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {art.viewsCount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {art.comments?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right Column (4 cols): Tip to Author, Verification Note, Other Staff */}
          <aside className="lg:col-span-4 space-y-6">
            {/* 1. Direct News Tip to this Journalist */}
            <div className="bg-[#121212] text-white p-5 rounded-xs border border-stone-800 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-4 h-4 text-[#BB1919]" />
                <h4 className="font-sans font-black text-sm uppercase tracking-wide text-white">
                  Send a Story Tip to {author.name.split(' ')[0]}
                </h4>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Have confidential documents, whistleblower leads, or an ongoing situation you want investigated? Your message will be delivered encrypted to the journalist’s inbox.
              </p>

              {tipSent ? (
                <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-xs text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lead received securely. Our editorial desk will review promptly.</span>
                </div>
              ) : (
                <form onSubmit={handleSendTip} className="space-y-3">
                  <textarea
                    rows={3}
                    value={tipMessage}
                    onChange={e => setTipMessage(e.target.value)}
                    placeholder="Describe the story lead, location, and relevant sources..."
                    required
                    className="w-full bg-stone-900 border border-stone-700 rounded-xs p-2.5 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-[#BB1919]"
                  />
                  <input
                    type="text"
                    value={tipSender}
                    onChange={e => setTipSender(e.target.value)}
                    placeholder="Your contact (Phone / WhatsApp or 'Anonymous')"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xs p-2 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-[#BB1919]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#BB1919] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Confidential Tip</span>
                  </button>
                </form>
              )}
            </div>

            {/* 2. Editorial Independence & Fact-Checking Pledge */}
            <div className="bg-stone-50 border border-stone-200 p-5 rounded-xs">
              <div className="flex items-center gap-2 text-stone-900 font-bold mb-2 uppercase text-xs tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Editorial Code of Ethics</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-sans mb-3">
                All reporting by {author.name} adheres to the Habari Central / THE SOURCE Editorial Charter. Sources are rigorously protected, conflicts of interest disclosed, and fact assertions corroborated by verified documentation.
              </p>
              <button
                onClick={() => setView({ type: 'page', pageId: 'policy' })}
                className="text-xs font-bold text-[#BB1919] hover:underline uppercase inline-flex items-center gap-1"
              >
                <span>Read Editorial Charter</span>
                &rarr;
              </button>
            </div>

            {/* 3. Meet Other Newsroom Colleagues */}
            <div className="bg-white border border-stone-200 p-5 rounded-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900">
                  Other Bureau Correspondents
                </h4>
                <button
                  onClick={() => setView({ type: 'authors-directory' })}
                  className="text-[11px] font-bold text-[#BB1919] hover:underline uppercase"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3.5 divide-y divide-stone-100">
                {otherAuthors.slice(0, 4).map(colleague => (
                  <div
                    key={colleague.id}
                    onClick={() => setView({ type: 'author', authorId: colleague.id })}
                    className="pt-3 first:pt-0 flex items-center gap-3 group cursor-pointer"
                  >
                    <img
                      src={colleague.avatar}
                      alt={colleague.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-sans font-bold text-xs text-stone-900 group-hover:text-[#BB1919] transition-colors leading-tight truncate">
                        {colleague.name}
                      </h5>
                      <p className="text-[11px] text-stone-500 font-sans truncate">
                        {colleague.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
