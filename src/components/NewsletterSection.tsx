import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { Mail, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface NewsletterSectionProps {
  isModal?: boolean;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ isModal = false }) => {
  const {
    isNewsletterOpen,
    setIsNewsletterOpen,
    categories,
    addSubscriber,
    language,
  } = useNews();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>(['tanzania-news', 'business-and-economy']);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'breaking_only'>('daily');
  const [submitted, setSubmitted] = useState(false);

  if (isModal && !isNewsletterOpen) return null;

  const handleToggleCat = (slug: string) => {
    setSelectedCats(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const ok = addSubscriber(email, selectedCats, frequency);
    if (ok) {
      setSubmitted(true);
      setTimeout(() => {
        if (isModal) {
          setIsNewsletterOpen(false);
          setSubmitted(false);
        }
      }, 3500);
    }
  };

  const content = (
    <div className="bg-stone-900 text-white p-6 sm:p-10 rounded-xs border border-stone-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/80 text-red-400 border border-red-800/60 text-xs font-sans font-bold uppercase tracking-widest rounded-2xs mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>The Sun Morning Dispatch</span>
          </div>
          <h2 className="font-editorial-heading font-black text-2xl sm:text-3xl lg:text-4xl leading-tight mb-2">
            {language === 'sw' ? 'Habari Muhimu Zikufikie Popote Ulipo' : 'Stay Ahead with Digital Daily East African Journalism'}
          </h2>
          <p className="font-sans text-stone-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {language === 'sw'
              ? 'Jiunge na zaidi ya wasomaji 45,000 wanaopokea uchambuzi wa siasa, biashara, miundombinu, na michezo kila asubuhi.'
              : 'Join over 45,000 executives, policymakers, and civic leaders receiving our curated dawn briefings.'}
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-stone-800/80 border border-emerald-500/40 rounded-xs text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-editorial-heading font-bold text-xl text-white mb-1">
              {language === 'sw' ? 'Hongera! Umejiunga Kikamilifu' : 'You are Subscribed!'}
            </h3>
            <p className="text-xs text-stone-300 font-sans max-w-md mx-auto">
              {language === 'sw'
                ? 'Utapokea nakala yetu ya kwanza ya jarida asubuhi saa 12:30. Unaweza kujitoa wakati wowote.'
                : 'A confirmation has been sent to your inbox. You can adjust frequency or unsubscribe anytime with one click.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name (Jina Kamili)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="px-4 py-2.5 bg-stone-800 text-white text-xs border border-stone-700 focus:outline-hidden focus:border-red-500 rounded-xs placeholder:text-stone-500 font-sans"
              />
              <input
                type="email"
                placeholder="Business or Personal Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="px-4 py-2.5 bg-stone-800 text-white text-xs border border-stone-700 focus:outline-hidden focus:border-red-500 rounded-xs placeholder:text-stone-500 font-sans"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-stone-400 mb-2">
                Select Your Coverage Preferences:
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map(c => {
                  const isChecked = selectedCats.includes(c.slug);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => handleToggleCat(c.slug)}
                      className={`px-3 py-1.5 text-xs font-sans rounded-2xs transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-red-700 text-white font-bold'
                          : 'bg-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frequency selection */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 text-xs text-stone-400 font-sans">
                <span className="text-[11px] uppercase font-bold text-stone-500">Frequency:</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="freq"
                    checked={frequency === 'daily'}
                    onChange={() => setFrequency('daily')}
                    className="accent-red-600"
                  />
                  <span>Daily Morning (6:30 AM)</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="freq"
                    checked={frequency === 'weekly'}
                    onChange={() => setFrequency('weekly')}
                    className="accent-red-600"
                  />
                  <span>Weekend Round-up</span>
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-widest rounded-xs transition-colors cursor-pointer shadow-xs"
              >
                {language === 'sw' ? 'Jiunge Bila Malipo' : 'Subscribe Free'}
              </button>
            </div>

            <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero spam policy. We never share or sell subscriber emails.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-2xl relative">
          <button
            onClick={() => setIsNewsletterOpen(false)}
            className="absolute top-4 right-4 z-20 text-stone-400 hover:text-white cursor-pointer"
            aria-label="Close newsletter modal"
          >
            ✕
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6" aria-label="Newsletter Subscription">
      {content}
    </section>
  );
};
