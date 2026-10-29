export type ArticleStatus = 'published' | 'draft' | 'scheduled';

export interface Author {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio?: string;
  location?: string;
  joinedYear?: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  specialties?: string[];
  education?: string;
  awards?: string[];
}

export type CommentStatus = 'approved' | 'pending' | 'rejected' | 'spam';

export interface ArticleComment {
  id: string;
  authorName: string;
  authorCity?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes?: number;
  parentId?: string;
  replies?: ArticleComment[];
  status?: CommentStatus;
  isReported?: boolean;
}

export interface ArticleReactions {
  insightful: number;
  inspiring: number;
  surprised: number;
  concerned: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;              // Primary headline (Swahili)
  titleEnglish?: string;      // English translation headline (down below)
  subtitle: string;           // Primary subtitle (Swahili)
  subtitleEnglish?: string;   // English translation subtitle
  summary: string;            // Primary summary (Swahili)
  summaryEnglish?: string;    // English translation summary (down below)
  content: string[];          // Primary content (Swahili)
  contentEnglish?: string[];  // English translation content (down below)
  keyTakeaways?: string[];    // Primary key takeaways (Swahili)
  keyTakeawaysEnglish?: string[]; // English key takeaways (down below)
  categoryId: string;
  categoryName: string;
  featuredImage: string;
  imageCaption: string;
  imageCredit: string;
  imageAltText?: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
  viewsCount: number;
  isBreaking: boolean;
  isFeaturedHero: boolean;
  isTrending: boolean;
  isEditorsPick: boolean;
  tags: string[];
  status: ArticleStatus;
  scheduledFor?: string;
  reactions: ArticleReactions;
  comments: ArticleComment[];
  commentsEnabled?: boolean;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoCanonicalUrl?: string;
  seoSocialImage?: string;
}

export interface Category {
  id: string;
  name: string;
  nameSwahili?: string;
  slug: string;
  description: string;
  accentColor: string;
  articleCount?: number;
  isActive?: boolean;
  imageUrl?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  preferredCategories: string[];
  frequency: 'daily' | 'weekly' | 'breaking_only';
}

export interface AdBanner {
  id: string;
  slot: 'header_leaderboard' | 'sidebar_rectangle' | 'in_article_mid' | 'footer_strip';
  title: string;
  sponsorName: string;
  imageUrl?: string;
  targetUrl: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  customHtml?: string;
  adSenseSlotId?: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'article'; slug: string }
  | { type: 'category'; categorySlug: string }
  | { type: 'author'; authorId: string }
  | { type: 'authors-directory' }
  | { type: 'search'; query?: string }
  | { type: 'page'; pageId: 'about' | 'contact' | 'policy' | 'privacy' | 'terms' | 'jobs' | 'verify' | 'video' | 'audio' | 'weather' | 'job-and-health' }
  | { type: 'admin' };

export type UserRole = 'admin' | 'editor' | 'reader';
export type UserStatus = 'active' | 'suspended';

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  isSubscriber: boolean;
  isDonor: boolean;
  avatar?: string;
  registeredAt: string;
  lastLogin?: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  phoneOrEmail: string;
  amount: number;
  currency: 'TZS' | 'USD';
  frequency: 'one_off' | 'monthly';
  provider: 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'crdb' | 'nmb' | 'card';
  message?: string;
  timestamp: string;
  status: 'completed' | 'processing';
}

export interface MediaItem {
  id: string;
  url: string;
  fileName: string;
  altText: string;
  fileSize: number; // in bytes
  fileType: string;
  uploadedAt: string;
  dimensions?: string;
}

export interface WebsiteAppearanceSettings {
  siteName: string;
  siteTagline: string;
  siteLogoText: string;
  siteLogoUrl?: string;
  primaryColor: string;
  breakingNewsEnabled: boolean;
  breakingNewsTicker: string;
  featuredStoryId?: string;
  footerBio: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    instagram: string;
    whatsapp: string;
  };
  contactEmail: string;
  contactPhone: string;
  newsroomAddress: string;
}

export interface WebsiteSettings {
  maintenanceMode: boolean;
  editorialPolicy: string;
  privacyPolicy: string;
  termsConditions: string;
  newsletterEnabled: boolean;
  googleAdSenseSlot: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  canonicalBaseUrl: string;
}

export interface AdminActivityLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  adminName: string;
  action: string;
  target: string;
  category: 'article' | 'category' | 'user' | 'media' | 'settings' | 'comment' | 'security' | 'appearance' | 'ads';
  details?: string;
}
