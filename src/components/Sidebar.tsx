import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { CheckCircle2 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { publicArticles, openArticle, addSubscriber, language, refreshNewsWire, newsLoading } = useNews();
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

  const latest = publicArticles.slice(0, 8);

  return (
    <aside className="space-y-6" aria-label="Sidebar">
      <div>
        <div className="flex items-end justify-between border-b border-[#121212] pb-2 mb-1">
          <h2 className="font-bbc-headline text-[1.25rem] font-bold text-[#121212]">
            {language === 'sw' ? 'Mpya zaidi' : 'Latest'}
          </h2>
          <button
            type="button"
            onClick={() => void refreshNewsWire()}
            disabled={newsLoading}
            className="text-[0.7rem] font-bold uppercase tracking-wide text-[#BB1919] hover:underline cursor-pointer disabled:opacity-50"
          >
            {newsLoading ? '…' : 'Refresh'}
          </button>
        </div>
        {latest.length === 0 ? (
          <p className="text-sm text-[#6E6E6E] py-3">No headlines yet.</p>
        ) : (
          <ul className="divide-y divide-[#E6E6E6]">
            {latest.map(art => (
              <li key={art.id}>
                <button
                  type="button"
                  onClick={() => openArticle(art)}
                  className="w-full text-left py-3 group cursor-pointer"
                >
                  <span className="text-[#BB1919] text-[0.65rem] font-bold uppercase tracking-wide">
                    {art.categoryName}
                  </span>
                  <span className="mt-1 block font-bbc-headline text-[0.95rem] font-bold text-[#121212] leading-snug group-hover:underline">
                    {art.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-[#F6F6F6] p-4 sm:p-5">
        <h3 className="font-bbc-headline text-[1.05rem] font-bold text-[#121212]">
          {language === 'sw' ? 'Jarida la THE SOURCE' : 'THE SOURCE newsletter'}
        </h3>
        <p className="mt-1.5 text-[0.8rem] text-[#3A3A3A] leading-relaxed">
          Weekday headlines from Tanzania and East Africa.
        </p>
        {subscribed ? (
          <div className="mt-3 flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            Subscribed
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-3 space-y-2">
            <input
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-3 py-2 bg-white text-[#121212] text-sm border border-[#C8C8C8] focus:outline-none focus:border-[#121212]"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[#BB1919] hover:bg-[#A01616] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Sign up
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};
