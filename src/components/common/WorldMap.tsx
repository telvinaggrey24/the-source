import React, { useState } from 'react';
import { Globe, Radio, Users, MapPin, Sparkles, MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';

export interface ReaderHub {
  id: string;
  name: string;
  country: string;
  code: string;
  dialCode: string;
  flag: string;
  readers: string;
  x: number; // SVG coordinates 0-1000
  y: number; // SVG coordinates 0-500
  isHQ?: boolean;
}

export const READER_HUBS: ReaderHub[] = [
  {
    id: 'tz-dar',
    name: 'Dar es Salaam (HQ)',
    country: 'Tanzania',
    code: 'TZ',
    dialCode: '+255',
    flag: '🇹🇿',
    readers: '84,200',
    x: 580,
    y: 310,
    isHQ: true,
  },
  {
    id: 'ke-nbi',
    name: 'Nairobi Bureau',
    country: 'Kenya',
    code: 'KE',
    dialCode: '+254',
    flag: '🇰🇪',
    readers: '32,400',
    x: 585,
    y: 285,
  },
  {
    id: 'ug-kla',
    name: 'Kampala Desk',
    country: 'Uganda',
    code: 'UG',
    dialCode: '+256',
    flag: '🇺🇬',
    readers: '18,600',
    x: 565,
    y: 280,
  },
  {
    id: 'rw-kgl',
    name: 'Kigali Desk',
    country: 'Rwanda',
    code: 'RW',
    dialCode: '+250',
    flag: '🇷🇼',
    readers: '9,800',
    x: 558,
    y: 295,
  },
  {
    id: 'za-jhb',
    name: 'Johannesburg (SADC)',
    country: 'South Africa',
    code: 'ZA',
    dialCode: '+27',
    flag: '🇿🇦',
    readers: '14,200',
    x: 545,
    y: 410,
  },
  {
    id: 'uk-lon',
    name: 'London (UK Diaspora)',
    country: 'United Kingdom',
    code: 'GB',
    dialCode: '+44',
    flag: '🇬🇧',
    readers: '15,800',
    x: 485,
    y: 125,
  },
  {
    id: 'us-nyc',
    name: 'New York & DC (Americas)',
    country: 'United States',
    code: 'US',
    dialCode: '+1',
    flag: '🇺🇸',
    readers: '19,500',
    x: 275,
    y: 165,
  },
  {
    id: 'ae-dxb',
    name: 'Dubai (Gulf Desk)',
    country: 'UAE',
    code: 'AE',
    dialCode: '+971',
    flag: '🇦🇪',
    readers: '11,100',
    x: 645,
    y: 215,
  },
  {
    id: 'ng-los',
    name: 'Lagos Bureau',
    country: 'Nigeria',
    code: 'NG',
    dialCode: '+234',
    flag: '🇳🇬',
    readers: '8,400',
    x: 480,
    y: 275,
  },
];

interface WorldMapProps {
  onSelectHub?: (hub: ReaderHub) => void;
  selectedDialCode?: string;
  showSupportDetails?: boolean;
  compact?: boolean;
  className?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  onSelectHub,
  selectedDialCode = '+255',
  showSupportDetails = true,
  compact = false,
  className = '',
}) => {
  const [activeHub, setActiveHub] = useState<ReaderHub>(READER_HUBS[0]);
  const [hoveredHub, setHoveredHub] = useState<ReaderHub | null>(null);

  const handleHubClick = (hub: ReaderHub) => {
    setActiveHub(hub);
    if (onSelectHub) {
      onSelectHub(hub);
    }
  };

  const displayedHub = hoveredHub || activeHub;

  return (
    <div className={`flex flex-col bg-stone-950 text-white rounded-xs overflow-hidden border border-stone-800 ${className}`}>
      {/* Top Map Header */}
      <div className="p-3.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-red-500" />
              <span className="font-bold text-xs uppercase tracking-wider text-white">
                Global Reader Network
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              195,400+ Active Readers &bull; 54 Countries Connected
            </span>
          </div>
        </div>

        <span className="px-2 py-0.5 bg-red-950/80 text-red-400 border border-red-800/60 text-[10px] font-mono font-bold rounded-2xs">
          HQ: Dar es Salaam (+255)
        </span>
      </div>

      {/* Interactive World Map SVG Viewport */}
      <div className="relative w-full bg-[#0a0c10] p-2 overflow-hidden select-none">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG World Map Vector with accurate simplified continental outlines */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-auto max-h-[260px] sm:max-h-[300px] object-contain"
          aria-label="Interactive World Map of Readers"
        >
          <defs>
            {/* HQ Radiant Glow Filter */}
            <radialGradient id="hq-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#dc2626" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Latitude & Equator Guide Lines */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#1f2937" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="0" y1="125" x2="1000" y2="125" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="0" y1="375" x2="1000" y2="375" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="#1f2937" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* CONTINENT PATHS (Stylized Vector Landmasses) */}
          <g fill="#181d24" stroke="#2a3340" strokeWidth="1" strokeLinejoin="round">
            {/* North America */}
            <path d="M 120 70 L 190 60 L 260 70 L 320 100 L 290 150 L 310 180 L 260 210 L 230 250 L 200 240 L 190 200 L 140 180 L 110 130 Z" />
            {/* Central America & Greenland */}
            <path d="M 230 250 L 245 280 L 280 295 L 265 315 L 245 295 L 220 260 Z" />
            <path d="M 330 35 L 390 40 L 410 75 L 360 90 L 330 60 Z" />

            {/* South America */}
            <path d="M 270 310 L 340 310 L 380 360 L 360 440 L 320 480 L 295 440 L 285 365 Z" />

            {/* Europe */}
            <path d="M 450 110 L 490 85 L 540 95 L 570 135 L 540 170 L 480 180 L 450 160 Z" />
            {/* British Isles */}
            <path d="M 465 110 L 485 105 L 495 130 L 475 140 Z" />

            {/* Africa */}
            <path d="M 460 190 L 550 185 L 585 220 L 640 260 L 600 340 L 560 430 L 510 435 L 480 340 L 450 250 Z" />
            {/* Madagascar */}
            <path d="M 620 360 L 635 375 L 625 410 L 610 395 Z" />

            {/* Asia */}
            <path d="M 570 135 L 680 85 L 790 95 L 850 150 L 800 240 L 730 240 L 670 210 L 630 220 L 600 180 Z" />
            {/* Middle East & Indian Subcontinent */}
            <path d="M 590 200 L 650 205 L 670 240 L 630 270 L 590 230 Z" />
            <path d="M 670 210 L 730 225 L 725 290 L 690 310 L 670 250 Z" />
            {/* Southeast Asia & Japan */}
            <path d="M 750 250 L 800 270 L 820 330 L 775 320 Z" />
            <path d="M 855 145 L 870 165 L 860 210 L 845 190 Z" />

            {/* Australia & Oceania */}
            <path d="M 780 360 L 870 350 L 900 410 L 845 450 L 785 420 Z" />
            <path d="M 910 435 L 935 440 L 925 470 L 905 460 Z" />
          </g>

          {/* East Africa Focus Ring (Tanzania, Kenya, Uganda Highlight) */}
          <ellipse
            cx="580"
            cy="300"
            rx="50"
            ry="45"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            className="animate-spin-slow origin-[580px_300px]"
          />

          {/* Dynamic Connection lines from Global Desks to Dar es Salaam HQ */}
          {READER_HUBS.filter(h => !h.isHQ).map(hub => (
            <g key={`line-${hub.id}`}>
              <path
                d={`M ${hub.x} ${hub.y} Q ${(hub.x + 580) / 2} ${Math.min(hub.y, 310) - 30} 580 310`}
                fill="none"
                stroke={activeHub.id === hub.id ? '#ef4444' : '#374151'}
                strokeWidth={activeHub.id === hub.id ? '2' : '1'}
                strokeDasharray={activeHub.id === hub.id ? '4 2' : '2 3'}
                opacity={activeHub.id === hub.id ? 0.9 : 0.5}
                className="transition-all duration-300"
              />
            </g>
          ))}

          {/* Reader Hub Pins and Radiating Glows */}
          {READER_HUBS.map(hub => {
            const isSelected = activeHub.id === hub.id || selectedDialCode === hub.dialCode;
            const isHovered = hoveredHub?.id === hub.id;

            return (
              <g
                key={hub.id}
                onClick={() => handleHubClick(hub)}
                onMouseEnter={() => setHoveredHub(hub)}
                onMouseLeave={() => setHoveredHub(null)}
                className="cursor-pointer group"
              >
                {/* Outer animated pulsating circle */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={hub.isHQ ? 18 : 12}
                  fill={hub.isHQ ? 'url(#hq-glow)' : 'url(#node-glow)'}
                  className="animate-pulse"
                />

                {/* HQ extra radiant ping */}
                {hub.isHQ && (
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r="12"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    opacity="0.8"
                    className="animate-ping"
                  />
                )}

                {/* Main Node Point */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={hub.isHQ ? 6 : isSelected ? 5 : 4}
                  fill={hub.isHQ ? '#ef4444' : isSelected ? '#38bdf8' : '#e5e7eb'}
                  stroke="#111827"
                  strokeWidth="2"
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Flag / Label Tag */}
                <text
                  x={hub.x + 8}
                  y={hub.y + 4}
                  fill={hub.isHQ ? '#fca5a5' : isSelected ? '#7dd3fc' : '#9ca3af'}
                  fontSize="11"
                  fontWeight={hub.isHQ || isSelected ? 'bold' : 'normal'}
                  fontFamily="sans-serif"
                  className="pointer-events-none transition-colors"
                >
                  {hub.flag} {hub.country}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Active Hub Floating Data Pill */}
        <div className="absolute bottom-2 left-2 right-2 sm:right-auto sm:max-w-xs bg-stone-900/95 backdrop-blur-md border border-stone-700/80 p-2.5 rounded-xs shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{displayedHub.flag}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white leading-none">
                  {displayedHub.name}
                </span>
                {displayedHub.isHQ && (
                  <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold rounded-2xs uppercase">
                    HQ
                  </span>
                )}
              </div>
              <span className="text-[10px] text-stone-400 font-mono">
                {displayedHub.readers} wasomaji hewani &bull; Dial: <strong className="text-red-400">{displayedHub.dialCode}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleHubClick(displayedHub)}
            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase rounded-2xs transition-colors shrink-0 cursor-pointer"
          >
            Chagua ({displayedHub.dialCode})
          </button>
        </div>
      </div>

      {/* Quick Region Selector Badges */}
      <div className="p-3 bg-stone-900 border-t border-stone-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
          Bofya nchi yako kuunganisha namba ya simu:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {READER_HUBS.map(hub => {
            const isSelected = activeHub.id === hub.id || selectedDialCode === hub.dialCode;
            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => handleHubClick(hub)}
                className={`px-2 py-1 text-[11px] rounded-2xs flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-500 font-bold shadow-xs'
                    : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border-stone-700'
                }`}
              >
                <span>{hub.flag}</span>
                <span>{hub.country}</span>
                <span className="font-mono text-[10px] opacity-80">{hub.dialCode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Support Contact Details Card */}
      {showSupportDetails && (
        <div className="p-3.5 bg-stone-950/90 border-t border-stone-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-red-500" />
              Msaada wa Kuingia (Editorial Desk Helpline):
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">
              24/7 Hewani
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {/* WhatsApp Support Direct Link */}
            <a
              href="https://wa.me/255622754599?text=Habari%20The%20Source%20Newsroom,%20nahitaji%20msaada%20wa%20kuingia%20kwenye%20akaunti%20yangu."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/60 rounded-xs flex items-center gap-2 text-emerald-300 transition-colors group"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-white block text-[11px] leading-tight">
                  WhatsApp: +255 622 754 599
                </span>
                <span className="text-[10px] text-emerald-400 group-hover:underline">
                  Bofya kuanza mazungumzo
                </span>
              </div>
            </a>

            {/* Email Support Direct Link */}
            <a
              href="mailto:telvinaggrey24@gmail.com?subject=The%20Source%20Sign-in%20Support"
              className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-xs flex items-center gap-2 text-stone-300 transition-colors group"
            >
              <div className="w-6 h-6 rounded-full bg-[#BB1919] text-white flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-white block text-[11px] leading-tight truncate">
                  telvinaggrey24@gmail.com
                </span>
                <span className="text-[10px] text-stone-400 group-hover:underline">
                  Barua pepe ya uhariri
                </span>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
