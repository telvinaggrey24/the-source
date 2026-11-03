import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  Article,
  Category,
  Subscriber,
  AdBanner,
  ViewState,
  ArticleComment,
  ArticleReactions,
  UserProfile,
  DonationRecord,
  Author,
  CommentStatus,
  MediaItem,
  UserRole,
  AdminActivityLog,
  WebsiteAppearanceSettings,
  WebsiteSettings,
  ArticleStatus,
} from '../types';
import {
  firebaseUserToProfile,
  isAdminEmail,
  signInWithGoogle,
  signOutFirebase,
  subscribeToAuth,
} from '../lib/auth';
import {
  deleteCmsArticle,
  fetchCmsArticles,
  mergeCmsArticles,
  migrateLocalCmsToFirestore,
  upsertCmsArticle,
} from '../lib/cmsArticles';
import {
  INITIAL_CATEGORIES,
  PRIMARY_CATEGORY_SLUGS,
  INITIAL_SUBSCRIBERS,
  INITIAL_ADS,
  INITIAL_AUTHORS,
  INITIAL_MEDIA,
  INITIAL_REGISTERED_USERS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_APPEARANCE_SETTINGS,
  INITIAL_WEBSITE_SETTINGS,
} from '../data/initialData';
import type { SiteLanguage } from '../utils/locale';

interface NewsContextType {
  // Articles
  articles: Article[];
  addArticle: (article: Omit<Article, 'id' | 'viewsCount' | 'reactions' | 'comments'>) => Article;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  incrementViews: (id: string) => void;
  reactToArticle: (id: string, reactionType: keyof ArticleReactions) => void;
  toggleBreaking: (id: string) => void;
  setFeaturedHero: (id: string) => void;
  toggleArticleStatus: (id: string, status: ArticleStatus) => void;
  toggleCommentsEnabled: (id: string) => void;

  // Categories
  categories: Category[];
  activeCategories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => { success: boolean; message?: string };
  toggleCategoryActive: (id: string) => void;

  // Comments & Community
  addComment: (articleId: string, authorName: string, authorCity: string, content: string) => void;
  addCommentReply: (articleId: string, parentCommentId: string, authorName: string, authorCity: string, content: string) => void;
  upvoteComment: (articleId: string, commentId: string) => void;
  downvoteComment: (articleId: string, commentId: string) => void;
  moderateComment: (articleId: string, commentId: string, newStatus: CommentStatus) => void;
  deleteComment: (articleId: string, commentId: string) => void;
  reportComment: (articleId: string, commentId: string) => void;

  // Authors
  authors: Author[];
  getAuthorById: (id: string) => Author | undefined;
  getArticlesByAuthor: (authorId: string) => Article[];

  // Media Library
  mediaItems: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => MediaItem;
  deleteMediaItem: (id: string) => void;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => void;

  // User Management & RBAC
  registeredUsers: UserProfile[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  createStaffUser: (data: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    staffTitle?: string;
    avatar?: string;
  }) => UserProfile;
  currentAdminUser: UserProfile | null;

  // Appearance & Website Settings
  appearanceSettings: WebsiteAppearanceSettings;
  updateAppearanceSettings: (updates: Partial<WebsiteAppearanceSettings>) => void;
  websiteSettings: WebsiteSettings;
  updateWebsiteSettings: (updates: Partial<WebsiteSettings>) => void;

  // Admin Activity Logs
  activityLogs: AdminActivityLog[];
  logAdminActivity: (action: string, target: string, category: AdminActivityLog['category'], details?: string) => void;
  clearActivityLogs: () => void;

  // Subscribers
  subscribers: Subscriber[];
  addSubscriber: (email: string, categories?: string[], frequency?: 'daily' | 'weekly' | 'breaking_only') => boolean;
  removeSubscriber: (id: string) => void;

  // Ads
  ads: AdBanner[];
  updateAd: (id: string, updates: Partial<AdBanner>) => void;

  // Navigation & View
  view: ViewState;
  setView: (view: ViewState) => void;
  /** Open CMS article in-app, or wire story on the publisher site (full text). */
  openArticle: (articleOrSlug: Article | string) => void;
  bookmarks: string[];
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  isBookmarksOpen: boolean;
  setIsBookmarksOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNewsletterOpen: boolean;
  setIsNewsletterOpen: (open: boolean) => void;

  // Reader Authentication & Profile
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  currentUser: UserProfile | null;
  loginWithGoogle: () => Promise<UserProfile>;
  logoutUser: () => Promise<void>;

  // Donations
  isDonateModalOpen: boolean;
  setIsDonateModalOpen: (open: boolean) => void;
  donations: DonationRecord[];
  recordDonation: (donation: Omit<DonationRecord, 'id' | 'timestamp' | 'status'>) => DonationRecord;
  deleteDonation: (id: string) => void;
  exportDonationsCSV: () => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLoginWithGoogle: () => Promise<boolean>;
  adminLogout: () => Promise<void>;

  // General System
  language: SiteLanguage;
  setLanguage: (lang: SiteLanguage) => void;
  /** True after the first-visit language popup (or header toggle) is answered. */
  languageManual: boolean;
  textSize: 'sm' | 'md' | 'lg' | 'xl';
  setTextSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  resetToDefaults: () => void;
  exportSubscribersCSV: () => void;
  exportArticlesJson: () => void;

