import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { BBCSpecialPages } from './BBCSpecialPages';
import { PhoneInput } from './common/PhoneInput';
import { Mail, Phone, MapPin, CheckCircle2, Shield, AlertCircle, Briefcase, FileText, Send } from 'lucide-react';

interface StaticPagesProps {
  pageId: 'about' | 'contact' | 'policy' | 'privacy' | 'terms' | 'jobs' | 'verify' | 'video' | 'audio' | 'weather';
}

export const StaticPages: React.FC<StaticPagesProps> = ({ pageId }) => {
  const { setView, language } = useNews();

  // If one of the BBC special multimedia/forensics/weather pages, render BBCSpecialPages
  if (['verify', 'video', 'audio', 'weather'].includes(pageId)) {
    return <BBCSpecialPages pageId={pageId as 'verify' | 'video' | 'audio' | 'weather'} />;
  }

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactTopic, setContactTopic] = useState('News Tip / Whistleblower');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* 1. ABOUT US PAGE */}
      {pageId === 'about' && (
        <div className="space-y-8 font-sans text-stone-800 text-base leading-relaxed">
          <div className="border-b-2 border-stone-900 pb-4 mb-6">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#BB1919] block mb-1">
              Organization Profile
            </span>
            <h1 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-stone-950">
              About The Sun
            </h1>
            <p className="text-sm font-sans text-stone-500 mt-2">
              Sauti ya Ukweli na Maendeleo · Digital Daily Only
            </p>
          </div>

          <p className="first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-[#BB1919] text-lg text-stone-900">
            The Sun is a digital daily news publishing organization patterned on the gold-standard editorial principles of international public broadcasting. Headquartered in Dar es Salaam with news desks in Dodoma, Arusha, Mwanza, and Zanzibar, our mission is to provide accurate, unbiased, and verified journalism covering Tanzania, the East African Community, and world affairs.
          </p>

          <h3 className="font-sans font-bold text-2xl text-stone-950 pt-4 border-b border-stone-200">
            Our Core Principles
          </h3>
          <ul className="space-y-3 font-sans text-sm text-stone-700">
            <li className="flex items-start gap-2">
              <span className="text-[#BB1919] font-bold">1. Truth and Accuracy:</span>
              <span>We do not publish unverified rumors. Every factual claim is corroborated by at least two verified primary sources.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#BB1919] font-bold">2. Public Interest & Impartiality:</span>
              <span>We provide balanced reporting that gives voice to diverse perspectives without political patronage or corporate advertiser interference.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#BB1919] font-bold">3. Forensic Fact-Checking:</span>
              <span>Through our Sun Verify unit, we actively combat disinformation across social networks.</span>
            </li>
          </ul>

          <h3 className="font-sans font-bold text-2xl text-stone-950 pt-4 border-b border-stone-200">
            Newsroom Bureaus
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs text-stone-600">
            <div className="p-4 bg-stone-50 border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm mb-1">Dar es Salaam Main Newsroom</h4>
              <p>Samora Avenue & Ohio Street, Central Business District</p>
              <p className="mt-1 text-stone-500">Focus: Maritime trade, financial markets, tech startups, arts.</p>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm mb-1">Dodoma Legislative Bureau</h4>
              <p>Parliament Square, Makole Ward, Dodoma</p>
              <p className="mt-1 text-stone-500">Focus: National Assembly, policy reform, civil service recruitments.</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACT US PAGE */}
      {pageId === 'contact' && (
        <div className="space-y-8">
          <div className="border-b-2 border-stone-900 pb-4 mb-6">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#BB1919] block mb-1">
              Direct Inquiries & News Tips
            </span>
            <h1 className="font-sans font-black text-3xl sm:text-4xl text-stone-950">
              Contact The Sun
            </h1>
            <p className="text-sm font-sans text-stone-500 mt-2">
              Have a confidential scoop, inquiry, or correction? Reach out to our editors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-4 font-sans text-xs text-stone-700">
              <div className="p-5 bg-stone-50 border border-stone-200 rounded-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#BB1919] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 text-sm">Headquarters</strong>
                    <span>Samora Avenue, 4th Floor, P.O. Box 7892, Dar es Salaam, Tanzania</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#BB1919] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 text-sm">Phone Hotlines</strong>
                    <span>+255 22 211 4500 (Newsroom Desk)</span>
                    <span className="block text-stone-500">+255 754 112 000 (WhatsApp Secure Line)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#BB1919] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 text-sm">Email Desks</strong>
                    <span>newsroom@thesun.co.tz</span>
                    <span className="block text-stone-500">ads@thesun.co.tz</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 text-stone-800 rounded-xs">
                <span className="font-bold text-[#BB1919] block mb-1 text-xs">Whistleblower Protection</span>
                <p className="text-[11px] leading-relaxed">
                  We rigorously defend the confidentiality of our sources in full compliance with international journalistic protections.
                </p>
              </div>
            </div>

            <div className="md:col-span-7">
              <form onSubmit={handleContactSubmit} className="p-6 bg-white border border-stone-200 rounded-xs space-y-4">
                <h3 className="font-sans font-bold text-xl text-stone-900">
                  Send a Direct Message
                </h3>

                {contactSent && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xs flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your message has been securely submitted to the news desk. We will respond within 24 hours.</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="E.g. Juma Ally"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919]"
                  />
                </div>

                <div>
                  <PhoneInput
                    value={contactPhone}
                    onChange={full => setContactPhone(full)}
                    label="Phone / WhatsApp (Namba ya Simu)"
                    showQuickPresets={false}
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Subject / Department
                  </label>
                  <select
                    value={contactTopic}
                    onChange={e => setContactTopic(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs bg-white focus:outline-hidden focus:border-[#BB1919]"
                  >
                    <option value="News Tip">Confidential News Tip / Scoop</option>
                    <option value="Editorial Correction">Factual Correction Request</option>
                    <option value="Advertising">Advertising & Sponsored Partner</option>
                    <option value="Careers">Employment & Internship Inquiry</option>
                    <option value="General">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    placeholder="Describe your inquiry or tip with specific details..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-hidden focus:border-[#BB1919] font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#BB1919] hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit to Newsroom</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. EDITORIAL & FACT-CHECKING POLICY */}
      {pageId === 'policy' && (
        <div className="space-y-6 font-sans text-stone-800 text-base leading-relaxed">
          <div className="border-b-2 border-stone-900 pb-4 mb-6">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#BB1919] block mb-1">
              Ethical Standards & Verification
            </span>
            <h1 className="font-sans font-black text-3xl sm:text-4xl text-stone-950">
              Editorial Policy & Verification
            </h1>
            <p className="text-sm font-sans text-stone-500 mt-2">
              Our pledge of impartiality, multi-source corroboration, and accountability.
            </p>
          </div>

          <p>
            The Sun operates under rigorous editorial independence guidelines inspired by the BBC Editorial Guidelines. Our reporting serves the general public with verified, impartial facts.
          </p>

          <h3 className="font-sans font-bold text-2xl text-stone-950 pt-2 border-b border-stone-200">
            Fact-Checking Workflow
          </h3>
          <p className="font-sans text-sm text-stone-700 leading-relaxed">
            Prior to publication, each article undergoes rigorous verification by department editors. Numerical figures, regulatory citations, company reports, and court records are cross-checked against primary documentation.
          </p>

          <h3 className="font-sans font-bold text-2xl text-stone-950 pt-2 border-b border-stone-200">
            Corrections Policy
          </h3>
          <p className="font-sans text-sm text-stone-700 leading-relaxed">
            When errors occur, we correct them transparently and promptly with an explicit note at the bottom of the article detailing the update and timestamp.
          </p>
        </div>
      )}

      {/* 4. PRIVACY POLICY */}
      {pageId === 'privacy' && (
        <div className="space-y-6 font-sans text-stone-800 text-base leading-relaxed">
          <div className="border-b-2 border-stone-900 pb-4 mb-6">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#BB1919] block mb-1">
              Data Protection
            </span>
            <h1 className="font-sans font-black text-3xl sm:text-4xl text-stone-950">
              Privacy Policy
            </h1>
            <p className="text-sm font-sans text-stone-500 mt-2">
              Last updated: October 2026 · Compliant with Tanzania PDPA
            </p>
          </div>

          <p>
            The Sun respects reader privacy. We do not require registration to read articles. We collect only necessary telemetry to measure article viewership and maintain fast delivery.
          </p>

          <h4 className="font-sans font-bold text-xl text-stone-900">1. Information We Collect</h4>
          <p className="font-sans text-xs sm:text-sm text-stone-700">
            - Newsletter subscriptions: Your email address, stored solely for morning email dispatches.
            <br />
            - Bookmarks & Reading preferences: Stored entirely client-side in your local web browser localStorage.
          </p>

          <h4 className="font-sans font-bold text-xl text-stone-900">2. Cookies & Advertising</h4>
          <p className="font-sans text-xs sm:text-sm text-stone-700">
            We display non-intrusive banner spaces. When Google AdSense or compliant partner networks are enabled, third-party cookies may be used in accordance with Google privacy policies.
          </p>
        </div>
      )}

      {/* 5. TERMS OF USE */}
      {pageId === 'terms' && (
        <div className="space-y-6 font-sans text-stone-800 text-base leading-relaxed">
          <div className="border-b-2 border-stone-900 pb-4 mb-6">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#BB1919] block mb-1">
              Legal Agreement
            </span>
            <h1 className="font-sans font-black text-3xl sm:text-4xl text-stone-950">
              Terms of Use
            </h1>
            <p className="text-sm font-sans text-stone-500 mt-2">
              Intellectual property, syndication rights, and acceptable use.
            </p>
          </div>

          <p>
            All articles, investigative reports, photographic assets, and original illustrations published on The Sun are protected by copyright law under The Sun Media Group Ltd.
          </p>
        </div>
      )}

      {/* 6. JOBS & OPPORTUNITIES BOARD */}
      {pageId === 'jobs' && (
        <div className="space-y-6">
          <div className="border-b-2 border-stone-900 pb-4 mb-6">
            <div className="flex items-center gap-2 text-[#BB1919] text-xs font-sans font-bold uppercase tracking-widest mb-1">
              <Briefcase className="w-4 h-4" />
              <span>National Career & Tender Board</span>
            </div>
            <h1 className="font-sans font-black text-3xl sm:text-4xl text-stone-950">
              Jobs & Opportunities (Nafasi za Kazi)
            </h1>
            <p className="text-sm font-sans text-stone-500 mt-2">
              Verified public sector (UTUMISHI), corporate career openings, NGO consultancies, and academic grants across Tanzania.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-white border border-stone-200 hover:border-[#BB1919] transition-colors rounded-xs shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#BB1919]">
                  Government of Tanzania · UTUMISHI
                </span>
                <span className="text-[11px] font-mono text-stone-400">Deadline: 20 Nov 2026</span>
              </div>
              <h3 className="font-sans font-bold text-xl text-stone-950 mb-1">
                12,500 Civil Service Vacancies: Secondary School Teachers, Nurses & Clinical Officers
              </h3>
              <p className="text-xs font-sans text-stone-600 mb-3">
                Location: Nationwide across all 31 administrative regions. Permanent and pensionable terms through the Public Service Recruitment Secretariat.
              </p>
              <div className="flex items-center justify-between text-xs font-sans pt-2 border-t border-stone-100">
                <span className="text-stone-500">Apply via ajira.go.tz</span>
                <button
                  onClick={() => setView({ type: 'article', slug: 'utumishi-announces-12000-civil-service-vacancies-across-districts' })}
                  className="font-bold text-[#BB1919] hover:underline"
                >
                  Read Full Circular &rarr;
                </button>
              </div>
            </div>

            <div className="p-5 bg-white border border-stone-200 hover:border-[#BB1919] transition-colors rounded-xs shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-emerald-700">
                  Higher Education · UDSM & NM-AIST
                </span>
                <span className="text-[11px] font-mono text-stone-400">Deadline: 15 Dec 2026</span>
              </div>
              <h3 className="font-sans font-bold text-xl text-stone-950 mb-1">
                5,000 Fully Funded STEM & AI Research Fellowships for East African Scholars
              </h3>
              <p className="text-xs font-sans text-stone-600 mb-3">
                Location: Dar es Salaam & Arusha. Covers full tuition, monthly stipend, and laboratory computing grants.
              </p>
              <div className="flex items-center justify-between text-xs font-sans pt-2 border-t border-stone-100">
                <span className="text-stone-500">Apply via university research portal</span>
                <button
                  onClick={() => setView({ type: 'article', slug: 'tanzania-universities-launch-free-ai-stem-fellowships' })}
                  className="font-bold text-[#BB1919] hover:underline"
                >
                  View Eligibility Details &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
