import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  INITIAL_ARTICLES,
  INITIAL_CATEGORIES,
  INITIAL_SUBSCRIBERS,
  INITIAL_ADS,
  INITIAL_AUTHORS,
  INITIAL_MEDIA,
  INITIAL_REGISTERED_USERS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_APPEARANCE_SETTINGS,
  INITIAL_WEBSITE_SETTINGS,
} from '../data/initialData';

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
  createStaffUser: (data: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    staffTitle?: string;
    avatar?: string;
  }) => UserProfile;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
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
  loginWithPhone: (phone: string, name?: string, additionalDetails?: { email?: string; location?: string; country?: string }) => UserProfile;
  loginWithEmail: (email: string, name?: string, additionalDetails?: { phone?: string; location?: string; country?: string }) => UserProfile;
  logoutUser: () => void;

  // Donations
  isDonateModalOpen: boolean;
  setIsDonateModalOpen: (open: boolean) => void;
  donations: DonationRecord[];
  recordDonation: (donation: Omit<DonationRecord, 'id' | 'timestamp' | 'status'>) => DonationRecord;
  deleteDonation: (id: string) => void;
  exportDonationsCSV: () => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLogin: (password: string, email?: string) => boolean;
  adminLogout: () => void;

  // General System
  language: 'en' | 'sw';
  setLanguage: (lang: 'en' | 'sw') => void;
  textSize: 'sm' | 'md' | 'lg' | 'xl';
  setTextSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  resetToDefaults: () => void;
  exportSubscribersCSV: () => void;
  exportArticlesJson: () => void;
}

