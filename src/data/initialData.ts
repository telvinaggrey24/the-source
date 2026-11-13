import {
  Article,
  Category,
  Subscriber,
  AdBanner,
  Author,
  MediaItem,
  UserProfile,
  AdminActivityLog,
  WebsiteAppearanceSettings,
  WebsiteSettings,
} from '../types';

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 'auth_source',
    name: 'THE SOURCE',
    title: 'Newsroom',
    avatar:
      'https://images.unsplash.com/photo-1504711435509-084227bb48b6?auto=format&fit=crop&w=400&h=400&q=80',
    bio: 'Habari asili kutoka newsroom ya THE SOURCE.',
    location: 'Dar es Salaam',
    joinedYear: '2026',
  },
];

/** Public nav / homepage desks — keep this short and professional. */
export const PRIMARY_CATEGORY_SLUGS = [
  'politics',
  'business',
  'international',
  'sports',
  'technology',
  'entertainment',
] as const;

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_politics',
    name: 'Politics',
    nameSwahili: 'Siasa',
    slug: 'politics',
    description: 'Governance, parliament, elections, and public policy across Tanzania and East Africa.',
    accentColor: '#991B1B',
    isActive: true,
  },
  {
    id: 'cat_business',
    name: 'Business',
    nameSwahili: 'Biashara',
    slug: 'business',
    description: 'Markets, corporate finance, trade, banking, and the regional economy.',
    accentColor: '#047857',
    isActive: true,
  },
  {
    id: 'cat_international',
    name: 'World',
    nameSwahili: 'Kimataifa',
    slug: 'international',
    description: 'East Africa and international affairs.',
    accentColor: '#475569',
    isActive: true,
  },
  {
    id: 'cat_sports',
    name: 'Sport',
    nameSwahili: 'Michezo',
    slug: 'sports',
    description: 'Football, athletics, and multi-sport coverage.',
    accentColor: '#0284C7',
    isActive: true,
  },
  {
    id: 'cat_technology',
    name: 'Tech',
    nameSwahili: 'Teknolojia',
    slug: 'technology',
    description: 'Telecom, startups, AI, and the digital economy.',
    accentColor: '#2563EB',
    isActive: true,
  },
  {
    id: 'cat_entertainment',
    name: 'Culture',
    nameSwahili: 'Burudani',
    slug: 'entertainment',
    description: 'Film, music, television, and lifestyle.',
    accentColor: '#D97706',
    isActive: true,
  },
  // Legacy desks — CMS only, hidden from public nav
  {
    id: 'cat_football',
    name: 'Football',
    slug: 'football',
    description: 'Merged into Sport for public navigation.',
    accentColor: '#16A34A',
    isActive: false,
  },
  {
    id: 'cat_music',
    name: 'Music',
    slug: 'music',
    description: 'Merged into Culture for public navigation.',
    accentColor: '#7C3AED',
    isActive: false,
  },
  {
    id: 'cat_jobs',
    name: 'Jobs',
    slug: 'jobs',
    description: 'Careers desk — CMS only.',
    accentColor: '#0D9488',
    isActive: false,
  },
];

/** Demo articles removed — live NewsData/NewsAPI wire fills the site. */
export const INITIAL_ARTICLES: Article[] = [];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [];

export const INITIAL_ADS: AdBanner[] = [
  {
    id: 'ad_leaderboard',
    slot: 'header_leaderboard',
    title: 'Homepage Leaderboard',
    sponsorName: '',
    imageUrl: '',
    targetUrl: '',
    isActive: false,
    impressions: 0,
    clicks: 0,
  },
  {
    id: 'ad_sidebar',
    slot: 'sidebar_rectangle',
    title: 'Sidebar',
    sponsorName: '',
    imageUrl: '',
    targetUrl: '',
    isActive: false,
    impressions: 0,
    clicks: 0,
  },
  {
    id: 'ad_footer',
    slot: 'footer_strip',
    title: 'Footer Strip',
    sponsorName: '',
    imageUrl: '',
    targetUrl: '',
    isActive: false,
    impressions: 0,
    clicks: 0,
  },
];

export const INITIAL_MEDIA: MediaItem[] = [];

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  {
    id: 'usr_admin_1',
    name: 'Website Administrator',
    email: 'telvinaggrey24@gmail.com',
    role: 'admin',
    status: 'active',
    isSubscriber: true,
    isDonor: false,
    registeredAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
];

export const INITIAL_ACTIVITY_LOGS: AdminActivityLog[] = [];

export const INITIAL_APPEARANCE_SETTINGS: WebsiteAppearanceSettings = {
  siteName: 'THE SOURCE',
  siteTagline: 'REAL NEWS • REAL PEOPLE • REAL IMPACT',
  siteLogoText: 'THE SOURCE',
  siteLogoUrl: '/assets/logo.png',
  primaryColor: '#BB1919',
  breakingNewsEnabled: true,
  breakingNewsTicker: 'LIVE WIRE: Loading latest headlines from Tanzania and East Africa…',
  featuredStoryId: '',
  footerBio:
    'THE SOURCE delivers live East African headlines via the news wire, with links to original publishers for full reports.',
  socialLinks: {
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    whatsapp: 'https://wa.me/255754112000',
  },
  contactEmail: 'editor@thesource.co.tz',
  contactPhone: '+255 22 211 4500',
  newsroomAddress: 'Dar es Salaam, Tanzania',
};

export const INITIAL_WEBSITE_SETTINGS: WebsiteSettings = {
  maintenanceMode: false,
  editorialPolicy:
    'Wire headlines are syndicated from NewsData.io and NewsAPI.org. Full articles remain on the original publisher’s site. THE SOURCE links out for complete reporting.',
  privacyPolicy:
    'We respect reader privacy. We do not sell personal data to third parties.',
  termsConditions:
    'Headlines and snippets are provided for informational purposes. Copyright remains with the original publishers.',
  newsletterEnabled: true,
  googleAdSenseSlot: '',
  defaultMetaTitle: 'THE SOURCE — Live Tanzania & East Africa News',
  defaultMetaDescription:
    'Live headlines from Tanzania and East Africa via the news wire, with links to original publishers.',
  canonicalBaseUrl: 'https://thesource.co.tz',
};