  // Live news wire (NewsData.io + NewsAPI.org)
  newsLoading: boolean;
  newsError: string | null;
  refreshNewsWire: () => Promise<void>;
}

const STORAGE_KEYS = {
  ARTICLES: 'the_source_articles_v5_wire',
  /** Editorial CMS posts only (never wiped by wire refresh) */
  CMS_ARTICLES: 'the_source_cms_articles_v1',
  AUTHORS: 'the_source_authors_v1',
  CATEGORIES: 'the_source_categories_v4',
  SUBSCRIBERS: 'the_source_subscribers_v3',
  ADS: 'the_source_ads_v3',
  BOOKMARKS: 'the_source_bookmarks_v3',
  AUTH: 'the_source_admin_auth_v2',
  ADMIN_USER: 'the_source_admin_user_v2',
  LANG: 'the_source_lang_v2',
  LANG_MANUAL: 'the_source_lang_manual_v1',
  TEXT_SIZE: 'the_source_text_size_v2',
  USER: 'the_source_current_user_v2',
  DONATIONS: 'the_source_donations_v2',
  MEDIA: 'the_source_media_v3',
  USERS: 'the_source_users_v3',
  APPEARANCE: 'the_source_appearance_v4',
  SETTINGS: 'the_source_settings_v4',
  LOGS: 'the_source_logs_v3',
};

const NewsContext = createContext<NewsContextType | undefined>(undefined);