const STORAGE_KEYS = {
  ARTICLES: 'the_source_articles_v4_bilingual',
  CATEGORIES: 'the_source_categories_v2',
  SUBSCRIBERS: 'the_source_subscribers_v2',
  ADS: 'the_source_ads_v2',
  BOOKMARKS: 'the_source_bookmarks_v2',
  AUTH: 'the_source_admin_auth_v2',
  ADMIN_USER: 'the_source_admin_user_v2',
  LANG: 'the_source_lang_v2',
  TEXT_SIZE: 'the_source_text_size_v2',
  USER: 'the_source_current_user_v2',
  DONATIONS: 'the_source_donations_v2',
  MEDIA: 'the_source_media_v2',
  USERS: 'the_source_users_v2',
  APPEARANCE: 'the_source_appearance_v2',
  SETTINGS: 'the_source_settings_v2',
  LOGS: 'the_source_logs_v2',
};

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Articles state (Dynamic real database storage)
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  // Authors state
  const [authors, setAuthors] = useState<Author[]>(() => {
    try {
      const stored = localStorage.getItem('the_source_authors_v2');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_AUTHORS;
    } catch {
      return INITIAL_AUTHORS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('the_source_authors_v2', JSON.stringify(authors));
    } catch {}
  }, [authors]);

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

  // Categories state (Dynamic real database storage)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored !== null) {
        const parsed: Category[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Active categories for navigation and public views
  const activeCategories = useMemo(() => {
    return categories.filter(c => c.isActive !== false);
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
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_APPEARANCE_SETTINGS,
          ...parsed,
          contactPhone: parsed.contactPhone && parsed.contactPhone !== '+255 22 211 4500' ? parsed.contactPhone : '+255 622 754 599',
          socialLinks: {
            ...INITIAL_APPEARANCE_SETTINGS.socialLinks,
            ...(parsed.socialLinks || {}),
            whatsapp: 'https://wa.me/255622754599',
          },
        };
      }
      return INITIAL_APPEARANCE_SETTINGS;
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

  // Current Logged-in Admin User
  const [currentAdminUser, setCurrentAdminUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
      if (stored) return JSON.parse(stored);
      if (localStorage.getItem(STORAGE_KEYS.AUTH) === 'true') {
        return INITIAL_REGISTERED_USERS[0];
      }
      return null;
    } catch {
      return null;
    }
  });

  // Admin Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Language state (default English as requested)
  const [language, setLanguageState] = useState<'en' | 'sw'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANG);
      return stored === 'sw' ? 'sw' : 'en';
    } catch {
      return 'en';
    }
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

  // LocalStorage synchronizations
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [articles]);

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

  // Admin Authentication
  const adminLogin = (password: string, email?: string): boolean => {
    const validEmails = ['telvinaggrey24@gmail.com', 'admin@thesun.co.tz', 'admin@thesource.co.tz'];
    const cleanEmail = email?.trim().toLowerCase() || 'telvinaggrey24@gmail.com';

    // Accept valid demo keys or instant access
    const isValidPass =
      password === 'thesun2026' ||
      password === 'thesource2026' ||
      password === 'admin123' ||
      password === 'thesun' ||
      password === 'habari2026';

    if (isValidPass || validEmails.includes(cleanEmail)) {
      const user = registeredUsers.find(u => u.email?.toLowerCase() === cleanEmail) || {
        id: `usr_${Date.now()}`,
        name: cleanEmail.includes('telvin') ? 'Website Owner & Admin' : 'Chief Editor',
        email: cleanEmail,
        role: 'admin' as UserRole,
        status: 'active' as const,
        isSubscriber: true,
        isDonor: true,
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      setIsAdminAuthenticated(true);
      setCurrentAdminUser(user);

      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
        localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(user));
      } catch {}

      logAdminActivity('Administrator Login', 'Admin Dashboard', 'security', `Session initiated for ${cleanEmail}`);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    logAdminActivity('Administrator Logout', 'Admin Dashboard', 'security', 'Session ended');
    setIsAdminAuthenticated(false);
    setCurrentAdminUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
    } catch {}
    if (view.type === 'admin') {
      setView({ type: 'home' });
    }
  };

  // Article CRUD & Controls
  const addArticle = (data: Omit<Article, 'id' | 'viewsCount' | 'reactions' | 'comments'>): Article => {
    const adminAuthor = currentAdminUser
      ? {
          id: currentAdminUser.id,
          name: currentAdminUser.name,
          email: currentAdminUser.email || '',
          role: currentAdminUser.role || 'admin',
        }
      : {
          id: 'usr_telvin',
          name: 'Telvin Aggrey (Super Admin)',
          email: 'telvinaggrey24@gmail.com',
          role: 'admin',
        };

    const newArticle: Article = {
      ...data,
      id: `art_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: data.createdBy || adminAuthor,
      lastEditedBy: adminAuthor,
      viewsCount: 1,
      reactions: {
        insightful: 0,
        inspiring: 0,
        surprised: 0,
        concerned: 0,
      },
      comments: [],
      commentsEnabled: data.commentsEnabled !== false,
    };
    setArticles(prev => [newArticle, ...prev]);
    logAdminActivity(
      'Created Article',
      newArticle.title,
      'article',
      `Category: ${newArticle.categoryName}, Author: ${newArticle.author?.name || 'Staff'}, Status: ${newArticle.status}`
    );
    return newArticle;
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    const adminAuthor = currentAdminUser
      ? {
          id: currentAdminUser.id,
          name: currentAdminUser.name,
          email: currentAdminUser.email || '',
          role: currentAdminUser.role || 'admin',
        }
      : undefined;

    setArticles(prev =>
      prev.map(art => {
        if (art.id === id) {
          const updated: Article = {
            ...art,
            ...updates,
            updatedAt: new Date().toISOString(),
            lastEditedBy: adminAuthor || art.lastEditedBy,
          };
          return updated;
        }
        return art;
      })
    );
    const target = articles.find(a => a.id === id)?.title || id;
    logAdminActivity('Updated Article', target, 'article', `Modified by ${adminAuthor?.name || 'Administrator'}`);
  };

  const deleteArticle = (id: string) => {
    const target = articles.find(a => a.id === id)?.title || id;
    setArticles(prev => prev.filter(art => art.id !== id));
    logAdminActivity('Deleted Article', target, 'article', 'Permanently removed from newsroom database');
  };

  const toggleBreaking = (id: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id === id) {
          const isBreaking = !art.isBreaking;
          logAdminActivity(
            isBreaking ? 'Enabled Breaking Alert' : 'Disabled Breaking Alert',
            art.title,
            'article',
            isBreaking ? 'Broadcasted on top marquee ticker' : 'Removed from ticker'
          );
          return { ...art, isBreaking };
        }
        return art;
      })
    );
  };

  const setFeaturedHero = (id: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id === id) {
          logAdminActivity('Set Featured Hero Story', art.title, 'article', 'Promoted to frontpage lead position');
          return { ...art, isFeaturedHero: true };
        }
        return { ...art, isFeaturedHero: false };
      })
    );
    setAppearanceSettings(prev => ({ ...prev, featuredStoryId: id }));
  };

  const toggleArticleStatus = (id: string, newStatus: ArticleStatus) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id === id) {
          logAdminActivity(`Changed Article Status to ${newStatus}`, art.title, 'article');
          return { ...art, status: newStatus };
        }
        return art;
      })
    );
  };

  const toggleCommentsEnabled = (id: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id === id) {
          const commentsEnabled = art.commentsEnabled === false;
          logAdminActivity(
            commentsEnabled ? 'Enabled Comments' : 'Disabled Comments',
            art.title,
            'comment'
          );
          return { ...art, commentsEnabled };
        }
        return art;
      })
    );
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
  const createStaffUser = (data: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    staffTitle?: string;
    avatar?: string;
  }): UserProfile => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      staffTitle: data.staffTitle,
      avatar:
        data.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      status: 'active',
      isSubscriber: true,
      isDonor: false,
      registeredAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setRegisteredUsers(prev => [newUser, ...prev]);

    // If staff/editor/admin/journalist, also register as newsroom author so they can publish under their byline
    if (data.role !== 'reader') {
      const existingAuthor = authors.find(
        a =>
          a.name.toLowerCase() === data.name.toLowerCase() ||
          (data.email && a.email?.toLowerCase() === data.email.toLowerCase())
      );
      if (!existingAuthor) {
        const newAuthor: Author = {
          id: `author-${Date.now()}`,
          name: data.name,
          title: data.staffTitle || (data.role === 'admin' ? 'Chief Editor & Administrator' : 'Staff Journalist'),
          avatar: newUser.avatar!,
          bio: `${data.name} is a staff journalist and editor at THE SOURCE newsroom covering East Africa.`,
          email: data.email,
          joinedYear: String(new Date().getFullYear()),
          specialties: ['National News', 'Public Interest'],
        };
        setAuthors(prev => [...prev, newAuthor]);
      }
    }

    logAdminActivity(
      `Added Staff Member (${data.role})`,
      data.name,
      'user',
      `Email: ${data.email}, Title: ${data.staffTitle || data.role}`
    );
    return newUser;
  };

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

  // Reader Phone / Email Login
  const loginWithPhone = (
    phone: string,
    name?: string,
    additionalDetails?: { email?: string; location?: string; country?: string }
  ): UserProfile => {
    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name?.trim() || `Reader (${phone.replace(/\s+/g, '').slice(-4)})`,
      phone: phone.trim(),
      email: additionalDetails?.email?.trim().toLowerCase() || undefined,
      location: additionalDetails?.location?.trim() || undefined,
      country: additionalDetails?.country?.trim() || undefined,
      role: 'reader',
      status: 'active',
      isSubscriber: true,
      isDonor: false,
      registeredAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(profile);
    setRegisteredUsers(prev => [profile, ...prev.filter(u => u.phone !== phone.trim())]);
    setIsAuthModalOpen(false);
    return profile;
  };

  const loginWithEmail = (
    email: string,
    name?: string,
    additionalDetails?: { phone?: string; location?: string; country?: string }
  ): UserProfile => {
    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name?.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
      phone: additionalDetails?.phone?.trim() || undefined,
      location: additionalDetails?.location?.trim() || undefined,
      country: additionalDetails?.country?.trim() || undefined,
      role: 'reader',
      status: 'active',
      isSubscriber: true,
      isDonor: false,
      registeredAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(profile);
    setRegisteredUsers(prev => [profile, ...prev.filter(u => u.email !== email.trim().toLowerCase())]);
    setIsAuthModalOpen(false);
    return profile;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

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

  const setLanguage = (lang: 'en' | 'sw') => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
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
    setArticles(INITIAL_ARTICLES);
    setCategories(INITIAL_CATEGORIES);
    setSubscribers(INITIAL_SUBSCRIBERS);
    setAds(INITIAL_ADS);
    setMediaItems(INITIAL_MEDIA);
    setRegisteredUsers(INITIAL_REGISTERED_USERS);
    setAppearanceSettings(INITIAL_APPEARANCE_SETTINGS);
    setWebsiteSettings(INITIAL_WEBSITE_SETTINGS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);

    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIBERS);
    localStorage.removeItem(STORAGE_KEYS.ADS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.APPEARANCE);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);

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
        createStaffUser,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
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
        loginWithPhone,
        loginWithEmail,
        logoutUser,
        isDonateModalOpen,
        setIsDonateModalOpen,
        donations,
        recordDonation,
        deleteDonation,
        exportDonationsCSV,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        language,
        setLanguage,
        textSize,
        setTextSize,
        resetToDefaults,
        exportSubscribersCSV,
        exportArticlesJson,
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
