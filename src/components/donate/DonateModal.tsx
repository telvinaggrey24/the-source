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
  Mail,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const DonateModal: React.FC = () => {
  const { isDonateModalOpen, setIsDonateModalOpen, recordDonation, currentUser, language } = useNews();

  const [frequency, setFrequency] = useState<'one_off' | 'monthly'>('one_off');
  const [currency, setCurrency] = useState<'TZS' | 'USD'>('TZS');
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [provider, setProvider] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'crdb' | 'card' | 'selcom'>('mpesa');

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

  const tzsPresets = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  const usdPresets = [5, 10, 25, 50, 100, 250, 500];
  const activePresets = currency === 'TZS' ? tzsPresets : usdPresets;
  const currentTotal = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTotal || currentTotal < 1 || (currency === 'TZS' && currentTotal > 1000000)) {
      alert('Tafadhali chagua au weka kiwango kati ya 1 na 1,000,000 TZS');
      return;
    }

    setIsProcessing(true);

    if (['mpesa', 'tigopesa', 'airtel', 'halopesa', 'selcom'].includes(provider)) {
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
                src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                alt="The Source"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div>
              <h3 className="font-sans font-black text-sm sm:text-base uppercase tracking-tight text-white leading-none">
                {language === 'sw' ? 'Changia The Source' : 'Support The Source'}
              </h3>
              <span className="text-[10px] text-stone-400 font-sans tracking-wide">
                Public Interest Journalism &bull; Daily Update &bull; Real Impact
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

        <div className="p-5 sm:p-6 space-y-4">
          {/* Quick Contact Strip */}
          <div className="bg-stone-50 border border-stone-200 rounded-xs p-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans">
            <div className="flex items-center gap-1.5 text-stone-700">
              <Phone className="w-3.5 h-3.5 text-[#BB1919]" />
              <span className="text-stone-500">Desk:</span>
              <a href="tel:+255622754599" className="font-bold text-stone-900 hover:text-[#BB1919] font-mono">
                +255 622 754 599
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-stone-500">WhatsApp:</span>
              <a href="https://wa.me/255622754599" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 hover:underline font-mono">
                622754599
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Mail className="w-3.5 h-3.5 text-stone-500" />
              <a href="mailto:telvinaggrey24@gmail.com" className="font-bold text-stone-900 hover:text-[#BB1919]">
                telvinaggrey24@gmail.com
              </a>
            </div>
          </div>

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
                Ombi la malipo limetumwa kwenda <strong>{donorPhone}</strong>. Weka PIN ya {provider.toUpperCase()} kuthibitisha malipo ya{' '}
                <strong>{currentTotal.toLocaleString()} {currency}</strong>.
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
                  Chagua Kiasi cha Mchango (1 - 1,000,000 TZS):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {activePresets.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-1.5 text-[11px] font-bold font-mono rounded-xs border transition-all cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-[#BB1919] text-white border-[#BB1919] shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {currency === 'TZS' ? `${amt >= 1000000 ? '1M' : amt >= 1000 ? `${amt / 1000}k` : amt}` : `$${amt}`}
                    </button>
                  ))}
                </div>

                {/* Custom Amount with 1 - 1,000,000 Range */}
                <div className="mt-2.5">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono font-bold text-xs">
                      {currency === 'TZS' ? 'TZS' : '$'}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max={currency === 'TZS' ? 1000000 : 1000}
                      value={customAmount}
                      onChange={e => {
                        const val = e.target.value;
                        setCustomAmount(val);
                        if (val) setSelectedAmount(Number(val));
                      }}
                      placeholder={`Weka kiasi maalum (1 - ${currency === 'TZS' ? '1,000,000' : '1,000'})...`}
                      className="w-full pl-12 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xs font-mono font-bold focus:outline-hidden focus:border-[#BB1919]"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 font-sans mt-0.5 block">
                    Kiwango kinaruhusiwa kuanzia 1 hadi 1,000,000 TZS
                  </span>
                </div>
              </div>

              {/* Providers with Selcom */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Njia ya Malipo (Payment Method):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'selcom', name: 'Selcom Pay', badge: 'SELCOM' },
                    { id: 'mpesa', name: 'M-Pesa', badge: 'VODA' },
                    { id: 'tigopesa', name: 'Tigo Pesa', badge: 'TIGO' },
                    { id: 'airtel', name: 'Airtel Money', badge: 'AIRTEL' },
                    { id: 'halopesa', name: 'Halopesa', badge: 'HALO' },
                    { id: 'crdb', name: 'CRDB / NMB', badge: 'BANK' },
                    { id: 'card', name: 'Visa / Mastercard', badge: 'CARD' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProvider(p.id as any)}
                      className={`p-2 text-left rounded-xs border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        provider === p.id
                          ? 'bg-red-50 text-[#BB1919] border-[#BB1919] shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded-2xs bg-stone-200/80 text-stone-700">{p.badge}</span>
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
