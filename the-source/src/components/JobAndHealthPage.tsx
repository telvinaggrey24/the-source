import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import {
  HeartPulse,
  Briefcase,
  Search,
  Filter,
  Calendar,
  MapPin,
  CheckCircle2,
  Building2,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const JobAndHealthPage: React.FC = () => {
  const { setView, language, articles } = useNews();
  const [filterRole, setFilterRole] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Curated verified Tanzanian health & medical opportunities
  const healthJobVacancies = [
    {
      id: 'hjob_1',
      title: 'Senior Medical Officers & Resident Pediatric Cardiologists (18 Posts)',
      organization: 'Jakaya Kikwete Cardiac Institute (JKCI) / UTUMISHI',
      location: 'Dar es Salaam (Upanga)',
      type: 'Permanent & Pensionable',
      deadline: '28 Nov 2026',
      salary: 'TGHS G / H Government Scale',
      category: 'medical',
      description: 'Specialized clinical care for congenital heart diseases, catheterization laboratory operations, and post-operative intensive care monitoring.',
      requirements: 'MD degree, MMed in Pediatrics/Cardiology, full registration with Medical Council of Tanganyika (MCT).',
      applyUrl: 'https://ajira.go.tz',
    },
    {
      id: 'hjob_2',
      title: 'Registered Nursing Officers & Midwives (450 Vacancies)',
      organization: 'Ministry of Health / Regional Referral Hospitals',
      location: 'Nationwide (Dodoma, Mwanza, Mbeya, Tanga, Kigoma)',
      type: 'Permanent Public Service',
      deadline: '20 Nov 2026',
      salary: 'TGHS C Scale',
      category: 'nursing',
      description: 'Direct bedside patient care, maternal and neonatal health services, emergency triage, and universal health insurance digital record keeping.',
      requirements: 'Diploma or Bachelor of Science in Nursing & Midwifery, valid license from Tanzania Nursing and Midwives Council (TNMC).',
      applyUrl: 'https://ajira.go.tz',
    },
    {
      id: 'hjob_3',
      title: 'Public Health Epidemiologist & Disease Surveillance Officers (12 Posts)',
      organization: 'National Institute for Medical Research (NIMR) & CDC Partner',
      location: 'Dodoma / Arusha',
      type: '2-Year Renewable Contract',
      deadline: '15 Dec 2026',
      salary: 'Competitive International NGO Scale',
      category: 'epidemiology',
      description: 'Field epidemiological surveillance, outbreak investigation protocols, genomic pathogen tracking, and district clinical training.',
      requirements: 'Master of Public Health (MPH) or MSc in Epidemiology, 3+ years experience with statistical software (R, STATA).',
      applyUrl: 'https://nimr.or.tz',
    },
    {
      id: 'hjob_4',
      title: 'Biomedical Equipment Engineers & Medical Imaging Technicians (35 Posts)',
      organization: 'Tanzania Rural and Urban Health Facilities Agency (TRUHA)',
      location: 'Districts across Mainland Tanzania',
      type: 'Permanent',
      deadline: '25 Nov 2026',
      salary: 'TGS E Scale',
      category: 'engineering',
      description: 'Maintenance, calibration, and repair of newly installed CT scan units, solar medical cold-chains, and ultrasound systems.',
      requirements: 'BSc in Biomedical Engineering or Electrical Engineering, ERB registration.',
      applyUrl: 'https://ajira.go.tz',
    },
    {
      id: 'hjob_5',
      title: 'Clinical Pharmacists & Medical Supply Chain Supervisors',
      organization: 'Medical Stores Department (MSD) Tanzania',
      location: 'Dar es Salaam & Zonal Warehouses',
      type: 'Full-Time Corporate',
      deadline: '05 Dec 2026',
      salary: 'MSD Salary Band 5',
      category: 'pharmacy',
      description: 'Essential medicines inventory forecasting, digital cold-chain warehouse audits, and hospital distribution logistics.',
      requirements: 'Bachelor of Pharmacy (B.Pharm), registered with Pharmacy Council of Tanzania.',
      applyUrl: 'https://msd.go.tz',
    },
    {
      id: 'hjob_6',
      title: 'Community Health Program Managers (Maternal & Child Health)',
      organization: 'Amref Health Africa in Tanzania',
      location: 'Mara & Simiyu Regions',
      type: 'Contract',
      deadline: '10 Dec 2026',
      salary: 'NGO Benchmark',
      category: 'public_health',
      description: 'Leading grassroots village health worker networks, nutritional interventions, and adolescent reproductive health programs.',
      requirements: 'Degree in Public Health, Sociology, or Community Development with 5 years field experience.',
      applyUrl: 'https://amref.org',
    },
  ];

  // Related news stories for health and careers
  const healthArticles = articles.filter(
    a => (a.categoryId === 'cat_health' || a.categoryId === 'cat_jobs') && a.status === 'published'
  );

  // Filter vacancies
  const filteredVacancies = healthJobVacancies.filter(job => {
    if (filterRole !== 'all' && job.category !== filterRole) return false;
    if (filterRegion !== 'all' && !job.location.toLowerCase().includes(filterRegion.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.organization.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 font-sans">
      {/* BBC-style Marquee Header */}
      <div className="bg-[#121212] text-white p-6 sm:p-10 rounded-xs mb-8 border-l-4 border-[#BB1919] shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase tracking-widest">
            <HeartPulse className="w-4 h-4 text-[#BB1919]" />
            <span>National Health & Employment Hub</span>
          </div>
          <span className="text-xs font-mono text-stone-400">
            Updated: 26 October 2026 · Ministry of Health / UTUMISHI
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-white mb-3">
          JOB & HEALTH: Healthcare Vacancies, Medical Tenders & Public Health
        </h1>

        <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
          Comprehensive official clearinghouse for medical doctor recruitments, registered nurse vacancies, biomedical engineering tenders, and universal healthcare workforce opportunities across all 31 regions of Tanzania.
        </p>

        {/* Quick stat highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-800 text-xs">
          <div>
            <span className="text-stone-400 block text-[11px] uppercase">Active Health Posts</span>
            <span className="font-mono font-black text-2xl text-white">4,820+</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px] uppercase">Public Sector (UTUMISHI)</span>
            <span className="font-mono font-black text-2xl text-white">100% Verified</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px] uppercase">Universal Health Insured</span>
            <span className="font-mono font-black text-2xl text-emerald-400">Full Coverage</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px] uppercase">Official Portal Fee</span>
            <span className="font-mono font-black text-2xl text-white">0 TZS (Free)</span>
          </div>
        </div>
      </div>

      {/* Safety Warning Notice against Job Scams */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xs mb-8 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5 text-sm text-amber-950">
            Official Anti-Fraud Verification Alert:
          </strong>
          <span>
            Government health recruitment through the Public Service Recruitment Secretariat (PSRS / UTUMISHI) is completely free of charge. Never send mobile money (M-Pesa, Airtel Money, Tigo Pesa) to any agent offering placement guarantees.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 p-4 sm:p-5 rounded-xs mb-8 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by specialty, hospital, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-2xs focus:outline-hidden focus:border-[#BB1919]"
            />
          </div>

          {/* Profession Filter */}
          <div className="md:col-span-3">
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-2xs bg-white focus:outline-hidden focus:border-[#BB1919] font-medium"
            >
              <option value="all">All Health Disciplines</option>
              <option value="medical">Medical Doctors & Surgeons</option>
              <option value="nursing">Registered Nurses & Midwives</option>
              <option value="epidemiology">Epidemiology & Research</option>
              <option value="engineering">Biomedical Engineering</option>
              <option value="pharmacy">Pharmacy & Logistics</option>
              <option value="public_health">Public Health Managers</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="md:col-span-3">
            <select
              value={filterRegion}
              onChange={e => setFilterRegion(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-2xs bg-white focus:outline-hidden focus:border-[#BB1919] font-medium"
            >
              <option value="all">All Tanzania Locations</option>
              <option value="Dar es Salaam">Dar es Salaam</option>
              <option value="Dodoma">Dodoma</option>
              <option value="Mwanza">Mwanza</option>
              <option value="Arusha">Arusha</option>
              <option value="Zanzibar">Zanzibar</option>
              <option value="Nationwide">Nationwide Rural Posts</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="md:col-span-1 text-right">
            <button
              onClick={() => {
                setFilterRole('all');
                setFilterRegion('all');
                setSearchQuery('');
              }}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-2xs transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Vacancy Feed (8 cols) + Health Policy & Reports (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vacancy Postings */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-stone-900">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#BB1919] inline-block" />
              <h2 className="text-xl font-black uppercase text-stone-950">
                Current Health & Medical Openings ({filteredVacancies.length})
              </h2>
            </div>
            <span className="text-xs text-stone-400 font-mono">UTUMISHI & Accredited Partners</span>
          </div>

          {filteredVacancies.length === 0 ? (
            <div className="p-12 text-center bg-stone-50 border border-stone-200 rounded-xs">
              <p className="font-bold text-base text-stone-800 mb-1">No vacancies match your criteria</p>
              <p className="text-xs text-stone-500">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            filteredVacancies.map(job => (
              <div
                key={job.id}
                className="p-5 sm:p-6 bg-white border border-stone-200 hover:border-[#BB1919] transition-colors rounded-xs shadow-2xs group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#BB1919]">
                      {job.organization}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-2xs font-medium">
                      {job.type}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-red-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Deadline: {job.deadline}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-stone-950 group-hover:text-[#BB1919] transition-colors leading-snug mb-2">
                  {job.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                  {job.description}
                </p>

                <div className="p-3 bg-stone-50 border border-stone-100 rounded-2xs text-xs text-stone-700 mb-4 space-y-1">
                  <div>
                    <strong className="text-stone-900">Key Qualifications:</strong> {job.requirements}
                  </div>
                  <div>
                    <strong className="text-stone-900">Remuneration:</strong> {job.salary}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{job.location}</span>
                  </div>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#BB1919] hover:bg-red-800 text-white font-bold uppercase tracking-wider rounded-2xs transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Apply via Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Health Sector Policies & Latest Journalism */}
        <div className="lg:col-span-4 space-y-6">
          {/* Universal Health Insurance Guide */}
          <div className="bg-stone-50 border border-stone-200 p-5 rounded-xs">
            <div className="flex items-center gap-1.5 text-xs text-[#BB1919] font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>National Policy Roadmap</span>
            </div>
            <h4 className="font-bold text-base text-stone-900 mb-2 leading-snug">
              How Universal Health Insurance (UHI) Is Creating 15,000 New Medical Jobs
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              The parliament-enacted Universal Health Insurance bill expands health facilities in rural wards, funding permanent recruitment of community midwives, laboratory technologists, and pharmaceutical officers.
            </p>
            <button
              onClick={() => setView({ type: 'article', slug: 'parliament-dodoma-approves-universal-health-insurance-bill' })}
              className="text-xs font-bold text-[#BB1919] hover:underline uppercase inline-flex items-center gap-1"
            >
              <span>Read Full Legislative Analysis</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Cardiac Surgery Breakthrough Spotlight */}
          <div className="bg-white border border-stone-200 p-5 rounded-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              Clinical Excellence Spotlight
            </span>
            <h4 className="font-bold text-base text-stone-900 mb-1 leading-snug">
              Jakaya Kikwete Cardiac Institute: 98% Pediatric Surgical Success
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed mb-3">
              Learn how homegrown surgical specialists trained at MUHAS are leading complex catheterization and open-heart surgeries without overseas medical missions.
            </p>
            <button
              onClick={() => setView({ type: 'article', slug: 'muhimbili-mloganzila-breakthrough-pediatric-cardiac-surgery' })}
              className="text-xs font-bold text-[#BB1919] hover:underline uppercase inline-flex items-center gap-1"
            >
              <span>Read Hospital Report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Application Checklist */}
          <div className="bg-stone-900 text-white p-5 rounded-xs text-xs space-y-3">
            <h4 className="font-bold text-sm uppercase text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>UTUMISHI Application Checklist</span>
            </h4>
            <ul className="space-y-2 text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-[#BB1919] font-bold">✓</span>
                <span>Original academic certificates & NECTA index number.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#BB1919] font-bold">✓</span>
                <span>Valid professional council registration (MCT, TNMC, or Pharmacy Council).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#BB1919] font-bold">✓</span>
                <span>National Identification Authority (NIDA) number.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#BB1919] font-bold">✓</span>
                <span>Signed curriculum vitae with two professional referees.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
