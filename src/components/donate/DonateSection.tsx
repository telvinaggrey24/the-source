import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { PhoneInput } from '../common/PhoneInput';
import {
  Heart,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
  Download,
  Share2,
} from 'lucide-react';

export const DonateSection: React.FC = () => {
  const { language, recordDonation, currentUser, setIsAuthModalOpen } = useNews();

  // Donation form state
  const [frequency, setFrequency] = useState<'one_off' | 'monthly'>('one_off');
  const [currency, setCurrency] = useState<'TZS' | 'USD'>('TZS');
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [provider, setProvider] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'crdb' | 'card'>('mpesa');

  // Donor Details
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '');
  const [donorMessage, setDonorMessage] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [ussdPromptActive, setUssdPromptActive] = useState(false);
  const [completedDonation, setCompletedDonation] = useState<any | null>(null);

  const tzsPresets = [5000, 10000, 25000, 50000, 100000];
  const usdPresets = [5, 10, 25, 50, 100];
  const activePresets = currency === 'TZS' ? tzsPresets : usdPresets;

  const currentTotal = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTotal || currentTotal <= 0) return;

    setIsProcessing(true);

    if (['mpesa', 'tigopesa', 'airtel', 'halopesa'].includes(provider)) {
      // Simulate mobile money USSD push
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
      // Card / Bank simulation
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
    <section
      id="donate-section"
      className="w-full bg-[#1A0505] text-white border-t-4 border-[#BB1919] font-sans py-12 lg:py-16 relative overflow-hidden"
      aria-label="Support Digital Daily Journalism"
    >
      {/* Subtle background graphic */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#BB1919]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Editorial Appeal & Mission (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-800/80 text-red-300 rounded-2xs text-xs font-bold uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5 text-[#BB1919] fill-[#BB1919]" />
              <span>{language === 'sw' ? 'Changia Uandishi Huru' : 'Support The Sun Journalism'}</span>
            </div>

            <h2 className="font-editorial-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
              {language === 'sw'
                ? 'Habari za Ukweli Hazipaswi Kuwa na Mipaka ya Kibiashara.'
                : 'Free, Uncompromised Public Journalism for Tanzania.'}
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
              {language === 'sw'
                ? 'The Sun haimilikiwi na mwanasiasa yeyote wala shirika lenye maslahi binafsi. Kila siku tunawafikia mamilioni ya Watanzania kwa habari za uhakika, uchunguzi wa miradi mikubwa, ukaguzi wa ripoti za serikali, na kufichua taarifa feki za mitandaoni.'
                : 'The Sun operates with zero corporate paywalls and no billionaire patrons. Your contribution funds investigative reporting from Dar es Salaam to Dodoma, public health tracking, and forensic fact-checking.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xs">
                <strong className="block text-white font-bold mb-0.5">100% Huru & Wazi</strong>
                <span className="text-stone-400">Hakuna habari iliyofungiwa nyuma ya malipo kwa msomaji wa kawaida.</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xs">
                <strong className="block text-white font-bold mb-0.5">Uchunguzi wa Kina</strong>
                <span className="text-stone-400">Gharama zote zinaelekezwa moja kwa moja kwa waandishi wetu wa mikoani.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Malipo yote yanalindwa kwa usimbaji wa kibenki wa SSL (256-Bit Encryption).</span>
            </div>
          </div>

          {/* Right Column: Interactive Donation Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#121212] border-2 border-stone-800 rounded-xs p-6 sm:p-8 shadow-2xl">
              {completedDonation ? (
                /* Thank You & Receipt Card */
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400">
                      Ahsante Sana kwa Mchango Wako!
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-editorial-heading font-black text-white mt-1">
                      Umeunga Mkono Uandishi Huru
                    </h3>
                    <p className="text-xs text-stone-300 max-w-md mx-auto mt-2 leading-relaxed">
                      Mchango wako wa{' '}
                      <strong className="text-white font-mono">
                        {completedDonation.amount.toLocaleString()} {completedDonation.currency}
                      </strong>{' '}
                      umepokelewa na kuingizwa kwenye mfuko wa waandishi wa habari za uchunguzi wa The Sun.
                    </p>
                  </div>

                  {/* Transaction Voucher Box */}
                  <div className="p-4 bg-stone-900 border border-stone-800 rounded-xs text-left text-xs font-mono space-y-1.5 text-stone-300 max-w-md mx-auto">
                    <div className="flex justify-between border-b border-stone-800 pb-1">
                      <span className="text-stone-500">Stakabadhi No:</span>
                      <span className="text-white font-bold">{completedDonation.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-800 pb-1">
                      <span className="text-stone-500">Mchangiaji:</span>
                      <span className="text-white">{completedDonation.donorName}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-800 pb-1">
                      <span className="text-stone-500">Njia ya Malipo:</span>
                      <span className="text-red-400 uppercase font-bold">{completedDonation.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Tarehe na Saa:</span>
                      <span>{new Date(completedDonation.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setCompletedDonation(null)}
                      className="px-6 py-2.5 bg-[#BB1919] hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                    >
                      Toa Mchango Mwingine
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Pakua Stakabadhi</span>
                    </button>
                  </div>
                </div>
              ) : ussdPromptActive ? (
                /* USSD Prompt Live Simulation */
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-red-950 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-800 animate-pulse">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Ombi la Malipo Limerushwa kwenye Simu Yako</h4>
                  <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
                    Tafadhali angalia skrini ya simu yako{' '}
                    <strong className="text-red-400 font-mono">{donorPhone || 'yako'}</strong> na uweke namba yako ya siri (PIN) ya {provider.toUpperCase()} kukamilisha mchango wa {currentTotal.toLocaleString()} {currency}.
                  </p>
                  <div className="w-48 bg-stone-800 h-2 rounded-full mx-auto overflow-hidden">
                    <div className="bg-[#BB1919] h-full animate-[progress_3s_ease-in-out_infinite]" />
                  </div>
                </div>
              ) : (
                /* Donation Input Form */
                <form onSubmit={handleDonateSubmit} className="space-y-6">
                  {/* Frequency & Currency selectors */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
                    {/* Frequency (One-off / Monthly) */}
                    <div className="flex items-center p-0.5 bg-stone-900 border border-stone-800 rounded-xs">
                      <button
                        type="button"
                        onClick={() => setFrequency('one_off')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-2xs transition-colors cursor-pointer ${
                          frequency === 'one_off' ? 'bg-[#BB1919] text-white shadow-xs' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        Mara Moja (One-off)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrequency('monthly')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-2xs transition-colors cursor-pointer ${
                          frequency === 'monthly' ? 'bg-[#BB1919] text-white shadow-xs' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        Kila Mwezi (Monthly)
                      </button>
                    </div>

                    {/* Currency Switcher */}
                    <div className="flex items-center gap-1 text-xs font-mono font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrency('TZS');
                          setSelectedAmount(10000);
                          setCustomAmount('');
                        }}
                        className={`px-2.5 py-1 rounded-2xs transition-colors cursor-pointer ${
                          currency === 'TZS' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        TZS (Shilingi)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrency('USD');
                          setSelectedAmount(10);
                          setCustomAmount('');
                        }}
                        className={`px-2.5 py-1 rounded-2xs transition-colors cursor-pointer ${
                          currency === 'USD' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        USD ($)
                      </button>
                    </div>
                  </div>

                  {/* Preset Amount Pills */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Chagua Kiasi cha Mchango (Amount):
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
                          className={`py-2.5 text-xs font-bold font-mono rounded-xs border transition-all cursor-pointer text-center ${
                            selectedAmount === amt && !customAmount
                              ? 'bg-[#BB1919] text-white border-[#BB1919] ring-2 ring-red-500/30'
                              : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-600'
                          }`}
                        >
                          {currency === 'TZS' ? `${amt.toLocaleString()} TZS` : `$${amt}`}
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="mt-2.5">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-stone-500">
                          {currency}
                        </span>
                        <input
                          type="number"
                          min="1"
                          placeholder="Weka kiasi kingine (Custom amount)..."
                          value={customAmount}
                          onChange={e => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(0);
                          }}
                          className="w-full pl-14 pr-4 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xs text-white placeholder:text-stone-500 focus:outline-hidden focus:border-[#BB1919] font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Providers */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Njia ya Malipo (Payment Method):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'mpesa', name: 'Vodacom M-Pesa', badge: 'M-PESA', color: 'text-red-400' },
                        { id: 'tigopesa', name: 'Tigo Pesa', badge: 'TIGO', color: 'text-blue-400' },
                        { id: 'airtel', name: 'Airtel Money', badge: 'AIRTEL', color: 'text-rose-400' },
                        { id: 'halopesa', name: 'Halopesa', badge: 'HALO', color: 'text-amber-400' },
                        { id: 'crdb', name: 'CRDB / NMB Bank', badge: 'BANK', color: 'text-emerald-400' },
                        { id: 'card', name: 'Visa / Mastercard', badge: 'CARD', color: 'text-purple-400' },
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setProvider(p.id as any)}
                          className={`p-2.5 text-left rounded-xs border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                            provider === p.id
                              ? 'bg-stone-800 text-white border-[#BB1919] ring-2 ring-red-500/20'
                              : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <span>{p.name}</span>
                          <span className={`text-[10px] font-mono font-bold ${p.color}`}>{p.badge}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Donor Information & Designed Phone Number Input */}
                  <div className="space-y-3 pt-2 border-t border-stone-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                          Jina Lako (Your Name / Organization)
                        </label>
                        <input
                          type="text"
                          required
                          value={donorName}
                          onChange={e => setDonorName(e.target.value)}
                          placeholder="Juma Mwamburi au Anwani..."
                          className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xs text-white placeholder:text-stone-600 focus:outline-hidden focus:border-[#BB1919]"
                        />
                      </div>

                      {/* Phone Input with Carrier Detection for Mobile Money Push */}
                      <div className="text-stone-900">
                        <PhoneInput
                          value={donorPhone}
                          onChange={full => setDonorPhone(full)}
                          label="Namba ya Malipo (M-Pesa / Tigo Pesa)"
                          required
                          showQuickPresets={false}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Ujumbe kwa Chumba cha Habari (Hiari)
                      </label>
                      <input
                        type="text"
                        value={donorMessage}
                        onChange={e => setDonorMessage(e.target.value)}
                        placeholder="Neno la kuwatia moyo waandishi wetu..."
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xs text-white placeholder:text-stone-600 focus:outline-hidden focus:border-[#BB1919]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing || !currentTotal}
                    className="w-full py-3.5 bg-[#BB1919] hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-black uppercase tracking-widest rounded-xs transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>
                      {isProcessing
                        ? 'Inatuma Maombi ya Malipo...'
                        : `Changia Sasa · ${currentTotal.toLocaleString()} ${currency} (${frequency === 'monthly' ? 'Kila Mwezi' : 'Mara Moja'})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-stone-500">
                    Kwa kuchangia, unasaidia The Sun kuendelea kutoa habari huru nchini Tanzania bila ada yoyote ya usomaji.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
