import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Play,
  Pause,
  Radio,
  Volume2,
  CloudSun,
  Wind,
  Droplets,
  Calendar,
  Share2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface BBCSpecialPagesProps {
  pageId: 'verify' | 'video' | 'audio' | 'weather';
}

export const BBCSpecialPages: React.FC<BBCSpecialPagesProps> = ({ pageId }) => {
  const { setView, language } = useNews();

  // Video modal player state
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    description: string;
    duration: string;
    image: string;
    category: string;
  } | null>(null);

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState('Dira ya Leo: Asubuhi - 26 Oktoba 2026');
  const [audioProgress, setAudioProgress] = useState(25);

  // Fact check verification items
  const verifyItems = [
    {
      id: 'v1',
      claim: 'Social media claim alleges passenger fares on the electric SGR train will double next month.',
      verdict: 'FALSE',
      verdictColor: 'text-red-700 bg-red-50 border-red-200',
      explanation: 'Tanzania Railways Corporation (TRC) confirmed that all passenger tariffs remain regulated by LATRA with no fare revisions scheduled for 2026.',
      source: 'LATRA Gazette Notice & TRC Director of Passenger Services',
      date: '26 Oct 2026',
    },
    {
      id: 'v2',
      claim: 'Viral post says government recruitment portal (ajira.go.tz) requires a 25,000 TZS registration fee.',
      verdict: 'SCAM / FALSE',
      verdictColor: 'text-red-700 bg-red-50 border-red-200',
      explanation: 'UTUMISHI (Public Service Recruitment Secretariat) emphasized that application through the official portal is 100% free. Any fees demanded are illegal phishing scams.',
      source: 'UTUMISHI Secretariat Public Advisory circular No. 4/2026',
      date: '25 Oct 2026',
    },
    {
      id: 'v3',
      claim: 'Report states Dar es Salaam Port vessel waiting times dropped from 8 days to under 3.5 days.',
      verdict: 'TRUE',
      verdictColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      explanation: 'Satellite AIS maritime tracking and Tanzania Ports Authority digital single-window logs confirm average anchorage duration is currently 3.2 days.',
      source: 'TPA Manifest Data & MarineTraffic Satellite Tracking',
      date: '24 Oct 2026',
    },
    {
      id: 'v4',
      claim: 'Claims that Universal Health Insurance will exclude coverage for pre-existing chronic conditions.',
      verdict: 'MISLEADING',
      verdictColor: 'text-amber-700 bg-amber-50 border-amber-200',
      explanation: 'The enacted bill explicitly mandates full coverage for hypertension, diabetes, and sickle-cell disease after a standard 30-day enrollment verification window.',
      source: 'National Assembly Hansard Record & Ministry of Health Bill Schedule 3',
      date: '23 Oct 2026',
    },
  ];

  // Video items
  const videoStories = [
    {
      title: 'Behind the Scenes on the High-Speed Electric Train: Dar to Dodoma in 3 Hours',
      description: 'Correspondent Juma Mwamburi rides inside the driver cab of the newly commissioned TRC electric locomotive crossing the Morogoro escarpment.',
      duration: '4:20',
      category: 'Tanzania',
      image: '/src/assets/images/hero_lead_tanzania_rail_1793043305338.jpg',
    },
    {
      title: 'How Dar es Salaam Harbour Deepened Its Channel to Welcome Post-Panamax Giants',
      description: 'Exclusive 4K drone cinematography showcasing 24-hour quay crane logistics and the new container berths at Kurasini.',
      duration: '5:45',
      category: 'Business',
      image: '/src/assets/images/news_dar_skyline_port_1793043304700.jpg',
    },
    {
      title: 'Inside the Kariakoo Derby: 60,000 Fans, Drums, and 90 Minutes of Passion',
      description: 'Documentary footage following Simba SC and Yanga SC fans from the bustling markets of Kariakoo to the Benjamin Mkapa Stadium.',
      duration: '6:12',
      category: 'Sport',
      image: '/src/assets/images/news_sports_derby_1793043306272.jpg',
    },
    {
      title: 'Silicon Dar: The Young Developers Powering East Africa’s Mobile Payments',
      description: 'Meet three 24-year-old Tanzanian software founders whose micro-credit code runs across three countries.',
      duration: '3:50',
      category: 'Technology',
      image: '/src/assets/images/news_tech_innovation_1793043306761.jpg',
    },
    {
      title: 'Sounds of Swahili: How Bongo Flava Artists Blend Taarab With Global Rhythms',
      description: 'Studio session in Kinondoni and stone town Zanzibar tracing the poetic roots of modern Swahili pop music.',
      duration: '5:10',
      category: 'Culture',
      image: '/src/assets/images/news_bongo_culture_1793043307640.jpg',
    },
  ];

  // Weather data
  const regionalWeather = [
    { city: 'Dar es Salaam', temp: '29°C', condition: 'Humid & Sunny', high: '32°C', low: '24°C', rain: '15%', wind: '18 km/h' },
    { city: 'Dodoma', temp: '27°C', condition: 'Dry & Breezy', high: '30°C', low: '18°C', rain: '5%', wind: '22 km/h' },
    { city: 'Arusha', temp: '22°C', condition: 'Partly Cloudy', high: '25°C', low: '14°C', rain: '20%', wind: '12 km/h' },
    { city: 'Mwanza', temp: '26°C', condition: 'Lake Breeze / Light Showers', high: '28°C', low: '19°C', rain: '40%', wind: '15 km/h' },
    { city: 'Zanzibar (Unguja)', temp: '29°C', condition: 'Coastal Sunshine', high: '31°C', low: '25°C', rain: '10%', wind: '20 km/h' },
    { city: 'Mbeya', temp: '19°C', condition: 'Cool Highlands', high: '23°C', low: '11°C', rain: '25%', wind: '14 km/h' },
    { city: 'Tanga', temp: '28°C', condition: 'Warm & Fair', high: '31°C', low: '23°C', rain: '15%', wind: '16 km/h' },
    { city: 'Kilimanjaro / Moshi', temp: '21°C', condition: 'Misty Mornings', high: '24°C', low: '13°C', rain: '30%', wind: '10 km/h' },
    { city: 'Kigoma', temp: '27°C', condition: 'Warm Lake Tanganyika', high: '29°C', low: '20°C', rain: '20%', wind: '11 km/h' },
  ];

  // 1. VERIFY PAGE (BBC Verify style)
  if (pageId === 'verify') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* BBC Verify Header */}
        <div className="bg-[#121212] text-white p-6 sm:p-8 rounded-xs mb-8">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-sans font-bold uppercase tracking-widest mb-2">
            <CheckCircle className="w-4 h-4" />
            <span>The Sun Verify</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-white mb-3">
            VERIFY: Truth, Evidence & Fact-Checking
          </h1>
          <p className="text-sm sm:text-base font-sans text-stone-300 max-w-3xl leading-relaxed">
            Our specialized forensics and verification bureau analyzes viral social claims, political speeches, and purported leaks across Tanzania and East Africa using open-source intelligence, satellite imagery, and primary documentation.
          </p>
        </div>

        {/* Fact checks grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-sans font-bold text-stone-900 border-b-2 border-stone-900 pb-2">
            Latest Forensic Fact-Checks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verifyItems.map(item => (
              <div key={item.id} className="p-6 bg-white border border-stone-200 rounded-xs shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-stone-400">{item.date}</span>
                    <span className={`px-2.5 py-1 text-xs font-sans font-black uppercase tracking-wider rounded-2xs border ${item.verdictColor}`}>
                      Verdict: {item.verdict}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-base sm:text-lg text-stone-950 mb-2 leading-snug">
                    "{item.claim}"
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {item.explanation}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-stone-500">
                  <span className="truncate max-w-[250px]">Evidence: {item.source}</span>
                  <span className="font-bold text-[#BB1919]">Verified</span>
                </div>
              </div>
            ))}
          </div>

          {/* How we verify callout */}
          <div className="mt-10 p-6 bg-stone-50 border border-stone-200 rounded-xs">
            <h3 className="font-sans font-bold text-lg text-stone-900 mb-2">
              Our 4-Step Verification Standard
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-sans text-stone-700">
              <div className="p-3 bg-white border border-stone-200">
                <strong className="block text-stone-950 font-bold mb-1">1. Metadata Analysis</strong>
                <span>We inspect EXIF data, timestamp coordinates, and reverse-image indices to trace origin.</span>
              </div>
              <div className="p-3 bg-white border border-stone-200">
                <strong className="block text-stone-950 font-bold mb-1">2. Primary Records</strong>
                <span>All policy or financial claims are matched against certified Hansards or audit records.</span>
              </div>
              <div className="p-3 bg-white border border-stone-200">
                <strong className="block text-stone-950 font-bold mb-1">3. Satellite & Geolocation</strong>
                <span>Physical claims are cross-referenced with Sentinel and Landsat imagery.</span>
              </div>
              <div className="p-3 bg-white border border-stone-200">
                <strong className="block text-stone-950 font-bold mb-1">4. Right of Reply</strong>
                <span>All cited entities are given immediate opportunity to clarify on the record.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. VIDEO PAGE (BBC Video Hub)
  if (pageId === 'video') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-stone-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#BB1919] inline-block" />
            <h1 className="text-2xl sm:text-3xl font-sans font-black uppercase text-stone-950 tracking-tight">
              The Sun Video: Watch & Documentaries
            </h1>
          </div>
          <span className="text-xs font-sans font-bold text-stone-400 uppercase tracking-widest hidden sm:inline">
            In-Depth Visual Journalism
          </span>
        </div>

        {/* Lead Video Story */}
        <div
          onClick={() => setActiveVideo(videoStories[0])}
          className="relative bg-stone-950 text-white rounded-xs overflow-hidden cursor-pointer group mb-10 shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            <div className="lg:col-span-8 relative aspect-16/9 overflow-hidden">
              <img
                src={videoStories[0].image}
                alt={videoStories[0].title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                <div className="w-16 h-16 bg-[#BB1919] text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-2xs font-mono">
                ▶ {videoStories[0].duration}
              </div>
            </div>

            <div className="lg:col-span-4 p-6 sm:p-8">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-red-400 block mb-2">
                Featured Documentary · {videoStories[0].category}
              </span>
              <h2 className="text-xl sm:text-2xl font-sans font-black text-white group-hover:text-red-400 transition-colors leading-tight mb-3">
                {videoStories[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed mb-4">
                {videoStories[0].description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider bg-[#BB1919] px-4 py-2 rounded-xs">
                <span>Watch Full Report</span>
                &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Video Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoStories.slice(1).map((v, i) => (
            <div
              key={i}
              onClick={() => setActiveVideo(v)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 bg-stone-100 rounded-xs overflow-hidden mb-2.5">
                  <img
                    src={v.image}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 bg-[#BB1919] text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/85 text-white text-[11px] font-bold px-2 py-0.5 rounded-2xs font-mono">
                    {v.duration}
                  </div>
                </div>

                <span className="text-[11px] font-sans font-bold text-[#BB1919] uppercase tracking-wide block mb-1">
                  {v.category}
                </span>
                <h3 className="font-sans font-bold text-sm sm:text-base text-stone-950 group-hover:text-[#BB1919] transition-colors leading-snug line-clamp-2">
                  {v.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-stone-900 rounded-xs overflow-hidden shadow-2xl border border-stone-800">
              <div className="relative aspect-16/9 bg-black flex items-center justify-center">
                <img
                  src={activeVideo.image}
                  alt={activeVideo.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <div className="w-16 h-16 bg-[#BB1919] rounded-full flex items-center justify-center mb-3 animate-pulse">
                    <Play className="w-8 h-8 fill-white translate-x-0.5" />
                  </div>
                  <span className="text-xs uppercase font-mono tracking-widest text-stone-300">
                    Playing Video ({activeVideo.duration})
                  </span>
                  <p className="text-base font-bold mt-1 max-w-md">{activeVideo.title}</p>
                </div>
              </div>

              <div className="p-5 text-white flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-red-400 font-bold uppercase">{activeVideo.category}</span>
                  <h4 className="font-bold text-lg text-white mb-1">{activeVideo.title}</h4>
                  <p className="text-xs text-stone-400">{activeVideo.description}</p>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. AUDIO PAGE (BBC Radio / Dira ya Dunia style)
  if (pageId === 'audio') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-stone-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#BB1919] inline-block" />
            <h1 className="text-2xl sm:text-3xl font-sans font-black uppercase text-stone-950 tracking-tight">
              The Sun Audio: Radio Bulletins & Podcasts
            </h1>
          </div>
          <span className="text-xs font-sans font-bold text-stone-400 uppercase tracking-widest hidden sm:inline">
            Dira ya Leo Broadcast
          </span>
        </div>

        {/* Master Audio Live Player Strip */}
        <div className="bg-stone-950 text-white p-6 sm:p-8 rounded-xs mb-10 shadow-lg border border-stone-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-14 h-14 bg-[#BB1919] hover:bg-red-700 text-white rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-lg transition-transform hover:scale-105"
                aria-label={isPlayingAudio ? 'Pause bulletin' : 'Play bulletin'}
              >
                {isPlayingAudio ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white translate-x-0.5" />}
              </button>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 mb-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'ON AIR NOW' : 'DAILY AUDIO BULLETIN'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-sans font-black text-white">{activeEpisode}</h2>
                <p className="text-xs text-stone-400">
                  Produced in Dar es Salaam Newsroom · Broadcaster: Baraka Emmanuel (14 mins)
                </p>
              </div>
            </div>

            {/* Play progress */}
            <div className="w-full md:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-stone-400">
                <span>03:45</span>
                <span>14:00</span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#BB1919] h-full transition-all duration-300"
                  style={{ width: `${isPlayingAudio ? 45 : audioProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audio Episodes Catalog */}
        <div className="space-y-4">
          <h3 className="font-sans font-bold text-lg text-stone-900 border-b border-stone-200 pb-2">
            Recent Audio Bulletins & Interviews
          </h3>

          {[
            {
              title: 'Dira ya Asubuhi: Matokeo ya Reli ya SGR na Uchumi wa Bandari ya Dar',
              date: '26 Oct 2026',
              duration: '14:20',
              host: 'Fatma Said',
            },
            {
              title: 'Uchambuzi wa Michezo: Mbinu za Simba vs Yanga Mkapa Stadium',
              date: '25 Oct 2026',
              duration: '18:40',
              host: 'Baraka Emmanuel',
            },
            {
              title: 'Mazungumzo Maalum: Waziri wa Uchukuzi Azungumzia Njia Mpya za Reli za Maziwa Makuu',
              date: '24 Oct 2026',
              duration: '22:15',
              host: 'Juma Mwamburi',
            },
            {
              title: 'Bongo Flava Global: Mahojiano na Watayarishaji wa Muziki Dar es Salaam',
              date: '23 Oct 2026',
              duration: '16:05',
              host: 'Neema Kessy',
            },
          ].map((ep, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveEpisode(ep.title);
                setIsPlayingAudio(true);
              }}
              className="p-4 bg-white border border-stone-200 hover:border-[#BB1919] transition-colors rounded-xs flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-100 group-hover:bg-[#BB1919] group-hover:text-white rounded-full flex items-center justify-center text-stone-700 transition-colors shrink-0">
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#BB1919] transition-colors">
                    {ep.title}
                  </h4>
                  <span className="text-xs text-stone-500 font-sans">
                    Presenter: {ep.host} · {ep.date}
                  </span>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-stone-500 shrink-0">
                {ep.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. WEATHER PAGE (BBC Weather Center)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-stone-900">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-[#BB1919] inline-block" />
          <h1 className="text-2xl sm:text-3xl font-sans font-black uppercase text-stone-950 tracking-tight">
            The Sun Weather: Tanzania Regional Forecasts
          </h1>
        </div>
        <span className="text-xs font-sans font-bold text-stone-400 uppercase tracking-widest hidden sm:inline">
          TMA Accredited Telemetry
        </span>
      </div>

      {/* Featured Dar es Salaam Banner */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
            Current Station: Dar es Salaam, Julius Nyerere International Airport
          </span>
          <h2 className="text-4xl sm:text-5xl font-sans font-black">29°C</h2>
          <p className="text-sm text-stone-300 font-sans mt-1">Humid & Coastal Sunshine · High: 32°C / Low: 24°C</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs font-sans border-t md:border-t-0 md:border-l border-stone-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="text-stone-400 block mb-0.5">Precipitation:</span>
            <span className="font-bold text-base text-white">15%</span>
          </div>
          <div>
            <span className="text-stone-400 block mb-0.5">Humidity:</span>
            <span className="font-bold text-base text-white">78%</span>
          </div>
          <div>
            <span className="text-stone-400 block mb-0.5">Wind:</span>
            <span className="font-bold text-base text-white">18 km/h ENE</span>
          </div>
        </div>
      </div>

      {/* 9 Regional Cities Weather Grid */}
      <h3 className="font-sans font-bold text-lg text-stone-900 border-b border-stone-200 pb-2 mb-4">
        Regional City Conditions & 5-Day Outlook
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {regionalWeather.map((w, idx) => (
          <div key={idx} className="p-5 bg-white border border-stone-200 rounded-xs shadow-2xs hover:border-stone-400 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-sans font-bold text-base text-stone-950">{w.city}</h4>
              <span className="font-mono font-black text-2xl text-stone-900">{w.temp}</span>
            </div>
            <p className="text-xs text-stone-600 font-sans mb-3">{w.condition}</p>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-sans text-stone-500">
              <span>High: {w.high} · Low: {w.low}</span>
              <span>Rain: {w.rain}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
