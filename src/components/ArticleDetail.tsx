import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { AdBanner } from './AdBanner';
import { CommentsSection } from './CommentsSection';
import {
  Bookmark,
  Share2,
  Printer,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  User,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Check,
  Send,
  ArrowLeft,
  Flame,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { getCategoryTheme } from '../utils/categoryTheme';

interface ArticleDetailProps {
  slug: string;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ slug }) => {
  const {
    articles,
    setView,
    incrementViews,
    isBookmarked,
    toggleBookmark,
    reactToArticle,
    addComment,
    upvoteComment,
    textSize,
    setTextSize,
    language,
  } = useNews();

  const article = articles.find(a => a.slug === slug);

  // Audio simulator state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Link copy state
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  // Reading scroll progress bar state
  const [readingProgress, setReadingProgress] = useState(0);

  // Dual-language viewing mode (default: both Swahili on top & English down below)
  const [bilingualMode, setBilingualMode] = useState<'both' | 'swahili' | 'english'>('both');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentScroll = window.scrollY;
        const percent = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
        setReadingProgress(percent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (article) {
      incrementViews(article.id);
      window.scrollTo(0, 0);
    }
  }, [article?.id]);

  // Audio playback timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <h2 className="font-editorial-heading text-2xl font-bold text-stone-900 mb-3">
          {language === 'sw' ? 'Habari Haikupatikana' : 'Article Not Found'}
        </h2>
        <p className="text-stone-600 mb-6 font-sans">
          {language === 'sw'
            ? 'Makala uliyoomba inaweza kuwa imehamishwa au kufutwa.'
            : 'The story you requested may have moved or been retired.'}
        </p>
        <button
          onClick={() => setView({ type: 'home' })}
          className="px-6 py-2.5 bg-red-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xs hover:bg-red-800 transition-colors cursor-pointer"
        >
          {language === 'sw' ? 'Rudi Ukurasa Mkuu' : 'Return to Frontpage'}
        </button>
      </div>
    );
  }

  const bookmarked = isBookmarked(article.id);

  // Formatted dates
  const pubDate = new Intl.DateTimeFormat(language === 'sw' ? 'sw-TZ' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(article.publishedAt));

  // Related articles in same category
  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.categoryId === article.categoryId && a.status === 'published')
    .slice(0, 3);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://thesun.co.tz';

  const shareText = encodeURIComponent(`${article.title} — THE SUN`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(currentUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${shareText}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReactionClick = (type: keyof typeof article.reactions) => {
    if (activeReaction === type) return;
    reactToArticle(article.id, type);
    setActiveReaction(type);
  };

  // Text size classes
  const textSizeClasses = {
    sm: 'text-base leading-relaxed',
    md: 'text-lg leading-relaxed',
    lg: 'text-xl leading-loose',
    xl: 'text-2xl leading-loose',
  }[textSize];

  const theme = getCategoryTheme(article.categoryId);

  return (
    <>
      {/* Thin reading progress bar fixed at the top of viewport */}
      <div
        className="fixed top-0 left-0 w-full h-[3.5px] bg-stone-200/50 z-50 pointer-events-none no-print"
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Article reading progress"
      >
        <div
          className="h-full bg-[#BB1919] transition-all duration-75 ease-out shadow-sm"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 print-article" aria-label={article.title}>
        {/* Top back button, breadcrumbs & official logo */}
      <div className="no-print flex items-center justify-between text-xs font-sans text-stone-500 mb-6 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setView({ type: 'home' })}
            className="hover:opacity-85 transition-opacity cursor-pointer shrink-0"
            title="The Source Home"
          >
            <img
              src="/assets/logo.png"
              alt="The Source"
              className="h-7 w-auto object-contain bg-white rounded p-0.5 border border-stone-200"
            />
          </button>
          <span aria-hidden="true" className="text-stone-300">/</span>
          <button
            onClick={() => setView({ type: 'category', categorySlug: article.categoryId.replace('cat_', '') })}
            className="font-bold hover:underline uppercase text-[11px] px-2 py-0.5 rounded text-white shadow-2xs"
            style={{ backgroundColor: theme.color }}
          >
            {article.categoryName}
          </button>
        </div>

        {/* Text Size & Print Accessibility toolbar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-stone-600 bg-stone-100 px-2 py-1 rounded-xs">
            <span className="text-[11px] font-bold mr-1 uppercase">Size:</span>
            {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
              <button
                key={size}
                onClick={() => setTextSize(size)}
                className={`w-6 h-6 flex items-center justify-center font-bold text-xs rounded-2xs cursor-pointer transition-colors ${
                  textSize === size ? 'bg-[#121212] text-white' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer text-xs font-bold uppercase"
            title="Print-friendly view"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Main Article Header */}
      <div className="max-w-4xl mx-auto mb-8">
        {/* Category Badge & Breaking Status */}
        <div className="flex items-center gap-3 text-xs font-sans text-stone-500 uppercase tracking-widest font-black mb-3">
          <span
            className="px-2.5 py-1 rounded text-white text-[11px] font-black uppercase tracking-wider shadow-2xs"
            style={{ backgroundColor: theme.color }}
          >
            {article.categoryName}
          </span>
          {article.isBreaking && (
            <>
              <span aria-hidden="true">&bull;</span>
              <span className="text-white bg-[#BB1919] px-2 py-0.5 font-black uppercase text-[10px] tracking-wider rounded-2xs">
                Breaking
              </span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{article.readTimeMinutes} min read</span>
        </div>

        {/* Article Headline: Swahili on top */}
        <h1 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-stone-950 leading-tight mb-2 text-balance tracking-tight">
          {article.title}
        </h1>

        {/* English Headline: Down in English */}
        {article.titleEnglish && (
          <div className="mb-4 p-3 sm:p-4 bg-stone-50 border-l-4 border-[#BB1919] rounded-r-xs shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-1">
              English Headline &bull; Tafsiri ya Kiingereza
            </span>
            <h2 className="font-serif italic text-lg sm:text-2xl text-stone-800 leading-snug">
              {article.titleEnglish}
            </h2>
          </div>
        )}

        {/* Sub-headline / Deck: Swahili on top */}
        <p className="font-editorial-body text-stone-700 text-lg sm:text-xl leading-relaxed mb-2 font-medium">
          {article.subtitle}
        </p>

        {/* Sub-headline: English down below */}
        {article.subtitleEnglish && (
          <p className="font-serif text-stone-500 text-sm sm:text-base leading-relaxed mb-6 italic pl-3 border-l-2 border-stone-300">
            <span className="not-italic font-sans font-bold text-[10px] uppercase tracking-wider text-stone-400 block mb-0.5">
              English Summary:
            </span>
            {article.subtitleEnglish}
          </p>
        )}

        {/* Byline Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-stone-200 text-xs font-sans text-stone-600">
          <div
            onClick={() => setView({ type: 'author', authorId: article.author.id })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover border border-stone-200 group-hover:border-[#BB1919] transition-colors"
            />
            <div>
              <p className="font-bold text-stone-900 text-sm group-hover:text-[#BB1919] group-hover:underline transition-colors flex items-center gap-1.5">
                <span>{article.author.name}</span>
                <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-2xs border border-emerald-200">Staff</span>
              </p>
              <p className="text-stone-500">{article.author.title}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Published: {pubDate}
            </span>
            {article.updatedAt && (
              <span className="text-[11px] text-stone-400 mt-0.5">
                Updated: {new Date(article.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT
              </span>
            )}
          </div>
        </div>

        {/* Social Share Bar & Audio Simulator */}
        <div className="no-print mt-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-stone-50 px-4 border border-stone-200 rounded-xs">
          {/* Audio read bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 hover:bg-red-700 text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-400" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen to Story'}</span>
            </button>
            {isPlayingAudio && (
              <div className="flex items-center gap-2 text-xs font-mono text-stone-600">
                <div className="w-24 sm:w-36 bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <span>{audioProgress}%</span>
              </div>
            )}
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans font-semibold text-stone-500 uppercase tracking-wider hidden sm:inline">
              Share:
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xs transition-colors"
              title="Share on WhatsApp"
            >
              <span className="font-bold text-xs px-1">WA</span>
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white bg-stone-900 hover:bg-stone-800 rounded-xs transition-colors"
              title="Share on X"
            >
              <span className="font-bold text-xs px-1">X</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xs transition-colors"
              title="Share on Facebook"
            >
              <span className="font-bold text-xs px-1">FB</span>
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white bg-sky-500 hover:bg-sky-600 rounded-xs transition-colors"
              title="Share on Telegram"
            >
              <span className="font-bold text-xs px-1">TG</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-sans font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-xs transition-colors cursor-pointer"
              title="Copy Story Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-xs border transition-colors cursor-pointer ${
                bookmarked
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-white border-stone-300 text-stone-600 hover:bg-stone-100'
              }`}
              title={bookmarked ? 'Saved to bookmarks' : 'Save article'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-red-700' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Photo Hero */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="overflow-hidden bg-stone-100 border border-stone-200">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full aspect-16/9 sm:aspect-16/10 object-cover"
          />
        </div>
        {(article.imageCaption || article.imageCredit) && (
          <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 font-sans px-1">
            <span className="italic">{article.imageCaption}</span>
            <span className="text-[11px] font-mono text-stone-400 mt-1 sm:mt-0">{article.imageCredit}</span>
          </div>
        )}
      </div>

      {/* Article Content Layout: 8 cols prose / 4 cols margin context */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Editorial Prose */}
        <div className="lg:col-span-8 max-w-prose">
          {/* Bilingual Reading Mode Selector */}
          <div className="no-print mb-6 p-2.5 bg-stone-100 border border-stone-200 rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-sans font-semibold text-stone-700">
              <span className="w-2 h-2 rounded-full bg-[#BB1919]" />
              <span>Mtindo wa Kusoma / Reading Format:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setBilingualMode('both')}
                className={`px-3 py-1 rounded-2xs font-bold text-xs transition-colors cursor-pointer ${
                  bilingualMode === 'both' ? 'bg-[#BB1919] text-white shadow-2xs' : 'bg-white text-stone-700 hover:bg-stone-200'
                }`}
              >
                🌐 Kiswahili (Juu) &bull; English (Chini)
              </button>
              <button
                onClick={() => setBilingualMode('swahili')}
                className={`px-2.5 py-1 rounded-2xs font-medium text-xs transition-colors cursor-pointer ${
                  bilingualMode === 'swahili' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-200'
                }`}
              >
                🇹🇿 Kiswahili Tu
              </button>
              <button
                onClick={() => setBilingualMode('english')}
                className={`px-2.5 py-1 rounded-2xs font-medium text-xs transition-colors cursor-pointer ${
                  bilingualMode === 'english' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-200'
                }`}
              >
                🇬🇧 English Only
              </button>
            </div>
          </div>

          {/* Key Takeaways Callout Box */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="bg-stone-50 border border-stone-300 p-5 sm:p-6 mb-8 rounded-xs">
              <div className="flex items-center gap-2 text-red-700 font-editorial-heading font-bold text-base uppercase tracking-tight mb-3">
                <Sparkles className="w-4 h-4" />
                <span>
                  {bilingualMode === 'english' ? 'Key Takeaways & Findings' : 'Mambo Muhimu Kufahamu (Key Takeaways)'}
                </span>
              </div>
              <ul className="space-y-3 text-stone-700 font-sans text-sm">
                {article.keyTakeaways.map((point, index) => {
                  const pointEn = article.keyTakeawaysEnglish?.[index];

                  if (bilingualMode === 'english' && pointEn) {
                    return (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className="font-mono text-red-700 font-bold text-xs mt-0.5">0{index + 1}.</span>
                        <span className="leading-relaxed">{pointEn}</span>
                      </li>
                    );
                  }

                  if (bilingualMode === 'swahili' || !pointEn) {
                    return (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className="font-mono text-red-700 font-bold text-xs mt-0.5">0{index + 1}.</span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    );
                  }

                  // Both: Swahili on top, English below
                  return (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="font-mono text-red-700 font-bold text-xs mt-0.5">0{index + 1}.</span>
                      <div className="flex-1">
                        <span className="leading-relaxed font-medium text-stone-900 block">{point}</span>
                        <span className="text-xs text-stone-500 italic block mt-0.5 pl-2 border-l border-stone-300">
                          {pointEn}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Body paragraphs */}
          <div className={`font-editorial-body text-stone-900 ${textSizeClasses} space-y-6`}>
            {article.content.map((paragraph, index) => {
              const paragraphEn = article.contentEnglish?.[index];

              // Subheading
              if (paragraph.startsWith('## ')) {
                const headingSw = paragraph.replace('## ', '');
                const headingEn = paragraphEn ? paragraphEn.replace('## ', '') : '';

                if (bilingualMode === 'english' && headingEn) {
                  return (
                    <h3
                      key={index}
                      className="font-editorial-heading font-bold text-2xl text-stone-950 pt-4 pb-1 border-b border-stone-200"
                    >
                      {headingEn}
                    </h3>
                  );
                }

                return (
                  <div key={index} className="pt-4 pb-1 border-b border-stone-200 mb-2">
                    <h3 className="font-editorial-heading font-bold text-2xl text-stone-950">
                      {headingSw}
                    </h3>
                    {bilingualMode === 'both' && headingEn && (
                      <h4 className="font-serif italic text-base text-stone-500 mt-1">
                        {headingEn}
                      </h4>
                    )}
                  </div>
                );
              }

              // Blockquote
              if (paragraph.startsWith('> ')) {
                const quoteSw = paragraph.replace('> ', '');
                const quoteEn = paragraphEn ? paragraphEn.replace('> ', '') : '';

                if (bilingualMode === 'english' && quoteEn) {
                  return (
                    <blockquote
                      key={index}
                      className="py-4 my-6 border-y border-stone-300 text-stone-800 italic font-editorial-body text-xl lg:text-2xl font-medium leading-relaxed px-4"
                    >
                      {quoteEn}
                    </blockquote>
                  );
                }

                return (
                  <div key={index} className="my-6">
                    <blockquote className="py-4 border-l-4 border-[#BB1919] bg-stone-50 text-stone-900 italic font-editorial-body text-lg lg:text-xl font-medium leading-relaxed px-4">
                      {quoteSw}
                    </blockquote>
                    {bilingualMode === 'both' && quoteEn && (
                      <div className="pl-6 pt-2 text-stone-500 font-serif italic text-sm leading-relaxed border-l-2 border-stone-300 ml-2">
                        <span className="font-sans not-italic text-[10px] font-bold uppercase text-stone-400 block mb-0.5">
                          English Quote:
                        </span>
                        {quoteEn}
                      </div>
                    )}
                  </div>
                );
              }

              // English Only Mode
              if (bilingualMode === 'english' && paragraphEn) {
                return (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? 'first-letter:text-5xl first-letter:font-editorial-heading first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-950 leading-relaxed'
                        : 'leading-relaxed'
                    }
                  >
                    {paragraphEn}
                  </p>
                );
              }

              // Swahili Only Mode
              if (bilingualMode === 'swahili') {
                return (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? 'first-letter:text-5xl first-letter:font-editorial-heading first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-950 leading-relaxed'
                        : 'leading-relaxed'
                    }
                  >
                    {paragraph}
                  </p>
                );
              }

              // Both: Swahili on top, English down below!
              return (
                <div key={index} className="space-y-2">
                  <p
                    className={
                      index === 0
                        ? 'first-letter:text-5xl first-letter:font-editorial-heading first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-950 leading-relaxed text-stone-900'
                        : 'leading-relaxed text-stone-900'
                    }
                  >
                    {paragraph}
                  </p>
                  {paragraphEn && (
                    <div className="pl-3 sm:pl-4 border-l-2 border-stone-300 bg-stone-50/70 p-3 rounded-r-xs text-stone-600 font-serif italic text-sm sm:text-base leading-relaxed">
                      <span className="font-sans not-italic text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                        English Translation &bull; Kiingereza:
                      </span>
                      {paragraphEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* In-Article Ad Banner */}
          <AdBanner slot="in_article_mid" />

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-stone-200 mt-8">
              <span className="text-xs font-sans text-stone-500 uppercase tracking-widest font-semibold mr-2">
                Topics:
              </span>
              <div className="inline-flex flex-wrap gap-2 text-xs font-sans text-stone-700">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => setView({ type: 'search', query: tag })}
                    className="hover:text-red-700 cursor-pointer underline underline-offset-4 decoration-stone-300 hover:decoration-red-700 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reader Interactive Reactions */}
          <div className="no-print mt-10 p-6 bg-stone-50 border border-stone-200 rounded-xs">
            <h4 className="font-editorial-heading font-bold text-lg text-stone-900 mb-2">
              {language === 'sw' ? 'Mtazamo Wako Juu ya Makala Hii' : 'How does this story make you feel?'}
            </h4>
            <p className="text-xs font-sans text-stone-500 mb-4">
              {language === 'sw' ? 'Bofya kutoa maoni yako bila kujulikana.' : 'Click to cast your reader reaction.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleReactionClick('insightful')}
                className={`p-3 bg-white border rounded-xs text-center transition-all cursor-pointer ${
                  activeReaction === 'insightful'
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-xs'
                    : 'border-stone-200 text-stone-800 hover:border-stone-400'
                }`}
              >
                <div className="text-xl mb-1">💡</div>
                <div className="text-xs font-bold font-sans">Insightful</div>
                <div className="text-xs font-mono tabular-nums text-stone-500 mt-0.5">
                  {article.reactions.insightful}
                </div>
              </button>

              <button
                onClick={() => handleReactionClick('inspiring')}
                className={`p-3 bg-white border rounded-xs text-center transition-all cursor-pointer ${
                  activeReaction === 'inspiring'
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-xs'
                    : 'border-stone-200 text-stone-800 hover:border-stone-400'
                }`}
              >
                <div className="text-xl mb-1">🔥</div>
                <div className="text-xs font-bold font-sans">Inspiring</div>
                <div className="text-xs font-mono tabular-nums text-stone-500 mt-0.5">
                  {article.reactions.inspiring}
                </div>
              </button>

              <button
                onClick={() => handleReactionClick('surprised')}
                className={`p-3 bg-white border rounded-xs text-center transition-all cursor-pointer ${
                  activeReaction === 'surprised'
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-xs'
                    : 'border-stone-200 text-stone-800 hover:border-stone-400'
                }`}
              >
                <div className="text-xl mb-1">⚡</div>
                <div className="text-xs font-bold font-sans">Surprised</div>
                <div className="text-xs font-mono tabular-nums text-stone-500 mt-0.5">
                  {article.reactions.surprised}
                </div>
              </button>

              <button
                onClick={() => handleReactionClick('concerned')}
                className={`p-3 bg-white border rounded-xs text-center transition-all cursor-pointer ${
                  activeReaction === 'concerned'
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-xs'
                    : 'border-stone-200 text-stone-800 hover:border-stone-400'
                }`}
              >
                <div className="text-xl mb-1">🤔</div>
                <div className="text-xs font-bold font-sans">Concerned</div>
                <div className="text-xs font-mono tabular-nums text-stone-500 mt-0.5">
                  {article.reactions.concerned}
                </div>
              </button>
            </div>
          </div>

          {/* Reader Discussion / Comments Section */}
          <CommentsSection articleId={article.id} comments={article.comments} />
        </div>

        {/* Right Margin Rail: Author profile, Fact-checking badge, Related Stories */}
        <aside className="no-print lg:col-span-4 space-y-6">
          {/* Author Card */}
          <div className="bg-stone-50 border border-stone-200 p-5 rounded-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">
                About the Journalist
              </span>
              <button
                onClick={() => setView({ type: 'author', authorId: article.author.id })}
                className="text-[11px] font-bold text-[#BB1919] hover:underline uppercase cursor-pointer"
              >
                View Profile
              </button>
            </div>
            <div
              onClick={() => setView({ type: 'author', authorId: article.author.id })}
              className="flex items-center gap-3 mb-3 cursor-pointer group"
            >
              <img
                src={article.author.avatar}
                alt={article.author.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-stone-300 group-hover:border-[#BB1919] transition-colors"
              />
              <div>
                <h4 className="font-editorial-heading font-bold text-base text-stone-950 group-hover:text-[#BB1919] group-hover:underline transition-colors">
                  {article.author.name}
                </h4>
                <p className="text-xs text-stone-500 font-sans">{article.author.title}</p>
              </div>
            </div>
            {article.author.bio && (
              <p className="text-xs text-stone-600 font-sans leading-relaxed mb-3">
                {article.author.bio}
              </p>
            )}
            <button
              onClick={() => setView({ type: 'author', authorId: article.author.id })}
              className="w-full py-2 bg-white border border-stone-300 hover:border-[#BB1919] hover:text-[#BB1919] text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Full Profile & All Stories &rarr;</span>
            </button>
          </div>

          {/* Fact-Checking & Editorial Standards Note */}
          <div className="bg-white border border-stone-200 p-4 rounded-xs text-xs font-sans text-stone-600">
            <div className="flex items-center gap-2 text-stone-900 font-bold mb-1.5 uppercase tracking-wide text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Verified Journalism Standard</span>
            </div>
            <p className="leading-relaxed mb-2">
              Habari Central enforces strict multi-source cross-verification. All statistical figures and policy quotes are directly corroborated with official gazettes and accredited agencies.
            </p>
            <button
              onClick={() => setView({ type: 'page', pageId: 'policy' })}
              className="text-red-700 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Read our verification protocol</span>
              &rarr;
            </button>
          </div>

          {/* Related Stories */}
          {relatedArticles.length > 0 && (
            <div className="bg-white border border-stone-200 p-5 rounded-xs">
              <h4 className="font-editorial-heading font-bold text-base uppercase tracking-tight text-stone-900 pb-2 mb-3 border-b border-stone-200">
                {language === 'sw' ? 'Habari Zinazohusiana' : 'Related Coverage'}
              </h4>
              <div className="space-y-3.5 divide-y divide-stone-100">
                {relatedArticles.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => setView({ type: 'article', slug: rel.slug })}
                    className="pt-3 first:pt-0 group cursor-pointer"
                  >
                    <span className="text-[10px] font-sans font-semibold text-red-700 uppercase tracking-wide block mb-1">
                      {rel.categoryName}
                    </span>
                    <h5 className="font-editorial-heading font-bold text-sm text-stone-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
                      {rel.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
    </>
  );
};
