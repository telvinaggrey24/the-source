import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { AdBanner } from './AdBanner';
import { CloudSun, ArrowRight, TrendingUp, Mail, CheckCircle2, Radio, CheckCircle } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { articles, setView, addSubscriber, language } = useNews();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    const ok = addSubscriber(emailInput, ['business', 'politics']);
    if (ok) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const trendingArticles = [...articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, 4);

  return (
    <aside className="space-y-6 font-sans" aria-label="Sidebar information">
      {/* 1. BBC WEATHER & MARKETS BOX */}
      <div className="bg-white border border-stone-200 p-5 rounded-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-stone-900">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-5 bg-[#BB1919]" />
            <span className="font-bold text-sm uppercase text-stone-900 tracking-wider">
              {language === 'sw' ? 'Hali ya Hewa & Masoko' : 'Weather & Markets'}
            </span>
          </div>
          <button
            onClick={() => setView({ type: 'page', pageId: 'weather' })}
            className="text-[11px] font-bold text-[#BB1919] hover:underline uppercase"
          >
            Full Forecast &rarr;
          </button>
        </div>

        {/* Currency Rates */}
        <div className="grid grid-cols-2 gap-2 text-xs pb-3 border-b border-stone-100">
          <div className="bg-stone-50 p-2 border border-stone-200 rounded-2xs">
            <div className="text-[10px] text-stone-500 font-bold uppercase">USD / TZS</div>
            <div className="font-mono font-bold text-stone-900 tabular-nums">2,642.50</div>
            <div className="text-[10px] text-emerald-600">+0.15%</div>
          </div>
          <div className="bg-stone-50 p-2 border border-stone-200 rounded-2xs">
            <div className="text-[10px] text-stone-500 font-bold uppercase">KES / TZS</div>
            <div className="font-mono font-bold text-stone-900 tabular-nums">20.48</div>
            <div className="text-[10px] text-emerald-600">+0.08%</div>
          </div>
        </div>

        {/* Weather preview */}
        <div
          onClick={() => setView({ type: 'page', pageId: 'weather' })}
          className="pt-3 flex items-center justify-between text-xs text-stone-700 cursor-pointer hover:bg-stone-50 p-1.5 -mx-1.5 rounded-2xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-amber-500" />
            <div>
              <span className="font-bold text-stone-900 block">Dar es Salaam</span>
              <span className="text-[11px] text-stone-500">29°C · Coastal Humid</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#BB1919] uppercase">
            9 Cities Forecast &rarr;
          </span>
        </div>
      </div>

      {/* 2. BBC VERIFY SPOTLIGHT CARD */}
      <div
        onClick={() => setView({ type: 'page', pageId: 'verify' })}
        className="bg-[#121212] text-white p-5 rounded-xs cursor-pointer group hover:border-[#BB1919] border border-stone-800 transition-colors"
      >
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold uppercase mb-2">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Habari Central Verify</span>
        </div>
        <h4 className="font-bold text-base text-white group-hover:text-red-400 transition-colors leading-snug mb-1">
          Forensic Fact-Checks: Debunking Viral Claims & Audio Deepfakes
        </h4>
        <p className="text-xs text-stone-400 mb-3">
          See how our journalists verified official railway tariffs and fake recruitment notices.
        </p>
        <span className="text-xs font-bold text-white uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          <span>Explore Verify Hub</span>
          &rarr;
        </span>
      </div>

      {/* 3. Sponsored Ad Rectangle */}
      <AdBanner slot="sidebar_rectangle" />

      {/* 4. Trending Stories (BBC Most Read style) */}
      <div className="bg-white border border-stone-200 p-5 rounded-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-stone-900">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-5 bg-[#BB1919]" />
            <h3 className="font-bold text-sm uppercase text-stone-900 tracking-wider">
              {language === 'sw' ? 'Habari Zinazosomwa' : 'Trending Headlines'}
            </h3>
          </div>
          <TrendingUp className="w-4 h-4 text-[#BB1919]" />
        </div>

        <div className="space-y-3 divide-y divide-stone-100">
          {trendingArticles.map(art => (
            <div
              key={art.id}
              onClick={() => setView({ type: 'article', slug: art.slug })}
              className="pt-3 first:pt-0 group cursor-pointer"
            >
              <span className="text-[10px] font-bold text-[#BB1919] uppercase tracking-wide block mb-0.5">
                {art.categoryName}
              </span>
              <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#BB1919] group-hover:underline transition-colors line-clamp-2 leading-snug">
                {art.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* 5. BBC Daily Morning Dispatch */}
      <div className="bg-stone-100 border border-stone-200 p-5 rounded-xs">
        <div className="flex items-center gap-2 text-[#BB1919] mb-1.5">
          <Mail className="w-4 h-4" />
          <span className="text-[11px] uppercase tracking-widest font-bold">
            {language === 'sw' ? 'Jarida la Habari' : 'Daily Morning Briefing'}
          </span>
        </div>
        <h4 className="font-bold text-base text-stone-900 mb-1 leading-snug">
          The Tanzania & East Africa Dispatch
        </h4>
        <p className="text-xs text-stone-600 mb-3 leading-relaxed">
          Delivered weekdays at 6:30 AM with verified political and financial intel.
        </p>

        {subscribed ? (
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold py-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Subscribed successfully!</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full px-3 py-2 bg-white text-stone-900 text-xs border border-stone-300 focus:outline-hidden focus:border-[#BB1919] rounded-2xs"
            />
            <button
              type="submit"
              className="w-full py-2 bg-[#BB1919] hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded-2xs transition-colors cursor-pointer"
            >
              Subscribe Free
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};
