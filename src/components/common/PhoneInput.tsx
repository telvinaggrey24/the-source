import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, Smartphone, Sparkles, X } from 'lucide-react';

export interface CountryCode {
  country: string;
  code: string;
  dialCode: string;
  flag: string;
  digitsLength: number;
  placeholder: string;
}

export const SUPPORTED_COUNTRIES: CountryCode[] = [
  { country: 'Tanzania', code: 'TZ', dialCode: '+255', flag: '🇹🇿', digitsLength: 9, placeholder: '754 112 000' },
  { country: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪', digitsLength: 9, placeholder: '712 345 678' },
  { country: 'Uganda', code: 'UG', dialCode: '+256', flag: '🇺🇬', digitsLength: 9, placeholder: '772 345 678' },
  { country: 'Rwanda', code: 'RW', dialCode: '+250', flag: '🇷🇼', digitsLength: 9, placeholder: '788 123 456' },
  { country: 'Burundi', code: 'BI', dialCode: '+257', flag: '🇧🇮', digitsLength: 8, placeholder: '79 123 456' },
  { country: 'DR Congo', code: 'CD', dialCode: '+243', flag: '🇨🇩', digitsLength: 9, placeholder: '812 345 678' },
  { country: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', digitsLength: 10, placeholder: '7911 123456' },
  { country: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', digitsLength: 10, placeholder: '202 555 0143' },
  { country: 'UAE', code: 'AE', dialCode: '+971', flag: '🇦🇪', digitsLength: 9, placeholder: '50 123 4567' },
];

export interface CarrierInfo {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badge: string;
}

export function detectTanzaniaCarrier(rawNumber: string): CarrierInfo | null {
  const digits = rawNumber.replace(/\D/g, '');
  // normalize: remove leading 255 or 0
  let local = digits;
  if (local.startsWith('255')) {
    local = local.slice(3);
  }
  if (local.startsWith('0')) {
    local = local.slice(1);
  }

  if (local.startsWith('74') || local.startsWith('75') || local.startsWith('76')) {
    return {
      name: 'Vodacom M-Pesa',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badge: 'M-PESA',
    };
  }
  if (local.startsWith('71') || local.startsWith('65') || local.startsWith('67')) {
    return {
      name: 'Tigo Pesa (Yas)',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badge: 'TIGO PESA',
    };
  }
  if (local.startsWith('68') || local.startsWith('69') || local.startsWith('78')) {
    return {
      name: 'Airtel Money',
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badge: 'AIRTEL',
    };
  }
  if (local.startsWith('62')) {
    return {
      name: 'Halopesa (Halotel)',
      color: 'text-amber-800',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badge: 'HALOPESA',
    };
  }
  if (local.startsWith('73')) {
    return {
      name: 'TTCL T-Pesa',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badge: 'T-PESA',
    };
  }
  return null;
}

interface PhoneInputProps {
  value: string;
  onChange: (fullFormattedNumber: string, cleanDigits: string, isValid: boolean) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  showQuickPresets?: boolean;
  className?: string;
  forcedCountryCode?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label = 'Phone Number (Namba ya Simu)',
  error,
  disabled = false,
  required = false,
  autoFocus = false,
  showQuickPresets = true,
  className = '',
  forcedCountryCode,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(SUPPORTED_COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nationalNumber, setNationalNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Sync forcedCountryCode from WorldMap or parent
  useEffect(() => {
    if (forcedCountryCode) {
      const matched = SUPPORTED_COUNTRIES.find(
        c => c.code === forcedCountryCode || c.dialCode === forcedCountryCode
      );
      if (matched && matched.code !== selectedCountry.code) {
        setSelectedCountry(matched);
        if (nationalNumber) {
          const clean = nationalNumber.replace(/\D/g, '');
          const isValid = clean.length >= matched.digitsLength - 1;
          onChange(`${matched.dialCode} ${nationalNumber}`, clean, isValid);
        }
      }
    }
  }, [forcedCountryCode]);

  // Initialize or update from value prop
  useEffect(() => {
    if (!value) {
      setNationalNumber('');
      return;
    }
    // Check if value already has dial code
    const matched = SUPPORTED_COUNTRIES.find(c => value.startsWith(c.dialCode));
    if (matched) {
      setSelectedCountry(matched);
      const rest = value.slice(matched.dialCode.length).trim();
      setNationalNumber(formatDigits(rest));
    } else {
      setNationalNumber(formatDigits(value));
    }
  }, [value]);

  const formatDigits = (raw: string): string => {
    // strip non-digits
    const clean = raw.replace(/\D/g, '');
    // Format into groups: 0754 112 000 or 754 112 000
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
    if (clean.length <= 9) return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
    return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7, 10)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatDigits(raw);
    setNationalNumber(formatted);

    const clean = formatted.replace(/\D/g, '');
    const isValid = clean.length >= selectedCountry.digitsLength - 1;
    const full = `${selectedCountry.dialCode} ${formatted}`;
    onChange(full, clean, isValid);
  };

  const handleSelectCountry = (country: CountryCode) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    const clean = nationalNumber.replace(/\D/g, '');
    const isValid = clean.length >= country.digitsLength - 1;
    onChange(`${country.dialCode} ${nationalNumber}`, clean, isValid);
  };

  const handlePresetClick = (presetNum: string) => {
    const formatted = formatDigits(presetNum);
    setNationalNumber(formatted);
    const clean = formatted.replace(/\D/g, '');
    onChange(`${selectedCountry.dialCode} ${formatted}`, clean, true);
  };

  const clearInput = () => {
    setNationalNumber('');
    onChange('', '', false);
  };

  const cleanDigits = nationalNumber.replace(/\D/g, '');
  const isComplete = cleanDigits.length >= selectedCountry.digitsLength;
  const carrier = selectedCountry.code === 'TZ' ? detectTanzaniaCarrier(nationalNumber) : null;

  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      {/* Label and Carrier Badge */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          {label} {required && <span className="text-[#BB1919]">*</span>}
        </label>

        {carrier && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-2xs border ${carrier.bgColor} ${carrier.color} ${carrier.borderColor} animate-fade-in`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{carrier.name}</span>
          </span>
        )}
      </div>

      {/* Main Composite Input Box */}
      <div
        className={`relative flex items-center bg-white border rounded-xs transition-all duration-200 ${
          error
            ? 'border-red-500 ring-2 ring-red-100'
            : isFocused
            ? 'border-[#BB1919] ring-2 ring-red-50 shadow-xs'
            : 'border-stone-300 hover:border-stone-400'
        } ${disabled ? 'bg-stone-50 opacity-60 cursor-not-allowed' : ''}`}
      >
        {/* Country Selector Dropdown Trigger */}
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-stone-50 hover:bg-stone-100 border-r border-stone-200 text-xs font-bold text-stone-900 transition-colors cursor-pointer select-none rounded-l-xs"
            aria-label="Select Country Code"
          >
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="font-mono text-stone-800">{selectedCountry.dialCode}</span>
            <ChevronDown className="w-3 h-3 text-stone-500" />
          </button>

          {/* Country Selection Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-stone-200 rounded-xs shadow-xl z-50 max-h-60 overflow-y-auto py-1 divide-y divide-stone-100">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50">
                  Select Country / Eneo
                </div>
                {SUPPORTED_COUNTRIES.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer ${
                      selectedCountry.code === c.code ? 'bg-red-50 text-[#BB1919] font-bold' : 'text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span>{c.country}</span>
                    </div>
                    <span className="font-mono text-stone-500 text-[11px] font-semibold">{c.dialCode}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Telephone Number Input Field */}
        <div className="relative flex-1 flex items-center">
          <input
            type="tel"
            autoFocus={autoFocus}
            disabled={disabled}
            value={nationalNumber}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={selectedCountry.placeholder}
            className="w-full px-3 py-2.5 text-sm sm:text-base font-sans tracking-wide text-stone-950 placeholder:text-stone-300 focus:outline-hidden font-medium"
          />

          {/* Clear or Complete Status Icon */}
          <div className="flex items-center gap-1 pr-3">
            {nationalNumber && (
              <button
                type="button"
                onClick={clearInput}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                title="Clear number"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isComplete && (
              <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-3" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}

      {/* Quick Test Number Presets for East Africa */}
      {showQuickPresets && selectedCountry.code === 'TZ' && !nationalNumber && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-stone-500">
          <span className="text-[10px] uppercase font-bold text-stone-400">Quick fill demo:</span>
          <button
            type="button"
            onClick={() => handlePresetClick('0754 112 000')}
            className="px-2 py-0.5 bg-stone-100 hover:bg-red-50 hover:text-[#BB1919] rounded-2xs font-mono text-[10px] transition-colors cursor-pointer border border-stone-200"
          >
            0754 112 000 (Vodacom)
          </button>
          <button
            type="button"
            onClick={() => handlePresetClick('0713 550 200')}
            className="px-2 py-0.5 bg-stone-100 hover:bg-blue-50 hover:text-blue-700 rounded-2xs font-mono text-[10px] transition-colors cursor-pointer border border-stone-200"
          >
            0713 550 200 (Tigo)
          </button>
          <button
            type="button"
            onClick={() => handlePresetClick('0685 440 100')}
            className="px-2 py-0.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 rounded-2xs font-mono text-[10px] transition-colors cursor-pointer border border-stone-200"
          >
            0685 440 100 (Airtel)
          </button>
        </div>
      )}
    </div>
  );
};
