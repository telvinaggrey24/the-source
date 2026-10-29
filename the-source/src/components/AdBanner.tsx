import React from 'react';
import { useNews } from '../context/NewsContext';
import { ExternalLink, Info } from 'lucide-react';

interface AdBannerProps {
  slot: 'header_leaderboard' | 'sidebar_rectangle' | 'in_article_mid' | 'footer_strip';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className = '' }) => {
  const { ads, updateAd } = useNews();
  const ad = ads.find(a => a.slot === slot && a.isActive);

  if (!ad) return null;

  const handleAdClick = () => {
    updateAd(ad.id, { clicks: ad.clicks + 1 });
  };

  if (slot === 'header_leaderboard') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-3 px-4 no-print advertisement-slot ${className}`}>
        <div className="bg-stone-100 border border-stone-200 p-2 sm:p-3 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-left">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 bg-stone-200 px-1 py-0.5 rounded-2xs">
              Advertisement
            </span>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1">{ad.title}</p>
              <p className="text-[11px] text-stone-500">Sponsored by {ad.sponsorName}</p>
            </div>
          </div>
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="shrink-0 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xs inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  if (slot === 'sidebar_rectangle') {
    return (
      <div className={`w-full bg-stone-50 border border-stone-200 p-4 text-center no-print advertisement-slot ${className}`}>
        <div className="flex items-center justify-between text-[10px] font-sans font-semibold text-stone-400 uppercase tracking-wider mb-2">
          <span>Sponsored Notice</span>
          <span>Google AdSense Ready</span>
        </div>
        <div className="py-6 px-2 bg-white border border-stone-200 mb-3">
          <p className="font-editorial-heading font-bold text-base text-stone-900 mb-1">{ad.title}</p>
          <p className="text-xs text-stone-500">{ad.sponsorName}</p>
        </div>
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAdClick}
          className="w-full py-2 bg-stone-900 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors block text-center rounded-xs"
        >
          Visit Partner
        </a>
      </div>
    );
  }

  if (slot === 'in_article_mid') {
    return (
      <div className={`my-8 p-4 bg-stone-50 border-y border-stone-200 text-center no-print advertisement-slot ${className}`}>
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-1">
          <Info className="w-3 h-3" />
          <span>Advertisement · Google AdSense Network</span>
        </div>
        <div className="max-w-xl mx-auto py-2">
          <p className="font-editorial-heading font-bold text-base sm:text-lg text-stone-900 mb-1">{ad.title}</p>
          <p className="text-xs text-stone-600 mb-3">Exclusive partner update from {ad.sponsorName}</p>
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="inline-flex items-center gap-1 px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-xs transition-colors"
          >
            <span>Explore Details</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-stone-900 text-stone-300 py-3 px-4 border-t border-stone-800 text-center text-xs no-print advertisement-slot ${className}`}>
      <span className="text-stone-500 uppercase tracking-wider mr-2 font-mono text-[10px]">Sponsor:</span>
      <span className="font-medium text-white">{ad.title}</span>
      <span className="mx-2 text-stone-600">·</span>
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAdClick}
        className="underline hover:text-white transition-colors text-red-400"
      >
        {ad.sponsorName}
      </a>
    </div>
  );
};
