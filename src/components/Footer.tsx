import React from 'react';
import { useNews } from '../context/NewsContext';
import { AdBanner } from './AdBanner';
import { Mail, Phone, MapPin, Shield, CheckCircle, Radio, Video, CloudSun, Heart, User } from 'lucide-react';

export const Footer: React.FC = () => {
  const { categories, activeCategories, setView, language, setIsDonateModalOpen, setIsAuthModalOpen, appearanceSettings } = useNews();
  const siteName = appearanceSettings?.siteName || 'THE SUN';

  return (
    <footer className="w-full bg-[#121212] text-stone-300 border-t-4 border-[#BB1919] font-sans text-xs" aria-label="Site footer">
      {/* Footer Ad Banner Strip */}
      <AdBanner slot="footer_strip" />

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Top brand row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-stone-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded shadow-sm">
              <img
                src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                alt="THE SOURCE"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:block border-l border-stone-700 pl-3">
              <span className="text-xs text-stone-300 font-bold uppercase tracking-wider block">
                {siteName}
              </span>
              <span className="text-[11px] text-stone-400">
                {appearanceSettings?.siteTagline || 'REAL NEWS • REAL PEOPLE • REAL IMPACT'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-400">
            <button
              onClick={() => setView({ type: 'authors-directory' })}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-red-400 font-bold"
            >
              <User className="w-3.5 h-3.5" />
              <span>Our Journalists</span>
            </button>
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="px-3 py-1 bg-[#BB1919] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donate (Support Us)</span>
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>Reader Account</span>
            </button>
            <button
              onClick={() => setView({ type: 'page', pageId: 'verify' })}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fact Check</span>
            </button>
            <button
              onClick={() => setView({ type: 'admin' })}
              className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-2xs transition-colors cursor-pointer flex items-center gap-1 font-bold"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Directory Columns with the 10 Categories & Services */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-8 border-b border-stone-800">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">News & Affairs</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => setView({ type: 'category', categorySlug: 'politics' })} className="hover:text-white cursor-pointer">
                  Politics
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'category', categorySlug: 'international' })} className="hover:text-white cursor-pointer">
                  International News
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'page', pageId: 'verify' })} className="hover:text-white cursor-pointer">
                  Forensic Verification
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'home' })} className="hover:text-white cursor-pointer">
                  Top Stories
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Business & Tech</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => setView({ type: 'category', categorySlug: 'business' })} className="hover:text-white cursor-pointer">
                  Business & Markets
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'category', categorySlug: 'technology' })} className="hover:text-white cursor-pointer">
                  Technology & Startups
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'category', categorySlug: 'jobs' })} className="hover:text-white cursor-pointer text-emerald-400 font-semibold">
                  Jobs & Vacancies
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Sports</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => setView({ type: 'category', categorySlug: 'football' })} className="hover:text-white cursor-pointer">
                  Football Coverage
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'category', categorySlug: 'sports' })} className="hover:text-white cursor-pointer">
                  Sports & Athletics
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Culture & Life</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => setView({ type: 'category', categorySlug: 'entertainment' })} className="hover:text-white cursor-pointer">
                  Entertainment
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'category', categorySlug: 'music' })} className="hover:text-white cursor-pointer">
                  Music
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Trust & Access</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => setIsDonateModalOpen(true)} className="text-red-400 hover:text-red-300 font-bold cursor-pointer flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-current" />
                  <span>Support The Sun</span>
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'authors-directory' })} className="hover:text-white cursor-pointer">
                  Journalists & Editors
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'page', pageId: 'policy' })} className="hover:text-white cursor-pointer">
                  Editorial Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => setView({ type: 'admin' })} className="hover:text-white text-stone-300 font-semibold cursor-pointer flex items-center gap-1">
                  <Shield className="w-3 h-3 text-red-500" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsroom Telephone & Hotlines Strip */}
        <div className="py-4 my-6 border-y border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider text-stone-300 font-bold">Newsroom Desk:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-300">
            <a
              href={`tel:${appearanceSettings?.contactPhone || '+255222114500'}`}
              className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-2xs text-stone-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#BB1919]" />
              <span>Desk: {appearanceSettings?.contactPhone || '+255 22 211 4500'}</span>
            </a>
            <a
              href={`mailto:${appearanceSettings?.contactEmail || 'newsroom@thesun.co.tz'}`}
              className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-2xs text-stone-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>{appearanceSettings?.contactEmail || 'newsroom@thesun.co.tz'}</span>
            </a>
          </div>
        </div>

        {/* Legal & Trust Disclosures */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} {siteName} Media Group. Digital Daily Only.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setView({ type: 'page', pageId: 'terms' })} className="hover:text-stone-300">
              Terms of Use
            </button>
            <span aria-hidden="true">&bull;</span>
            <button onClick={() => setView({ type: 'page', pageId: 'privacy' })} className="hover:text-stone-300">
              Privacy Policy
            </button>
            <span aria-hidden="true">&bull;</span>
            <button onClick={() => setView({ type: 'page', pageId: 'policy' })} className="hover:text-stone-300">
              Editorial Guidelines
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
