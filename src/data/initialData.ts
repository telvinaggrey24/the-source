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
    id: 'auth_wire',
    name: 'Wire Desk',
    title: 'News Wire',
    avatar:
      'https://images.unsplash.com/photo-1504711435509-084227bb48b6?auto=format&fit=crop&w=400&h=400&q=80',
    bio: 'Live headlines for Tanzania and East Africa from the news wire.',
    location: 'Dar es Salaam',
    joinedYear: '2026',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_business',
    name: 'Business',
    slug: 'business',
    description: 'Markets, corporate finance, trade corridors, banking, and regional economic news.',
    accentColor: '#047857',
    isActive: true,
  },
  {
    id: 'cat_politics',
    name: 'Politics',
    slug: 'politics',
    description: 'Governance, parliament, elections, and public policy across Tanzania and East Africa.',
    accentColor: '#991B1B',
    isActive: true,
  },
  {
    id: 'cat_sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Athletics, basketball, boxing, and multi-sport coverage.',
    accentColor: '#0284C7',
    isActive: true,
  },
  {
    id: 'cat_football',
    name: 'Football',
    slug: 'football',
    description: 'Premier League, CAF competitions, Taifa Stars, and transfer news.',
    accentColor: '#16A34A',
    isActive: true,
  },
  {
    id: 'cat_entertainment',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Film, television, culture, and lifestyle.',
    accentColor: '#D97706',
    isActive: true,
  },
  {
    id: 'cat_music',
    name: 'Music',
    slug: 'music',
    description: 'Bongo Flava, releases, festivals, and artists.',
    accentColor: '#7C3AED',
    isActive: true,
  },
  {
    id: 'cat_jobs',
    name: 'Jobs',
    slug: 'jobs',
    description: 'Careers, recruitment, and workplace news.',
    accentColor: '#0D9488',
    isActive: true,
  },
  {
    id: 'cat_technology',
    name: 'Technology',
    slug: 'technology',
    description: 'Tech, telecom, startups, and digital economy.',
    accentColor: '#2563EB',
    isActive: true,
  },
  {
    id: 'cat_international',
    name: 'International',
    slug: 'international',
    description: 'East Africa and world affairs.',
    accentColor: '#475569',
    isActive: true,
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
    email: 'admin@thesource.co.tz',
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