/** Drop legacy Google News wire items still stuck in browser storage */
function isGoogleNewsArtifact(article: Article): boolean {
  const blob = [
    article.author?.name,
    article.subtitle,
    article.summary,
    article.sourceUrl,
    ...(article.tags || []),
    ...(article.content || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return (
    blob.includes('news.google.com') ||
    blob.includes('google news') ||
    (article.tags || []).includes('google-news') ||
    /^google news$/i.test(article.author?.name || '')
  );
}

function loadCmsArticles(): Article[] {
  try {
    // Drop very old google-wire caches
    localStorage.removeItem('the_source_articles_v4_bilingual');
    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
    localStorage.removeItem('the_source_appearance_v3');
    localStorage.removeItem('the_source_settings_v3');

    const stored = localStorage.getItem(STORAGE_KEYS.CMS_ARTICLES);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((a: Article) => a && !a.isWireStory && !isGoogleNewsArtifact(a))
      : [];
  } catch {
    return [];
  }
}

function persistCmsArticles(all: Article[]) {
  try {
    const cmsOnly = all.filter(a => !a.isWireStory && !isGoogleNewsArtifact(a));
    localStorage.setItem(STORAGE_KEYS.CMS_ARTICLES, JSON.stringify(cmsOnly));
  } catch {}
}

function syncCmsToCloud(article: Article | undefined): Promise<void> {
  if (!article || article.isWireStory || isGoogleNewsArtifact(article)) {
    return Promise.resolve();
  }
  return upsertCmsArticle(article).catch(err => {
    const message =
      err instanceof Error
        ? err.message
        : 'Firestore save failed — post may only exist on this browser.';
    console.warn('[cms]', message, err);
    if (typeof window !== 'undefined') {
      window.alert(
        `Post saved on this device only.\n\n${message}\n\nCheck Firebase → Firestore → Data for an "articles" collection after you fix this.`
      );
    }
    throw err;
  });
}

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Merged list: CMS editorial posts + live wire (NewsData / NewsAPI)
  const [articles, setArticles] = useState<Article[]>(() => loadCmsArticles());
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const articlesRef = useRef(articles);
  articlesRef.current = articles;

  // Authors state (editable from staff CMS)
  const [authors, setAuthors] = useState<Author[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTHORS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_AUTHORS;
  });

  const getAuthorById = (id: string): Author | undefined => {
    return (
      authors.find(a => a.id === id || a.name.toLowerCase() === id.toLowerCase()) ||
      INITIAL_AUTHORS.find(a => a.id === id || a.name.toLowerCase() === id.toLowerCase())
    );
  };

  const getArticlesByAuthor = (authorId: string): Article[] => {
    return articles.filter(a => {
      if (!a.author) return false;
      return a.author.id === authorId || a.author.name.toLowerCase() === authorId.toLowerCase();
    });
  };

  // Categories state — primary desks only on public nav
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      localStorage.removeItem('the_source_categories_v3');
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed: Category[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some(c => c.slug === 'politics')) {
          return parsed.map(c => ({
            ...c,
            isActive: PRIMARY_CATEGORY_SLUGS.includes(
              c.slug as (typeof PRIMARY_CATEGORY_SLUGS)[number]
            )
              ? c.isActive !== false
              : false,
          }));
        }
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Active = public nav + homepage. Toggle off in CMS to hide a desk.
  const activeCategories = useMemo(() => {
    const order = PRIMARY_CATEGORY_SLUGS as readonly string[];
    return categories
      .filter(c => c.isActive !== false)
      .sort((a, b) => {
        const ai = order.indexOf(a.slug);
        const bi = order.indexOf(b.slug);
        const aRank = ai === -1 ? 99 : ai;
        const bRank = bi === -1 ? 99 : bi;
        if (aRank !== bRank) return aRank - bRank;
        return a.name.localeCompare(b.name);
      });
  }, [categories]);

  // Media Items state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return stored ? JSON.parse(stored) : INITIAL_MEDIA;
    } catch {
      return INITIAL_MEDIA;
    }
  });

  // Registered Users (RBAC) state
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_REGISTERED_USERS;
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  // Admin Activity Logs state
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  // Website Appearance Settings state
  const [appearanceSettings, setAppearanceSettings] = useState<WebsiteAppearanceSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPEARANCE);
      return stored ? JSON.parse(stored) : INITIAL_APPEARANCE_SETTINGS;
    } catch {
      return INITIAL_APPEARANCE_SETTINGS;
    }
  });

  // Website Settings state
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : INITIAL_WEBSITE_SETTINGS;
    } catch {
      return INITIAL_WEBSITE_SETTINGS;
    }
  });

  // Subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
      return stored ? JSON.parse(stored) : INITIAL_SUBSCRIBERS;
    } catch {
      return INITIAL_SUBSCRIBERS;
    }
  });

  // Ads state
  const [ads, setAds] = useState<AdBanner[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADS);
      return stored ? JSON.parse(stored) : INITIAL_ADS;
    } catch {
      return INITIAL_ADS;
    }
  });

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Admin session comes only from live Firebase Google Auth (needed for Firestore writes)
  const [currentAdminUser, setCurrentAdminUser] = useState<UserProfile | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Language: original (SW) until the reader chooses — never auto-translate
  const [languageManual, setLanguageManual] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANG_MANUAL) === '1';
    } catch {
      return false;
    }
  });
  const [language, setLanguageState] = useState<SiteLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANG);
      if (stored === 'sw' || stored === 'en') return stored;
    } catch {}
    return 'sw';
  });

  // Text size state
  const [textSize, setTextSizeState] = useState<'sm' | 'md' | 'lg' | 'xl'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEXT_SIZE);
      return (stored as 'sm' | 'md' | 'lg' | 'xl') || 'md';
    } catch {
      return 'md';
    }
  });

  // View state
  const [view, setViewState] = useState<ViewState>({ type: 'home' });
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  // Reader user profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Donations ledger
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: 'don_init_1',
              donorName: 'Amina M. (Dar es Salaam)',
              phoneOrEmail: '+255 754 ••• 219',
              amount: 50000,
              currency: 'TZS',
              frequency: 'monthly',
              provider: 'mpesa',
              message: 'Supporting digital daily reporting across East Africa.',
              timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
              status: 'completed',
            },
            {
              id: 'don_init_2',
              donorName: 'David K. (Arusha)',
              phoneOrEmail: '+255 788 ••• 640',
              amount: 25000,
              currency: 'TZS',
              frequency: 'one_off',
              provider: 'airtel',
              message: 'Unbiased journalism is essential for our democracy.',
              timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
              status: 'completed',
            },
            {
              id: 'don_init_3',
              donorName: 'Mwanza Reader Club',
              phoneOrEmail: '+255 713 ••• 882',
              amount: 100000,
              currency: 'TZS',
              frequency: 'one_off',
              provider: 'tigopesa',
              message: 'High standard editorial work.',
              timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
              status: 'completed',
            },
          ];
    } catch {
      return [];
    }
  });

  const refreshNewsWire = async () => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      try {
        localStorage.removeItem('the_source_articles_v4_bilingual');
        localStorage.removeItem(STORAGE_KEYS.ARTICLES);
      } catch {}

      const res = await fetch('/api/news');
      const raw = await res.text();
      let data: { error?: string; articles?: Article[] } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          res.ok
            ? 'News API returned an invalid response'
            : `News API failed (${res.status}). ${raw.slice(0, 120).trim() || 'Server error'}`
        );
      }
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to load live news wire');
      }
      const wireArticles: Article[] = (Array.isArray(data.articles) ? data.articles : []).filter(
        a => !isGoogleNewsArtifact(a)
      );
      // Keep CMS posts; only replace wire stories (never keep Google News leftovers)
      setArticles(prev => {
        const cms = prev.filter(a => !a.isWireStory && !isGoogleNewsArtifact(a));
        const merged = [...cms, ...wireArticles];
        persistCmsArticles(merged);
        return merged;
      });

      const tickerSource = [...loadCmsArticles(), ...wireArticles];
      const ticker = tickerSource
        .filter(a => a.status === 'published')
        .slice(0, 5)
        .map(a => a.title)
        .join(' /// ');
      if (ticker) {
        setAppearanceSettings(prev => ({
          ...prev,
          breakingNewsTicker: ticker,
          featuredStoryId: prev.featuredStoryId || tickerSource[0]?.id || '',
        }));
      }
    } catch (error) {
      setNewsError(error instanceof Error ? error.message : 'Failed to load live news wire');
      // Never wipe CMS posts on wire failure
      setArticles(prev => {
        const cms = prev.filter(a => !a.isWireStory);
        return cms.length > 0 ? cms : loadCmsArticles();
      });
    } finally {
      setNewsLoading(false);
    }
  };

  // Load shared CMS posts from Firestore, then refresh the live wire
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remoteCms = await fetchCmsArticles();
      if (cancelled) return;
      if (remoteCms.length > 0) {
        setArticles(prev => {
          const localCms = prev.filter(a => !a.isWireStory && !isGoogleNewsArtifact(a));
          const wire = prev.filter(a => a.isWireStory);
          const mergedCms = mergeCmsArticles(localCms, remoteCms);
          persistCmsArticles(mergedCms);
          return [...mergedCms, ...wire];
        });
      }
      await refreshNewsWire();
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist editorial CMS articles + authors
  useEffect(() => {
    persistCmsArticles(articles);
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(authors));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [authors]);

  // LocalStorage synchronizations
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaItems));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [mediaItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [registeredUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPEARANCE, JSON.stringify(appearanceSettings));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [appearanceSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(websiteSettings));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [websiteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [subscribers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [ads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
    } catch {}
  }, [donations]);

  // Logging admin activity helper
  const logAdminActivity = (
    action: string,
    target: string,
    category: AdminActivityLog['category'],
    details?: string
  ) => {
    const newLog: AdminActivityLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      adminEmail: currentAdminUser?.email || 'admin@thesource.co.tz',
      adminName: currentAdminUser?.name || 'Administrator',
      action,
      target,
      category,
      details,
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
  };

  const applyFirebaseUser = (profile: UserProfile, asAdmin: boolean) => {
    if (asAdmin) {
      setIsAdminAuthenticated(true);
      setCurrentAdminUser(profile);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
        localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(profile));
      } catch {}
    } else {
      setIsAdminAuthenticated(false);
      setCurrentAdminUser(null);
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
      } catch {}
    }
    setCurrentUser(profile);
    setRegisteredUsers(prev => [profile, ...prev.filter(u => u.id !== profile.id && u.email !== profile.email)]);
  };

  // Admin = Google Sign-In + allowlisted email only
  const adminLoginWithGoogle = async (): Promise<boolean> => {
    try {
      const fbUser = await signInWithGoogle();
      if (!isAdminEmail(fbUser.email)) {
        await signOutFirebase();
        throw new Error(
          'Access denied. Only telvinaggrey24@gmail.com can open the CMS admin.'
        );
      }
      const profile = firebaseUserToProfile(fbUser, 'admin');
      applyFirebaseUser(profile, true);
      logAdminActivity(
        'Administrator Login',
        'Admin Dashboard',
        'security',
        `Google sign-in for ${fbUser.email}`
      );
      return true;
    } catch (error) {
      console.error('[adminLoginWithGoogle]', error);
      throw error;
    }
  };

  const adminLogout = async () => {
    logAdminActivity('Administrator Logout', 'Admin Dashboard', 'security', 'Session ended');
    setIsAdminAuthenticated(false);
    setCurrentAdminUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
    } catch {}
    await signOutFirebase();
    if (view.type === 'admin') {
      setView({ type: 'home' });
    }
  };

  // Article CRUD & Controls (local + Firestore so other visitors see published posts)
  const addArticle = (data: Omit<Article, 'id' | 'viewsCount' | 'reactions' | 'comments'>): Article => {
    const newArticle: Article = {
      ...data,
      id: `art_${Date.now()}`,
      viewsCount: 1,
      reactions: {
        insightful: 0,
        inspiring: 0,
        surprised: 0,
        concerned: 0,
      },
      comments: [],
      commentsEnabled: data.commentsEnabled !== false,
      isWireStory: false,
      publishedAt: data.publishedAt || new Date().toISOString(),
    };
    setArticles(prev => {
      const next = [newArticle, ...prev];
      persistCmsArticles(next);
      return next;
    });
    syncCmsToCloud(newArticle);
    if (data.isFeaturedHero) {
      setAppearanceSettings(prev => ({ ...prev, featuredStoryId: newArticle.id }));
    }
    logAdminActivity('Created Article', newArticle.title, 'article', `Category: ${newArticle.categoryName}, Status: ${newArticle.status}`);
    return newArticle;
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    let updated: Article | undefined;
    setArticles(prev => {
      const next = prev.map(art => {
        if (art.id === id) {
          updated = {
            ...art,
            ...updates,
            isWireStory: false,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }
        return art;
      });
      persistCmsArticles(next);
      return next;
    });
    syncCmsToCloud(updated);
    if (updates.isFeaturedHero) {
      setAppearanceSettings(prev => ({ ...prev, featuredStoryId: id }));
    }
    const target = articles.find(a => a.id === id)?.title || id;
    logAdminActivity('Updated Article', target, 'article', `Modified fields: ${Object.keys(updates).join(', ')}`);
  };

  const deleteArticle = (id: string) => {
    const target = articles.find(a => a.id === id)?.title || id;
    setArticles(prev => {
      const next = prev.filter(art => art.id !== id);
      persistCmsArticles(next);
      return next;
    });
    void deleteCmsArticle(id).catch(err => console.warn('[cms] Firestore delete failed', err));
    logAdminActivity('Deleted Article', target, 'article', 'Permanently removed from newsroom database');
  };

  const toggleBreaking = (id: string) => {
    let updated: Article | undefined;
    setArticles(prev => {
      const next = prev.map(art => {
        if (art.id === id) {
          const isBreaking = !art.isBreaking;
          logAdminActivity(
            isBreaking ? 'Enabled Breaking Alert' : 'Disabled Breaking Alert',
            art.title,
            'article',
            isBreaking ? 'Broadcasted on top marquee ticker' : 'Removed from ticker'
          );
          updated = { ...art, isBreaking, updatedAt: new Date().toISOString() };
          return updated;
        }
        return art;
      });
      persistCmsArticles(next);
      return next;
    });
    syncCmsToCloud(updated);
  };

  const setFeaturedHero = (id: string) => {
    const synced: Article[] = [];
    setArticles(prev => {
      const next = prev.map(art => {
        if (art.id === id) {
          logAdminActivity('Set Featured Hero Story', art.title, 'article', 'Promoted to frontpage lead position');
          const featured = { ...art, isFeaturedHero: true, updatedAt: new Date().toISOString() };
          synced.push(featured);
          return featured;
        }
        if (art.isFeaturedHero && !art.isWireStory) {
          const cleared = { ...art, isFeaturedHero: false, updatedAt: new Date().toISOString() };
          synced.push(cleared);
          return cleared;
        }
        return { ...art, isFeaturedHero: false };
      });
      persistCmsArticles(next);
      return next;
    });
    synced.forEach(syncCmsToCloud);
    setAppearanceSettings(prev => ({ ...prev, featuredStoryId: id }));
  };

  const toggleArticleStatus = (id: string, newStatus: ArticleStatus) => {
    let updated: Article | undefined;
    setArticles(prev => {
      const next = prev.map(art => {
        if (art.id === id) {
          logAdminActivity(`Changed Article Status to ${newStatus}`, art.title, 'article');
          updated = { ...art, status: newStatus, updatedAt: new Date().toISOString() };
          return updated;
        }
        return art;
      });
      persistCmsArticles(next);
      return next;
    });
    syncCmsToCloud(updated);
  };

  const toggleCommentsEnabled = (id: string) => {
    let updated: Article | undefined;
    setArticles(prev => {
      const next = prev.map(art => {
        if (art.id === id) {
          const commentsEnabled = art.commentsEnabled === false;
          logAdminActivity(
            commentsEnabled ? 'Enabled Comments' : 'Disabled Comments',
            art.title,
            'comment'
          );
          updated = { ...art, commentsEnabled, updatedAt: new Date().toISOString() };
          return updated;
        }
        return art;
      });
      persistCmsArticles(next);
      return next;
    });
    syncCmsToCloud(updated);
  };

  const incrementViews = (id: string) => {
    setArticles(prev => prev.map(art => (art.id === id ? { ...art, viewsCount: art.viewsCount + 1 } : art)));
  };

  const reactToArticle = (id: string, reactionType: keyof ArticleReactions) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id !== id) return art;
        return {
          ...art,
          reactions: {
            ...art.reactions,
            [reactionType]: art.reactions[reactionType] + 1,
          },
        };
      })
    );
  };

  // Category CRUD
  const addCategory = (cat: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...cat,
      id: `cat_${Date.now()}`,
      isActive: cat.isActive !== false,
    };
    setCategories(prev => [...prev, newCat]);
    logAdminActivity('Created Category', newCat.name, 'category', `Slug: ${newCat.slug}`);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    const target = categories.find(c => c.id === id)?.name || id;
    logAdminActivity('Updated Category', target, 'category', `Updated: ${Object.keys(updates).join(', ')}`);
  };

  const deleteCategory = (id: string): { success: boolean; message?: string } => {
    const category = categories.find(c => c.id === id);
    if (!category) return { success: false, message: 'Category not found.' };

    const associatedArticles = articles.filter(a => a.categoryId === id);
    if (associatedArticles.length > 0) {
      return {
        success: false,
        message: `Cannot delete "${category.name}" because it contains ${associatedArticles.length} published article(s). Please reassign or delete these articles first.`,
      };
    }

    setCategories(prev => prev.filter(c => c.id !== id));
    logAdminActivity('Deleted Category', category.name, 'category', 'Removed empty category');
    return { success: true };
  };

  const toggleCategoryActive = (id: string) => {
    setCategories(prev =>
      prev.map(c => {
        if (c.id === id) {
          const isActive = c.isActive === false;
          logAdminActivity(
            isActive ? 'Activated Category' : 'Deactivated Category',
            c.name,
            'category',
            isActive ? 'Visible in public navigation' : 'Hidden from public navigation'
          );
          return { ...c, isActive };
        }
        return c;
      })
    );
  };

  // Media Management
  const addMediaItem = (item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem => {
    const newItem: MediaItem = {
      ...item,
      id: `med_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      uploadedAt: new Date().toISOString(),
    };
    setMediaItems(prev => [newItem, ...prev]);
    logAdminActivity('Uploaded Media File', newItem.fileName, 'media', `Size: ${(newItem.fileSize / 1024).toFixed(1)} KB`);
    return newItem;
  };

  const deleteMediaItem = (id: string) => {
    const item = mediaItems.find(m => m.id === id);
    setMediaItems(prev => prev.filter(m => m.id !== id));
    if (item) {
      logAdminActivity('Deleted Media File', item.fileName, 'media');
    }
  };

  const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    setMediaItems(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  // User Management & RBAC
  const updateUserRole = (userId: string, newRole: UserRole) => {
    setRegisteredUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          logAdminActivity(`Changed User Role to ${newRole}`, u.name || u.email || userId, 'user');
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const toggleUserStatus = (userId: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const status = u.status === 'suspended' ? 'active' : 'suspended';
          logAdminActivity(
            status === 'active' ? 'Reactivated User' : 'Suspended User',
            u.name || u.email || userId,
            'user'
          );
          return { ...u, status };
        }
        return u;
      })
    );
  };

  const createStaffUser = (data: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    staffTitle?: string;
    avatar?: string;
  }): UserProfile => {
    const email = data.email.trim().toLowerCase();
    const existing = registeredUsers.find(u => u.email?.toLowerCase() === email);
    let user: UserProfile;

    if (existing) {
      user = {
        ...existing,
        name: data.name.trim(),
        phone: data.phone || existing.phone,
        role: data.role,
        staffTitle: data.staffTitle || existing.staffTitle,
        avatar: data.avatar || existing.avatar,
        status: 'active',
        lastLogin: existing.lastLogin,
      };
      setRegisteredUsers(prev => prev.map(u => (u.id === existing.id ? user : u)));
      logAdminActivity('Updated Staff Member', data.name, 'user', `Role: ${data.role}`);
    } else {
      user = {
        id: `usr_${Date.now()}`,
        name: data.name.trim(),
        email,
        phone: data.phone,
        role: data.role,
        staffTitle: data.staffTitle,
        avatar: data.avatar,
        status: 'active',
        isSubscriber: false,
        isDonor: false,
        registeredAt: new Date().toISOString(),
      };
      setRegisteredUsers(prev => [user, ...prev]);
      logAdminActivity('Created Staff Member', data.name, 'user', `Role: ${data.role}, Email: ${email}`);
    }

    // Keep byline list in sync for the article composer
    setAuthors(prev => {
      const authorId = `auth_${user.id}`;
      const existingAuthor = prev.find(
        a => a.email?.toLowerCase() === email || a.name.toLowerCase() === user.name.toLowerCase()
      );
      if (existingAuthor) {
        return prev.map(a =>
          a.id === existingAuthor.id
            ? {
                ...a,
                name: user.name,
                title: data.staffTitle || a.title,
                avatar: data.avatar || a.avatar,
                email,
              }
            : a
        );
      }
      return [
        {
          id: authorId,
          name: user.name,
          title: data.staffTitle || data.role,
          avatar:
            data.avatar ||
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80',
          bio: `${user.name} — ${data.staffTitle || data.role} at THE SOURCE.`,
          location: 'Dar es Salaam',
          joinedYear: String(new Date().getFullYear()),
          email,
        },
        ...prev,
      ];
    });

    return user;
  };

  const deleteUser = (userId: string) => {
    const user = registeredUsers.find(u => u.id === userId);
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    if (user) {
      logAdminActivity('Deleted User Account', user.name || user.email || userId, 'user');
    }
  };

  // Appearance & Website Settings
  const updateAppearanceSettings = (updates: Partial<WebsiteAppearanceSettings>) => {
    setAppearanceSettings(prev => {
      const next = { ...prev, ...updates };
      logAdminActivity('Updated Website Appearance', 'Theme & Branding', 'appearance', Object.keys(updates).join(', '));
      return next;
    });
  };

  const updateWebsiteSettings = (updates: Partial<WebsiteSettings>) => {
    setWebsiteSettings(prev => {
      const next = { ...prev, ...updates };
      logAdminActivity('Updated Website Settings', 'General Configuration', 'settings', Object.keys(updates).join(', '));
      return next;
    });
  };

  // Comments Management
  const addComment = (articleId: string, authorName: string, authorCity: string, content: string) => {
    const newComment: ArticleComment = {
      id: `comm_${Date.now()}`,
      authorName: authorName.trim() || 'Civic Reader',
      authorCity: authorCity.trim() || 'East Africa',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      status: 'approved', // safe auto-approve or pending based on system
      replies: [],
    };
    setArticles(prev =>
      prev.map(art => {
        if (art.id !== articleId) return art;
        return {
          ...art,
          comments: [newComment, ...(art.comments || [])],
        };
      })
    );
  };

  const addCommentReply = (
    articleId: string,
    parentCommentId: string,
    authorName: string,
    authorCity: string,
    content: string
  ) => {
    const reply: ArticleComment = {
      id: `reply_${Date.now()}`,
      authorName: authorName.trim() || 'Civic Reader',
      authorCity: authorCity.trim() || 'East Africa',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      status: 'approved',
      parentId: parentCommentId,
    };
    setArticles(prev =>
      prev.map(art => {
        if (art.id !== articleId) return art;
        return {
          ...art,
          comments: art.comments.map(c => {
            if (c.id === parentCommentId) {
              return {
                ...c,
                replies: [...(c.replies || []), reply],
              };
            }
            return c;
          }),
        };
      })
    );
  };

  const upvoteComment = (articleId: string, commentId: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id !== articleId) return art;
        return {
          ...art,
          comments: art.comments.map(c => {
            if (c.id === commentId) return { ...c, upvotes: c.upvotes + 1 };
            if (c.replies?.some(r => r.id === commentId)) {
              return {
                ...c,
                replies: c.replies.map(r => (r.id === commentId ? { ...r, upvotes: r.upvotes + 1 } : r)),
              };
            }
            return c;
          }),
        };
      })
    );
  };

  const downvoteComment = (articleId: string, commentId: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id !== articleId) return art;
        return {
          ...art,
          comments: art.comments.map(c => {
            if (c.id === commentId) return { ...c, downvotes: (c.downvotes || 0) + 1 };
            if (c.replies?.some(r => r.id === commentId)) {
              return {
                ...c,
                replies: c.replies.map(r => (r.id === commentId ? { ...r, downvotes: (r.downvotes || 0) + 1 } : r)),
              };
            }
            return c;
          }),
        };
      })
    );
  };

  const moderateComment = (articleId: string, commentId: string, newStatus: CommentStatus) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id !== articleId) return art;
        return {
          ...art,
          comments: art.comments.map(c => {
            if (c.id === commentId) return { ...c, status: newStatus };
            if (c.replies?.some(r => r.id === commentId)) {
              return {
                ...c,
                replies: c.replies.map(r => (r.id === commentId ? { ...r, status: newStatus } : r)),
              };
            }
            return c;
          }),
        };
      })
    );
    logAdminActivity(`Moderated Comment to ${newStatus}`, `Article ID: ${articleId}`, 'comment');
  };

  const deleteComment = (articleId: string, commentId: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id !== articleId) return art;
        return {
          ...art,
          comments: art.comments
            .filter(c => c.id !== commentId)
            .map(c => ({
              ...c,
              replies: c.replies?.filter(r => r.id !== commentId),
            })),
        };
      })
    );
    logAdminActivity('Deleted Comment', `Article ID: ${articleId}`, 'comment');
  };

  const reportComment = (articleId: string, commentId: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id !== articleId) return art;
        return {
          ...art,
          comments: art.comments.map(c => {
            if (c.id === commentId) return { ...c, isReported: true };
            if (c.replies?.some(r => r.id === commentId)) {
              return {
                ...c,
                replies: c.replies.map(r => (r.id === commentId ? { ...r, isReported: true } : r)),
              };
            }
            return c;
          }),
        };
      })
    );
  };

  const loginWithGoogle = async (): Promise<UserProfile> => {
    const fbUser = await signInWithGoogle();
    const asAdmin = isAdminEmail(fbUser.email);
    const profile = firebaseUserToProfile(fbUser, asAdmin ? 'admin' : 'reader');
    applyFirebaseUser(profile, asAdmin);
    setIsAuthModalOpen(false);
    return profile;
  };

  const logoutUser = async () => {
    setCurrentUser(null);
    setIsAdminAuthenticated(false);
    setCurrentAdminUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {}
    await signOutFirebase();
  };

  // Keep React state in sync with Firebase Auth (Google only)
  useEffect(() => {
    return subscribeToAuth(user => {
      if (!user) {
        setCurrentUser(null);
        setIsAdminAuthenticated(false);
        setCurrentAdminUser(null);
        try {
          localStorage.removeItem(STORAGE_KEYS.AUTH);
          localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
          localStorage.removeItem(STORAGE_KEYS.USER);
        } catch {}
        return;
      }
      const asAdmin = isAdminEmail(user.email);
      const profile = firebaseUserToProfile(user, asAdmin ? 'admin' : 'reader');
      applyFirebaseUser(profile, asAdmin);
      // Push browser-only posts to Firestore so other devices can see them
      if (asAdmin) {
        const localCms = articlesRef.current.filter(
          a => !a.isWireStory && !isGoogleNewsArtifact(a)
        );
        void migrateLocalCmsToFirestore(localCms).then(count => {
          if (count > 0) {
            console.info(`[cms] Synced ${count} editorial post(s) to Firestore`);
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Donations Ledger
  const recordDonation = (data: Omit<DonationRecord, 'id' | 'timestamp' | 'status'>): DonationRecord => {
    const newDonation: DonationRecord = {
      ...data,
      id: `don_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };
    setDonations(prev => [newDonation, ...prev]);
    if (currentUser) {
      setCurrentUser(prev => (prev ? { ...prev, isDonor: true } : null));
    }
    logAdminActivity(
      'Recorded Reader Donation',
      `${data.amount.toLocaleString()} ${data.currency} (${data.provider})`,
      'settings',
      `From: ${data.donorName}`
    );
    return newDonation;
  };

  const deleteDonation = (id: string) => {
    setDonations(prev => prev.filter(d => d.id !== id));
    logAdminActivity('Removed Donation Record', id, 'settings');
  };

  // Ads & Monetization
  const updateAd = (id: string, updates: Partial<AdBanner>) => {
    setAds(prev => prev.map(ad => (ad.id === id ? { ...ad, ...updates } : ad)));
    logAdminActivity('Updated Ad Slot', id, 'ads', Object.keys(updates).join(', '));
  };

  // Subscribers
  const addSubscriber = (email: string, categoriesList?: string[], frequency?: 'daily' | 'weekly' | 'breaking_only'): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return false;

    if (subscribers.some(s => s.email.toLowerCase() === cleanEmail)) {
      return true;
    }

    const newSub: Subscriber = {
      id: `sub_${Date.now()}`,
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      preferredCategories: categoriesList || ['business', 'politics', 'sports'],
      frequency: frequency || 'daily',
    };
    setSubscribers(prev => [newSub, ...prev]);
    return true;
  };

  const removeSubscriber = (id: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  // Bookmarks
  const toggleBookmark = (articleId: string) => {
    setBookmarks(prev => (prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]));
  };

  const isBookmarked = (articleId: string) => bookmarks.includes(articleId);

  // View & UI Navigation
  const setView = (newView: ViewState) => {
    setViewState(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openArticle = (articleOrSlug: Article | string) => {
    const art =
      typeof articleOrSlug === 'string'
        ? articles.find(a => a.slug === articleOrSlug || a.id === articleOrSlug)
        : articleOrSlug;
    if (!art) return;
    // Always open in-app (wire stories use ArticleDetail + optional publisher link)
    setView({ type: 'article', slug: art.slug });
  };

  const setLanguage = (lang: SiteLanguage) => {
    setLanguageState(lang);
    setLanguageManual(true);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
      localStorage.setItem(STORAGE_KEYS.LANG_MANUAL, '1');
    } catch {}
  };

  const setTextSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    setTextSizeState(size);
    try {
      localStorage.setItem(STORAGE_KEYS.TEXT_SIZE, size);
    } catch {}
  };

  // System Resets & Exports
  const resetToDefaults = () => {
    setCategories(INITIAL_CATEGORIES);
    setSubscribers(INITIAL_SUBSCRIBERS);
    setAds(INITIAL_ADS);
    setMediaItems(INITIAL_MEDIA);
    setRegisteredUsers(INITIAL_REGISTERED_USERS);
    setAuthors(INITIAL_AUTHORS);
    setAppearanceSettings(INITIAL_APPEARANCE_SETTINGS);
    setWebsiteSettings(INITIAL_WEBSITE_SETTINGS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);

    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
    localStorage.removeItem(STORAGE_KEYS.CMS_ARTICLES);
    localStorage.removeItem(STORAGE_KEYS.AUTHORS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIBERS);
    localStorage.removeItem(STORAGE_KEYS.ADS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.APPEARANCE);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);

    void refreshNewsWire();
    logAdminActivity('Restored Newsroom Defaults', 'System Core', 'settings', 'Reset all articles, categories, and settings');
  };

  const exportSubscribersCSV = () => {
    const headers = 'ID,Email,Name,SubscribedAt,Frequency,Categories\n';
    const rows = subscribers
      .map(s => `"${s.id}","${s.email}","${s.name || ''}","${s.subscribedAt}","${s.frequency}","${s.preferredCategories.join(';')}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `the-source-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDonationsCSV = () => {
    const headers = 'ID,DonorName,PhoneOrEmail,Amount,Currency,Frequency,Provider,Status,Timestamp,Message\n';
    const rows = donations
      .map(
        d =>
          `"${d.id}","${d.donorName.replace(/"/g, '""')}","${d.phoneOrEmail}","${d.amount}","${d.currency}","${d.frequency}","${d.provider}","${d.status}","${d.timestamp}","${(d.message || '').replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `the-source-donations-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportArticlesJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(articles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `the-source-articles-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <NewsContext.Provider
      value={{
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        incrementViews,
        reactToArticle,
        toggleBreaking,
        setFeaturedHero,
        toggleArticleStatus,
        toggleCommentsEnabled,
        categories,
        activeCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryActive,
        addComment,
        addCommentReply,
        upvoteComment,
        downvoteComment,
        moderateComment,
        deleteComment,
        reportComment,
        authors,
        getAuthorById,
        getArticlesByAuthor,
        mediaItems,
        addMediaItem,
        deleteMediaItem,
        updateMediaItem,
        registeredUsers,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
        createStaffUser,
        currentAdminUser,
        appearanceSettings,
        updateAppearanceSettings,
        websiteSettings,
        updateWebsiteSettings,
        activityLogs,
        logAdminActivity,
        clearActivityLogs,
        subscribers,
        addSubscriber,
        removeSubscriber,
        ads,
        updateAd,
        view,
        setView,
        openArticle,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        isBookmarksOpen,
        setIsBookmarksOpen,
        isSearchOpen,
        setIsSearchOpen,
        isNewsletterOpen,
        setIsNewsletterOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        currentUser,
        loginWithGoogle,
        logoutUser,
        isDonateModalOpen,
        setIsDonateModalOpen,
        donations,
        recordDonation,
        deleteDonation,
        exportDonationsCSV,
        isAdminAuthenticated,
        adminLoginWithGoogle,
        adminLogout,
        language,
        setLanguage,
        languageManual,
        textSize,
        setTextSize,
        resetToDefaults,
        exportSubscribersCSV,
        exportArticlesJson,
        newsLoading,
        newsError,
        refreshNewsWire,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
