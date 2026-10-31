import React, { useState, useEffect, useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { PhoneInput, SUPPORTED_COUNTRIES } from '../common/PhoneInput';
import { WorldMap, ReaderHub, READER_HUBS } from '../common/WorldMap';
import {
  X,
  Smartphone,
  Mail,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bookmark,
  Bell,
  MessageSquare,
  KeyRound,
  Globe,
  Phone,
  MessageCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    loginWithPhone,
    loginWithEmail,
    logoutUser,
    setView,
    language,
  } = useNews();

  // Tabs: 'phone' | 'email' | 'register'
  const [authTab, setAuthTab] = useState<'phone' | 'email' | 'register'>('phone');

  // Mobile View Toggle: 'form' vs 'map'
  const [mobileView, setMobileView] = useState<'form' | 'map'>('form');

  // Selected Country / Hub from WorldMap
  const [selectedHub, setSelectedHub] = useState<ReaderHub>(READER_HUBS[0]);
  const [selectedDialCode, setSelectedDialCode] = useState('+255');
  const [selectedCountryCode, setSelectedCountryCode] = useState('TZ');

  // Phone Login State
  const [phoneValue, setPhoneValue] = useState('');
  const [cleanPhoneDigits, setCleanPhoneDigits] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(45);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email Login State
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState('');

  // Register State (Full Contact Details)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Dar es Salaam');

  // Success toast animation
  const [authSuccess, setAuthSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Hub selected on the World Map
  const handleMapHubSelect = (hub: ReaderHub) => {
    setSelectedHub(hub);
    setSelectedDialCode(hub.dialCode);
    setSelectedCountryCode(hub.code);
    setRegCity(hub.name.split('(')[0].trim());
    // Auto-switch mobile back to form so user can immediately type
    setMobileView('form');
  };

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    };
    if (isAuthModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen]);

  // Resend OTP countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phoneStep === 'otp' && resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [phoneStep, resendTimer]);

  if (!isAuthModalOpen) return null;

  // Handle phone submission -> move to OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanPhoneDigits || cleanPhoneDigits.length < 8) {
      return;
    }
    setPhoneStep('otp');
    setResendTimer(45);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
  };

  // Handle 6-digit OTP input change
  const handleOtpChange = (index: number, val: string) => {
    const char = val.slice(-1).replace(/\D/g, '');
    const newOtp = [...otpDigits];
    newOtp[index] = char;
    setOtpDigits(newOtp);
    setOtpError('');

    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto verify if all 6 filled
    if (index === 5 && char) {
      const code = newOtp.join('');
      verifyOtpCode(code);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtpCode = (code: string) => {
    if (code.length >= 4) {
      const user = loginWithPhone(phoneValue || '+255 754 112 000', regName || undefined, {
        email: regEmail || undefined,
        location: regCity || undefined,
        country: selectedHub.country,
      });
      setSuccessMessage(`Karibu tena, ${user.name}!`);
      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        setIsAuthModalOpen(false);
      }, 1400);
    } else {
      setOtpError('Invalid OTP code. Enter the verification code.');
    }
  };

  // Instant 1-Click Phone Sign In
  const handleInstantPhoneLogin = (overridePhone?: string, overrideName?: string) => {
    const targetPhone = overridePhone || phoneValue || '+255 754 112 000';
    const targetName = overrideName || regName || undefined;
    const user = loginWithPhone(targetPhone, targetName, {
      email: regEmail || undefined,
      location: regCity || undefined,
      country: selectedHub.country,
    });
    setSuccessMessage(`Karibu tena, ${user.name}!`);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      setIsAuthModalOpen(false);
    }, 1400);
  };

  // Quick fill demo OTP
  const handleQuickOtp = () => {
    const demo = ['7', '7', '2', '9', '1', '0'];
    setOtpDigits(demo);
    verifyOtpCode('772910');
  };

  // Handle email login submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue || !emailValue.includes('@')) {
      setEmailError('Tafadhali ingiza barua pepe halali.');
      return;
    }
    if (passwordValue.length < 4) {
      setEmailError('Nenosiri linapaswa kuwa na angalau herufi 4.');
      return;
    }

    const user = loginWithEmail(emailValue, undefined, {
      phone: phoneValue || undefined,
      location: regCity || undefined,
      country: selectedHub.country,
    });
    setSuccessMessage(`Welcome, ${user.name}!`);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      setIsAuthModalOpen(false);
    }, 1500);
  };

  // Handle Register submit with full Contact Details
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    if (regPhone) {
      loginWithPhone(regPhone, regName, {
        email: regEmail || undefined,
        location: regCity,
        country: selectedHub.country,
      });
    } else if (regEmail) {
      loginWithEmail(regEmail, regName, {
        phone: regPhone || undefined,
        location: regCity,
        country: selectedHub.country,
      });
    } else {
      loginWithPhone('+255 754 112 000', regName, {
        location: regCity,
        country: selectedHub.country,
      });
    }

    setSuccessMessage(`Akaunti yako imeundwa rasmi, ${regName}!`);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      setIsAuthModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-white rounded-xs shadow-2xl overflow-hidden border border-stone-300 animate-scale-in my-auto max-h-[95vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-[#121212] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-[#BB1919] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded shadow-xs">
              <img
                src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                alt="The Source"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-black text-sm sm:text-base text-white tracking-tight uppercase leading-none">
                  READER ACCOUNT &amp; GLOBAL NETWORK
                </h2>
                <span className="hidden sm:inline-block px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold rounded-2xs">
                  World Map Connected
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-sans tracking-wide">
                {language === 'sw'
                  ? 'Ingia au Jisajili ukitumia Maelezo ya Mawasiliano'
                  : 'Sign in or register with verified contact details across East Africa & Worldwide'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile View Switcher (Form vs Map) */}
            <div className="lg:hidden flex items-center bg-stone-800 rounded-2xs p-0.5 border border-stone-700">
              <button
                type="button"
                onClick={() => setMobileView('form')}
                className={`px-2 py-1 text-[10px] font-bold rounded-2xs transition-colors cursor-pointer ${
                  mobileView === 'form' ? 'bg-[#BB1919] text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMobileView('map')}
                className={`px-2 py-1 text-[10px] font-bold rounded-2xs transition-colors cursor-pointer flex items-center gap-1 ${
                  mobileView === 'map' ? 'bg-[#BB1919] text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>World Map</span>
              </button>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer rounded-xs"
              aria-label="Close login modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto">
          {currentUser ? (
            /* Logged In View */
            <div className="p-6 sm:p-10 max-w-xl mx-auto space-y-6">
              <div className="flex items-center gap-4 p-5 bg-stone-50 border border-stone-200 rounded-xs shadow-xs">
                <div className="w-16 h-16 bg-[#BB1919] text-white font-black text-2xl rounded-full flex items-center justify-center shadow-xs">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-stone-900">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-2xs border border-emerald-300">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-mono mt-0.5">
                    {currentUser.phone || currentUser.email}
                  </p>
                  {currentUser.location && (
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{currentUser.location}, {currentUser.country || 'East Africa'}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-600">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Reader
                    </span>
                    {currentUser.isDonor && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-2xs">
                        The Sun Supporter
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Verified Contact Details Summary */}
              <div className="p-4 bg-stone-100 border border-stone-200 rounded-xs text-xs space-y-1.5">
                <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px] block mb-1">
                  Maelezo Yako ya Mawasiliano (Your Contact Details):
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Simu / WhatsApp:</span>
                    <strong className="text-stone-900 font-mono">{currentUser.phone || 'Haijawekwa'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Barua Pepe (Email):</span>
                    <strong className="text-stone-900">{currentUser.email || 'Haijawekwa'}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setView({ type: 'home' });
                  }}
                  className="w-full py-3 bg-[#BB1919] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  Continue Reading The Sun
                </button>
                <button
                  onClick={logoutUser}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  Sign Out (Toka Kwenye Akaunti)
                </button>
              </div>
            </div>
          ) : authSuccess ? (
            /* Success Screen */
            <div className="p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-stone-900">{successMessage}</h3>
              <p className="text-xs text-stone-500">
                Umeunganishwa kikamilifu kwenye mtandao wa The Source &amp; The Sun Newsroom.
              </p>
            </div>
          ) : (
            /* 2-Column Split: Left = World Map, Right = Sign-in & Contact Forms */
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              {/* LEFT COLUMN: Interactive World Map & Global Reach */}
              <div
                className={`lg:col-span-6 bg-stone-950 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-800 ${
                  mobileView === 'form' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div>
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase tracking-wider">
                      <Globe className="w-4 h-4" />
                      <span>Ramani ya Wasomaji Duniani (World Map)</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                      Bofya kituo chako cha habari kwenye ramani ili kujaza nambari ya simu na nchi kiotomatiki:
                    </p>
                  </div>

                  {/* Interactive World Map Component */}
                  <WorldMap
                    onSelectHub={handleMapHubSelect}
                    selectedDialCode={selectedDialCode}
                    showSupportDetails={true}
                  />
                </div>

                {/* Mobile Back to Form Button */}
                <div className="lg:hidden mt-4 pt-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setMobileView('form')}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Endelea Kuingia na Nambari ({selectedDialCode})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Sign In / Registration Form with Contact Details */}
              <div
                className={`lg:col-span-6 p-4 sm:p-7 flex flex-col justify-between bg-white ${
                  mobileView === 'map' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div>
                  {/* Selected Country Badge from World Map */}
                  <div className="mb-4 p-2 bg-stone-50 border border-stone-200 rounded-xs flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedHub.flag}</span>
                      <div>
                        <span className="font-bold text-stone-900 block leading-tight text-xs">
                          {selectedHub.name} ({selectedHub.dialCode})
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {selectedHub.readers} wasomaji wameunganishwa
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileView('map')}
                      className="text-[11px] font-bold text-[#BB1919] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Badili Nchi / Map</span>
                    </button>
                  </div>

                  {/* Mode Switcher Tabs */}
                  <div className="flex items-center p-1 bg-stone-100 rounded-xs mb-5 border border-stone-200">
                    <button
                      onClick={() => {
                        setAuthTab('phone');
                        setPhoneStep('input');
                      }}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        authTab === 'phone'
                          ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                          : 'text-stone-600 hover:text-stone-950'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 text-[#BB1919]" />
                      <span>Namba ya Simu</span>
                    </button>

                    <button
                      onClick={() => setAuthTab('email')}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        authTab === 'email'
                          ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                          : 'text-stone-600 hover:text-stone-950'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5 text-[#BB1919]" />
                      <span>Barua Pepe</span>
                    </button>

                    <button
                      onClick={() => setAuthTab('register')}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        authTab === 'register'
                          ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                          : 'text-stone-600 hover:text-stone-950'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Jisajili</span>
                    </button>
                  </div>

                  {/* TAB 1: PHONE LOGIN */}
                  {authTab === 'phone' && (
                    <div>
                      {phoneStep === 'input' ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div className="p-3 bg-red-50/80 border border-red-200 rounded-xs text-xs text-stone-700 leading-relaxed">
                            <div className="flex items-center gap-1.5 text-red-900 font-bold mb-1">
                              <Smartphone className="w-3.5 h-3.5 text-[#BB1919]" />
                              <span>Ingia kwa Maelezo ya Simu / WhatsApp:</span>
                            </div>
                            <span>
                              Ingiza namba yako ya simu. Hakuna nenosiri linalohitajika — unaweza kuingia mara moja au kuthibitisha kwa nambari ya siri.
                            </span>
                          </div>

                          {/* Reader Name (Optional) */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                              Jina Lako (Hiari / Full Name)
                            </label>
                            <input
                              type="text"
                              value={regName}
                              onChange={e => setRegName(e.target.value)}
                              placeholder="Mfano: Juma Baraka, Fatma Said..."
                              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                            />
                          </div>

                          {/* Phone Input with World Map Country Code Sync */}
                          <PhoneInput
                            value={phoneValue}
                            onChange={(full, digits, valid) => {
                              setPhoneValue(full);
                              setCleanPhoneDigits(digits);
                              setIsPhoneValid(valid);
                            }}
                            forcedCountryCode={selectedCountryCode}
                            required
                            autoFocus
                            label={`Namba ya Simu (${selectedHub.country} ${selectedHub.dialCode})`}
                          />

                          {/* Quick Tanzania Carrier Demo Chips */}
                          <div>
                            <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                              Jaribu namba za mfano kwa mbofyo 1:
                            </span>
                            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDialCode('+255');
                                  setSelectedCountryCode('TZ');
                                  setPhoneValue('+255 754 112 000');
                                  setCleanPhoneDigits('754112000');
                                  setIsPhoneValid(true);
                                  if (!regName) setRegName('Amina Juma');
                                }}
                                className="px-2 py-1.5 bg-stone-100 hover:bg-red-50 hover:text-red-800 border border-stone-200 rounded-2xs text-stone-700 font-mono text-[10px] text-center transition-colors cursor-pointer"
                              >
                                <span className="font-bold block">0754 112 000</span>
                                <span className="text-[9px] text-stone-500">Vodacom</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDialCode('+255');
                                  setSelectedCountryCode('TZ');
                                  setPhoneValue('+255 713 554 221');
                                  setCleanPhoneDigits('713554221');
                                  setIsPhoneValid(true);
                                  if (!regName) setRegName('David Kisesa');
                                }}
                                className="px-2 py-1.5 bg-stone-100 hover:bg-blue-50 hover:text-blue-800 border border-stone-200 rounded-2xs text-stone-700 font-mono text-[10px] text-center transition-colors cursor-pointer"
                              >
                                <span className="font-bold block">0713 554 221</span>
                                <span className="text-[9px] text-stone-500">Tigo Pesa</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDialCode('+255');
                                  setSelectedCountryCode('TZ');
                                  setPhoneValue('+255 788 332 109');
                                  setCleanPhoneDigits('788332109');
                                  setIsPhoneValid(true);
                                  if (!regName) setRegName('Mwita Chacha');
                                }}
                                className="px-2 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-800 border border-stone-200 rounded-2xs text-stone-700 font-mono text-[10px] text-center transition-colors cursor-pointer"
                              >
                                <span className="font-bold block">0788 332 109</span>
                                <span className="text-[9px] text-stone-500">Airtel</span>
                              </button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleInstantPhoneLogin()}
                              disabled={!cleanPhoneDigits && !phoneValue}
                              className="w-full py-3 bg-[#BB1919] hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest rounded-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              <span>Ingia Mara Moja (Instant Sign In)</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                              type="submit"
                              disabled={!cleanPhoneDigits}
                              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                              <span>Thibitisha kwa Nambari ya Siri (Send SMS PIN)</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* OTP Verification Step */
                        <div className="space-y-4">
                          <div className="text-center pb-2">
                            <div className="w-12 h-12 bg-red-50 text-[#BB1919] rounded-full flex items-center justify-center mx-auto mb-2 border border-red-200">
                              <KeyRound className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-base text-stone-900">Thibitisha Nambari ya Siri</h4>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Tumetuma nambari ya siri ya tarakimu 6 kwa <strong>{phoneValue}</strong>
                            </p>
                            <button
                              onClick={() => setPhoneStep('input')}
                              className="text-[11px] text-[#BB1919] font-bold hover:underline mt-1 cursor-pointer"
                            >
                              Badili Namba ya Simu
                            </button>
                          </div>

                          {/* 6 Digit Input Boxes */}
                          <div className="flex items-center justify-center gap-2">
                            {otpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={el => {
                                  otpInputRefs.current[idx] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleOtpChange(idx, e.target.value)}
                                onKeyDown={e => handleOtpKeyDown(idx, e)}
                                className="w-10 h-12 text-center text-xl font-bold font-mono border-2 border-stone-300 rounded-xs focus:border-[#BB1919] focus:outline-hidden bg-stone-50 focus:bg-white transition-all"
                              />
                            ))}
                          </div>

                          {otpError && (
                            <p className="text-xs text-center text-red-600 font-bold">{otpError}</p>
                          )}

                          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                            <div>
                              {resendTimer > 0 ? (
                                <span>Tuma tena: <strong className="font-mono text-stone-800">{resendTimer}s</strong></span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setResendTimer(45);
                                    setOtpDigits(['', '', '', '', '', '']);
                                  }}
                                  className="text-[#BB1919] font-bold hover:underline cursor-pointer"
                                >
                                  Tuma Nambari Nyingine
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={handleQuickOtp}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-2xs border border-amber-200 cursor-pointer"
                            >
                              Demo PIN (772-910)
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => verifyOtpCode(otpDigits.join(''))}
                            disabled={otpDigits.some(d => !d)}
                            className="w-full py-3 bg-[#BB1919] hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest rounded-xs transition-colors cursor-pointer"
                          >
                            Thibitisha na Ingia
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: EMAIL LOGIN */}
                  {authTab === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      {emailError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xs font-semibold">
                          {emailError}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                            Barua Pepe (Email Address)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setEmailValue('telvinaggrey24@gmail.com');
                              setPasswordValue('thesun2026');
                            }}
                            className="text-[11px] text-[#BB1919] font-bold hover:underline"
                          >
                            Fill Editorial Admin
                          </button>
                        </div>
                        <input
                          type="email"
                          required
                          value={emailValue}
                          onChange={e => setEmailValue(e.target.value)}
                          placeholder="telvinaggrey24@gmail.com"
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                          Nenosiri (Password)
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={passwordValue}
                            onChange={e => setPasswordValue(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                            className="rounded-xs text-[#BB1919]"
                          />
                          <span>Nikumbuke kwenye kifaa hiki</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAuthModalOpen(false);
                            setView({ type: 'admin' });
                          }}
                          className="text-[#BB1919] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Staff CMS Portal</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#BB1919] hover:bg-red-800 text-white text-xs font-bold uppercase tracking-widest rounded-xs transition-colors shadow-xs cursor-pointer"
                      >
                        Ingia Kwenye Akaunti
                      </button>
                    </form>
                  )}

                  {/* TAB 3: REGISTER WITH FULL CONTACT DETAILS */}
                  {authTab === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xs text-[11px] text-amber-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          Sajili akaunti yako ya usomaji ukitumia maelezo kamili ya mawasiliano.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                          Jina Kamili (Full Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          placeholder="Mfano: Emmanuel Muro, Neema Mkude"
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                        />
                      </div>

                      {/* Phone / WhatsApp with Map Country Sync */}
                      <div>
                        <PhoneInput
                          value={regPhone}
                          onChange={full => setRegPhone(full)}
                          forcedCountryCode={selectedCountryCode}
                          label={`Namba ya Simu / WhatsApp (${selectedHub.country})`}
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                          Barua Pepe (Email Address)
                        </label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          placeholder="emmanuel.muro@example.com"
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                        />
                      </div>

                      {/* Location / City */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                          Mji / Eneo Ulilopo (City &amp; Location)
                        </label>
                        <input
                          type="text"
                          value={regCity}
                          onChange={e => setRegCity(e.target.value)}
                          placeholder="Dar es Salaam, Arusha, Nairobi, London..."
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#121212] hover:bg-[#BB1919] text-white text-xs font-bold uppercase tracking-widest rounded-xs transition-colors cursor-pointer shadow-xs mt-1"
                      >
                        Unda Akaunti na Hifadhi Mawasiliano
                      </button>
                    </form>
                  )}
                </div>

                {/* Newsroom Editorial Desk Support Contact Details Bar */}
                <div className="mt-6 pt-4 border-t border-stone-200 text-xs">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#BB1919]" />
                        Mawasiliano Wakati wa Kuingia (Sign-in Support):
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-2xs">
                        Desk Online
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-[11px]">
                      {/* WhatsApp Button */}
                      <a
                        href="https://wa.me/255622754599?text=Habari%20The%20Source,%20nahitaji%20msaada%20wa%20kuingia%20kwenye%20akaunti."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xs flex items-center justify-center gap-1.5 transition-colors font-bold shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp: +255 622 754 599</span>
                      </a>

                      {/* Email Button */}
                      <a
                        href="mailto:telvinaggrey24@gmail.com?subject=The%20Source%20Sign-in%20Support"
                        className="flex-1 py-1.5 px-2 bg-stone-800 hover:bg-stone-900 text-white rounded-2xs flex items-center justify-center gap-1.5 transition-colors font-semibold"
                      >
                        <Mail className="w-3.5 h-3.5 text-red-400" />
                        <span className="truncate">telvinaggrey24@gmail.com</span>
                      </a>
                    </div>
                  </div>

                  {/* Staff CMS Shortcut */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setView({ type: 'admin' });
                      }}
                      className="text-[11px] text-[#BB1919] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Shield className="w-3 h-3" />
                      <span>Wafanyakazi au Wahariri? Fungua Kidhibiti (CMS Portal)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
