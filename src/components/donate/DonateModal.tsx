import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { PhoneInput } from '../common/PhoneInput';
import {
  X,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  Download,
} from 'lucide-react';

export const DonateModal: React.FC = () => {
  const { isDonateModalOpen, setIsDonateModalOpen, recordDonation, currentUser, language } = useNews();

  const [frequency, setFrequency] = useState<'one_off' | 'monthly'>('one_off');
  const [currency, setCurrency] = useState<'TZS' | 'USD'>('TZS');
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [provider, setProvider] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'crdb' | 'card'>('mpesa');

  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '');
  const [donorMessage, setDonorMessage] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [ussdPromptActive, setUssdPromptActive] = useState(false);
  const [completedDonation, setCompletedDonation] = useState<any | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDonateModalOpen) {
        setIsDonateModalOpen(false);
      }
    };
    if (isDonateModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isDonateModalOpen]);

  if (!isDonateModalOpen) return null;

  const tzsPresets = [5000, 10000, 25000, 50000, 100000];
  const usdPresets = [5, 10, 25, 50, 100];
  const activePresets = currency === 'TZS' ? tzsPresets : usdPresets;
  const currentTotal = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTotal || currentTotal <= 0) return;

    setIsProcessing(true);

    if (['mpesa', 'tigopesa', 'airtel', 'halopesa'].includes(provider)) {
      setUssdPromptActive(true);
      setTimeout(() => {
        const record = recordDonation({
          donorName: donorName.trim() || 'Civic Supporter',
          phoneOrEmail: donorPhone || '+255 754 ••• 000',
          amount: currentTotal,
          currency,
          frequency,
          provider: provider as any,
          message: donorMessage,
        });
        setIsProcessing(false);
        setUssdPromptActive(false);
        setCompletedDonation(record);
      }, 3000);
    } else {
      setTimeout(() => {
        const record = recordDonation({
          donorName: donorName.trim() || 'Civic Supporter',
          phoneOrEmail: donorPhone || 'bank@thesun.co.tz',
          amount: currentTotal,
          currency,
          frequency,
          provider: provider as any,
          message: donorMessage,
        });
        setIsProcessing(false);
        setCompletedDonation(record);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-xs shadow-2xl overflow-hidden border border-stone-200 animate-scale-in">
        {/* Modal Header */}
        <div className="bg-[#121212] text-white p-5 flex items-center justify-between border-b-2 border-[#BB1919]">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded shadow-xs">
              <img
                src="/assets/logo.png"
                alt="The Source"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div>
              <h3 className="font-sans font-black text-sm sm:text-base uppercase tracking-tight text-white leading-none">
                {language === 'sw' ? 'Changia The Source' : 'Support The Source'}
              </h3>
              <span className="text-[10px] text-stone-400 font-sans tracking-wide">
                Public Interest Journalism &bull; Digital Daily Only &bull; Real Impact
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsDonateModalOpen(false)}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {completedDonation ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-stone-900">Ahsante Sana kwa Mchango Wako!</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Mchango wako wa{' '}
                <strong className="text-stone-900">
                  {completedDonation.amount.toLocaleString()} {completedDonation.currency}
                </strong>{' '}
                umethibitishwa. Risiti na cheti vimehifadhiwa kwenye akaunti yako.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setIsDonateModalOpen(false)}
                  className="px-5 py-2 bg-[#BB1919] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                >
                  Funga
                </button>
              </div>
            </div>
          ) : ussdPromptActive ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-[#BB1919] rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Smartphone className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-stone-900">Angalia Skrini ya Simu Yako</h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Ombi la malipo limetumwa kwenda <strong>{donorPhone}</strong>. Weka PIN ya {provider.toUpperCase()} kuthibitisha.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs font-sans">
              {/* Frequency and Currency */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center p-0.5 bg-stone-100 rounded-xs border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setFrequency('one_off')}
                    className={`px-3 py-1 font-bold uppercase rounded-2xs ${
                      frequency === 'one_off' ? 'bg-[#BB1919] text-white shadow-xs' : 'text-stone-600'
                    }`}
                  >
                    Mara Moja
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`px-3 py-1 font-bold uppercase rounded-2xs ${
                      frequency === 'monthly' ? 'bg-[#BB1919] text-white shadow-xs' : 'text-stone-600'
                    }`}
                  >
                    Kila Mwezi
                  </button>
                </div>

                <div className="flex items-center gap-1 font-mono font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency('TZS');
                      setSelectedAmount(10000);
                      setCustomAmount('');
                    }}
                    className={`px-2 py-0.5 rounded-2xs ${
                      currency === 'TZS' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    TZS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency('USD');
                      setSelectedAmount(10);
                      setCustomAmount('');
                    }}
                    className={`px-2 py-0.5 rounded-2xs ${
                      currency === 'USD' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>

              {/* Amount Pills */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Chagua Kiasi cha Mchango:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {activePresets.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 text-xs font-bold font-mono rounded-xs border transition-all cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-[#BB1919] text-white border-[#BB1919]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {currency === 'TZS' ? `${amt.toLocaleString()}` : `$${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Providers */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Njia ya Malipo:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mpesa', name: 'M-Pesa', badge: 'VODA' },
                    { id: 'tigopesa', name: 'Tigo Pesa', badge: 'TIGO' },
                    { id: 'airtel', name: 'Airtel Money', badge: 'AIRTEL' },
                    { id: 'halopesa', name: 'Halopesa', badge: 'HALO' },
                    { id: 'crdb', name: 'CRDB/NMB', badge: 'BANK' },
                    { id: 'card', name: 'Visa/Mastercard', badge: 'CARD' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProvider(p.id as any)}
                      className={`p-2 text-left rounded-xs border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        provider === p.id
                          ? 'bg-red-50 text-[#BB1919] border-[#BB1919]'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      <span>{p.name}</span>
                      <span className="text-[10px] font-mono text-stone-400">{p.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Input with Carrier Detection */}
              <div>
                <PhoneInput
                  value={donorPhone}
                  onChange={full => setDonorPhone(full)}
                  label="Namba ya Malipo (M-Pesa / SimBanking)"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Jina Lako (Your Name)
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  placeholder="Juma Mwamburi..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing || !currentTotal}
                className="w-full py-3 bg-[#BB1919] hover:bg-red-800 disabled:opacity-50 text-white font-bold uppercase tracking-widest rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Thibitisha na Changia {currentTotal.toLocaleString()} {currency}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
