import React from 'react';
import { useNews } from '../context/NewsContext';
import { AdBanner } from './AdBanner';
import { Mail, Phone, MapPin, Shield, CheckCircle, Radio, Video, CloudSun, User, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { activeCategories, setView, language, setIsAuthModalOpen, appearanceSettings } = useNews();
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-8 border-b border-stone-800">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Sections</h4>
            <ul className="space-y-1.5 text-stone-400">
              {activeCategories.length === 0 ? (
                <li className="text-stone-600">No public sections</li>
              ) : (
                activeCategories.map(cat => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => setView({ type: 'category', categorySlug: cat.slug })}
                      className="hover:text-white cursor-pointer"
                    >
                      {language === 'sw' && cat.nameSwahili ? cat.nameSwahili : cat.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Newsroom</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button type="button" onClick={() => setView({ type: 'home' })} className="hover:text-white cursor-pointer">
                  Top stories
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setView({ type: 'authors-directory' })} className="hover:text-white cursor-pointer">
                  Authors
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setView({ type: 'page', pageId: 'policy' })} className="hover:text-white cursor-pointer">
                  Editorial guidelines
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Staff</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button type="button" onClick={() => setView({ type: 'admin' })} className="hover:text-white text-stone-300 font-semibold cursor-pointer flex items-center gap-1">
                  <Shield className="w-3 h-3 text-red-500" />
                  <span>Admin</span>
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

          <div className="flex flex-wrap items-center gap-3 text-stone-300">
            <a
              href="tel:+255622754599"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-2xs text-stone-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#BB1919]" />
              <span>Desk: +255 622 754 599</span>
            </a>

            <a
              href="https://wa.me/255622754599"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/50 rounded-2xs text-emerald-300 transition-colors"
              title="Chat with Newsroom Desk on WhatsApp (+255 622 754 599)"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: 622754599</span>
            </a>

            <a
              href="mailto:telvinaggrey24@gmail.com"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-2xs text-stone-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>telvinaggrey24@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Legal & Trust Disclosures */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} {siteName} Media Group. Daily Update.
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
