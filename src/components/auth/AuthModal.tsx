import React, { useState, useEffect, useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { PhoneInput } from '../common/PhoneInput';
import {
  X,
  Smartphone,
  Mail,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bookmark,
  Bell,
  MessageSquare,
  KeyRound,
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

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Success toast animation
  const [authSuccess, setAuthSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    // Demo accept any 4-6 digits or 772910 or 1234
    if (code.length >= 4) {
      const user = loginWithPhone(phoneValue || '+255 754 112 000', regName || undefined);
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
    const user = loginWithPhone(targetPhone, targetName);
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

    const user = loginWithEmail(emailValue);
    setSuccessMessage(`Welcome, ${user.name}!`);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      setIsAuthModalOpen(false);
    }, 1500);
  };

  // Handle Register submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    if (regPhone) {
      loginWithPhone(regPhone, regName);
    } else if (regEmail) {
      loginWithEmail(regEmail, regName);
    } else {
      loginWithPhone('0754 112 000', regName);
    }

    setSuccessMessage(`Akaunti yako imeundwa rasmi, ${regName}!`);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      setIsAuthModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-xs shadow-2xl overflow-hidden border border-stone-200 animate-scale-in">
        {/* Top Header Bar */}
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
              <h2 className="font-sans font-black text-sm sm:text-base text-white tracking-tight uppercase leading-none">
                READER ACCOUNT
              </h2>
              <span className="text-[10px] text-stone-400 font-sans tracking-wide">
                {language === 'sw' ? 'Ingia au Jisajili Kusoma Habari za Kipekee' : 'Sign in or register for verified reading'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer rounded-xs"
            aria-label="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If already logged in, show User Card */}
        {currentUser ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-stone-50 border border-stone-200 rounded-xs">
              <div className="w-14 h-14 bg-[#BB1919] text-white font-black text-xl rounded-full flex items-center justify-center shadow-xs">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-stone-900">{currentUser.name}</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-2xs border border-emerald-300">
                    Active
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono">
                  {currentUser.phone || currentUser.email}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-600">
                  <span className="flex items-center gap-1 font-semibold text-stone-700">
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

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setView({ type: 'home' });
                }}
                className="w-full py-2.5 bg-[#BB1919] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Continue Reading The Sun
              </button>
              <button
                onClick={logoutUser}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Sign Out (Toka Kwenye Akaunti)
              </button>
            </div>
          </div>
        ) : authSuccess ? (
          /* Success Screen */
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-stone-900">{successMessage}</h3>
            <p className="text-xs text-stone-500">
              Umeunganishwa kwenye The Sun Newsroom. Unaweza kutoa maoni na kuhifadhi makala.
            </p>
          </div>
        ) : (
          /* Authentication Forms */
          <div className="p-6 sm:p-8">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-stone-100 rounded-xs mb-6 border border-stone-200">
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
                        <span>Ingia Rahisi kwa Namba ya Simu:</span>
                      </div>
                      <span>
                        Weka namba yako ya simu ya Tanzania (Vodacom, Tigo, Airtel, Halotel). Hakuna nenosiri linalohitajika — ingia mara moja au thibitisha kwa nambari ya siri.
                      </span>
                    </div>

                    {/* Reader Name (Optional) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Jina Lako (Hiari / Optional Name)
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="Mfano: Juma Baraka, Fatma Said..."
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                      />
                    </div>

                    {/* Designed Phone Number Input Component */}
                    <PhoneInput
                      value={phoneValue}
                      onChange={(full, digits, valid) => {
                        setPhoneValue(full);
                        setCleanPhoneDigits(digits);
                        setIsPhoneValid(valid);
                      }}
                      required
                      autoFocus
                      label="Namba ya Simu (Tanzania & East Africa)"
                    />

                    {/* Quick Test Demo Numbers */}
                    <div>
                      <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                        Jaribu namba za mfano kwa mbofyo 1:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
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

                    {/* Dual Action Buttons: Instant 1-Click Sign In vs SMS OTP */}
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

                    {/* Staff link */}
                    <div className="pt-2 text-center border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAuthModalOpen(false);
                          setView({ type: 'admin' });
                        }}
                        className="text-[11px] text-[#BB1919] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Shield className="w-3 h-3" />
                        <span>Wafanyakazi au Wahariri? Fungua Kidhibiti (CMS Dashboard)</span>
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
                          className="w-11 h-12 text-center text-xl font-bold font-mono border-2 border-stone-300 rounded-xs focus:border-[#BB1919] focus:outline-hidden bg-stone-50 focus:bg-white transition-all"
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-xs text-center text-red-600 font-bold">{otpError}</p>
                    )}

                    {/* Resend Timer & Quick Fill Demo */}
                    <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                      <div>
                        {resendTimer > 0 ? (
                          <span>Tuma tena baada ya: <strong className="font-mono text-stone-800">{resendTimer}s</strong></span>
                        ) : (
                          <button
                            onClick={() => {
                              setResendTimer(45);
                              setOtpDigits(['', '', '', '', '', '']);
                            }}
                            className="text-[#BB1919] font-bold hover:underline cursor-pointer"
                          >
                            Tuma Nambari Nyingine (Resend)
                          </button>
                        )}
                      </div>

                      {/* Demo Quick Fill Helper */}
                      <button
                        type="button"
                        onClick={handleQuickOtp}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-2xs border border-amber-200 cursor-pointer"
                      >
                        Demo Code (772-910)
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Barua Pepe (Email Address)
                  </label>
                  <input
                    type="email"
                    required
                    value={emailValue}
                    onChange={e => setEmailValue(e.target.value)}
                    placeholder="juma.mwananchi@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Nenosiri (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => setPasswordValue('reader2026')}
                      className="text-[11px] text-[#BB1919] hover:underline"
                    >
                      Fill Demo Pass
                    </button>
                  </div>
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

            {/* TAB 3: REGISTER */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Jina Kamili (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Baraka Emmanuel"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                  />
                </div>

                <div>
                  <PhoneInput
                    value={regPhone}
                    onChange={full => setRegPhone(full)}
                    label="Namba ya Simu (Phone Number)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Barua Pepe (Email - Hiari)
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="baraka@example.com"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#121212] hover:bg-[#BB1919] text-white text-xs font-bold uppercase tracking-widest rounded-xs transition-colors cursor-pointer shadow-xs"
                >
                  Unda Akaunti ya Bure (Register Free)
                </button>
              </form>
            )}

            {/* Reader Benefits Footer */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                Faida za Kuwa Msomaji wa The Sun:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#BB1919]" />
                  <span>Hifadhi makala kusoma baadaye</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#BB1919]" />
                  <span>Mjadala na maoni yaliyothibitishwa</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#BB1919]" />
                  <span>Taarifa za dharura za Tanzania</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#BB1919]" />
                  <span>Usiri na ulinzi wa data 100%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
