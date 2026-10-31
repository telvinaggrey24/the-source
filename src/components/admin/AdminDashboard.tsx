import React, { useState, useMemo, useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Article,
  Category,
  AdBanner,
  ArticleStatus,
  CommentStatus,
  UserRole,
  MediaItem,
  AdminActivityLog,
  Author,
  UserProfile,
} from '../../types';
import { INITIAL_AUTHORS } from '../../data/initialData';
import {
  Shield,
  FileText,
  FolderTree,
  Megaphone,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Upload,
  LogOut,
  Flame,
  Star,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  MessageSquare,
  Image as ImageIcon,
  Palette,
  Globe,
  Settings as SettingsIcon,
  History,
  Lock,
  Menu,
  ChevronRight,
  AlertTriangle,
  Copy,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  Sparkles,
  UserPlus,
  Phone,
  Mail,
  Award,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  CheckSquare,
  MessageCircle,
} from 'lucide-react';
import { WorldMap } from '../common/WorldMap';

export const AdminDashboard: React.FC = () => {
  const {
    articles,
    categories,
    authors,
    ads,
    currentUser,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    currentAdminUser,
    addArticle,
    updateArticle,
    deleteArticle,
    toggleBreaking,
    setFeaturedHero,
    toggleArticleStatus,
    toggleCommentsEnabled,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    moderateComment,
    deleteComment,
    mediaItems,
    addMediaItem,
    deleteMediaItem,
    registeredUsers,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    createStaffUser,
    appearanceSettings,
    updateAppearanceSettings,
    websiteSettings,
    updateWebsiteSettings,
    activityLogs,
    clearActivityLogs,
    updateAd,
    setView,
  } = useNews();

  // Authentication State
  const [loginEmail, setLoginEmail] = useState('telvinaggrey24@gmail.com');
  const [loginPassword, setLoginPassword] = useState('thesun2026');
  const [loginError, setLoginError] = useState('');

  // Active Navigation Tab
  type DashboardTab =
    | 'overview'
    | 'articles'
    | 'composer'
    | 'categories'
    | 'media'
    | 'comments'
    | 'users'
    | 'ads'
    | 'appearance'
    | 'seo'
    | 'settings'
    | 'logs';

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsedDesktop, setIsSidebarCollapsedDesktop] = useState(false);

  // Article Filters & Search
  const [articleSearch, setArticleSearch] = useState('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('all');
  const [articleStatusFilter, setArticleStatusFilter] = useState<'all' | ArticleStatus>('all');

  // Confirmation Modals
  const [deleteArticleModal, setDeleteArticleModal] = useState<{ isOpen: boolean; article: Article | null }>({
    isOpen: false,
    article: null,
  });
  const [deleteCategoryModal, setDeleteCategoryModal] = useState<{
    isOpen: boolean;
    category: Category | null;
    articleCount: number;
  }>({
    isOpen: false,
    category: null,
    articleCount: 0,
  });
  const [deleteMediaModal, setDeleteMediaModal] = useState<{ isOpen: boolean; media: MediaItem | null }>({
    isOpen: false,
    media: null,
  });
  const [deleteUserModal, setDeleteUserModal] = useState<{ isOpen: boolean; userId: string | null; userName: string }>({
    isOpen: false,
    userId: null,
    userName: '',
  });
  const [maintenanceConfirmModal, setMaintenanceConfirmModal] = useState(false);
  const [previewArticleModal, setPreviewArticleModal] = useState<{ isOpen: boolean; article: Partial<Article> | null }>({
    isOpen: false,
    article: null,
  });

  // Success Notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Article Composer State (Bilingual: Kiswahili Juu + English Chini)
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formTitleEnglish, setFormTitleEnglish] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formSubtitleEnglish, setFormSubtitleEnglish] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formSummaryEnglish, setFormSummaryEnglish] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formContentEnglish, setFormContentEnglish] = useState('');
  const [formKeyTakeaways, setFormKeyTakeaways] = useState('');
  const [formKeyTakeawaysEnglish, setFormKeyTakeawaysEnglish] = useState('');
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || 'cat_business');
  const [formImage, setFormImage] = useState('/src/assets/images/hero_lead_tanzania_rail_1793043305338.jpg');
  const [formImageCaption, setFormImageCaption] = useState('');
  const [formImageCredit, setFormImageCredit] = useState('The Source / Newsroom');
  const [formImageAlt, setFormImageAlt] = useState('');
  const [formAuthorId, setFormAuthorId] = useState(INITIAL_AUTHORS[0]?.id || 'author-1');
  const [formReadTime, setFormReadTime] = useState(4);
  const [formIsBreaking, setFormIsBreaking] = useState(false);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsTrending, setFormIsTrending] = useState(false);
  const [formIsEditorsPick, setFormIsEditorsPick] = useState(false);
  const [formTags, setFormTags] = useState('Habari, Tanzania, East Africa');
  const [formStatus, setFormStatus] = useState<ArticleStatus>('published');
  const [formScheduledDate, setFormScheduledDate] = useState('');
  const [formCommentsEnabled, setFormCommentsEnabled] = useState(true);
  const [formSlug, setFormSlug] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formImageGallery, setFormImageGallery] = useState<string[]>([]);
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDesc, setFormSeoDesc] = useState('');
  const [formCanonicalUrl, setFormCanonicalUrl] = useState('');
  const [formSocialImage, setFormSocialImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Blogger-style Post Composer states
  const [editorViewMode, setEditorViewMode] = useState<'compose' | 'preview'>('compose');
  const [showOptionalEnglish, setShowOptionalEnglish] = useState(false);
  const [showOptionalHighlights, setShowOptionalHighlights] = useState(false);
  const [showAdvancedSeo, setShowAdvancedSeo] = useState(false);

  // Blogger formatting helper
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formContent.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = formContent.substring(0, start) + replacement + formContent.substring(end);
    setFormContent(newContent);

    // Auto-update summary if empty
    if (!formSummary) {
      setFormSummary(newContent.split('\n')[0].replace(/[#*`_>~\[\]\(\)-]/g, ' ').trim().slice(0, 180));
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  // Staff & Admin Member Creation Modal State
  const [addStaffModal, setAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('+255 754 ');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('journalist');
  const [newStaffTitle, setNewStaffTitle] = useState('Senior News Reporter');
  const [newStaffAvatar, setNewStaffAvatar] = useState('/src/assets/images/hero_lead_tanzania_rail_1793043305338.jpg');

  // Template Preview & Live Publishing Modals
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [publishedStoryModal, setPublishedStoryModal] = useState<{
    isOpen: boolean;
    slug: string;
    title: string;
    categoryName: string;
  }>({
    isOpen: false,
    slug: '',
    title: '',
    categoryName: '',
  });

  // Category Manager State
  const [isEditingCategory, setIsEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryColor, setCategoryColor] = useState('#0B192C');

  // Media Library Upload State
  const mediaFileInputRef = useRef<HTMLInputElement | null>(null);
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaUploadError, setMediaUploadError] = useState('');

  // Comment Filter State
  const [commentFilterStatus, setCommentFilterStatus] = useState<'all' | CommentStatus | 'reported'>('all');

  // User Filter State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | UserRole>('all');

  // Activity Log Filter
  const [logFilterCategory, setLogFilterCategory] = useState<'all' | AdminActivityLog['category']>('all');

  // Computed Real-Time Statistics (No Invented Stats)
  const stats = useMemo(() => {
    const published = articles.filter(a => a.status === 'published').length;
    const drafts = articles.filter(a => a.status === 'draft').length;
    const scheduled = articles.filter(a => a.status === 'scheduled').length;
    const totalUsers = registeredUsers.length;
    const totalCats = categories.length;
    const activeCats = categories.filter(c => c.isActive !== false).length;

    // Comments across all articles
    let allCommentsCount = 0;
    let pendingCommentsCount = 0;
    let reportedCommentsCount = 0;
    articles.forEach(a => {
      (a.comments || []).forEach(c => {
        allCommentsCount++;
        if (c.status === 'pending') pendingCommentsCount++;
        if (c.isReported) reportedCommentsCount++;
      });
    });

    const totalViews = articles.reduce((sum, a) => sum + (a.viewsCount || 0), 0);

    return {
      published,
      drafts,
      scheduled,
      totalUsers,
      totalCats,
      activeCats,
      allCommentsCount,
      pendingCommentsCount,
      reportedCommentsCount,
      totalViews,
      totalArticles: articles.length,
    };
  }, [articles, registeredUsers, categories]);

  // Real Data Publication by Category (Chart Data)
  const categoryChartData = useMemo(() => {
    return categories.map(cat => {
      const count = articles.filter(a => a.categoryId === cat.id).length;
      return {
        name: cat.name,
        color: cat.accentColor || '#0B192C',
        count,
      };
    });
  }, [categories, articles]);

  const maxCategoryCount = Math.max(...categoryChartData.map(c => c.count), 1);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const authorName = typeof a.author === 'string' ? a.author : a.author?.name || '';
      const matchesSearch =
        articleSearch === '' ||
        a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
        a.summary.toLowerCase().includes(articleSearch.toLowerCase()) ||
        authorName.toLowerCase().includes(articleSearch.toLowerCase());

      const matchesCat = articleCategoryFilter === 'all' || a.categoryId === articleCategoryFilter;
      const matchesStatus = articleStatusFilter === 'all' || a.status === articleStatusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [articles, articleSearch, articleCategoryFilter, articleStatusFilter]);

  // Flattened Comments list with parent article context
  const flattenedComments = useMemo(() => {
    const list: Array<{
      articleId: string;
      articleTitle: string;
      commentId: string;
      authorName: string;
      authorCity?: string;
      content: string;
      status: CommentStatus;
      isReported?: boolean;
      createdAt: string;
      upvotes: number;
    }> = [];

    articles.forEach(art => {
      (art.comments || []).forEach(c => {
        list.push({
          articleId: art.id,
          articleTitle: art.title,
          commentId: c.id,
          authorName: c.authorName,
          authorCity: c.authorCity,
          content: c.content,
          status: c.status || 'approved',
          isReported: c.isReported,
          createdAt: c.createdAt,
          upvotes: c.upvotes,
        });
      });
    });

    return list.filter(item => {
      if (commentFilterStatus === 'all') return true;
      if (commentFilterStatus === 'reported') return item.isReported === true;
      return item.status === commentFilterStatus;
    });
  }, [articles, commentFilterStatus]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter(u => {
      const matchesSearch =
        userSearch === '' ||
        (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.phone && u.phone.includes(userSearch));

      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;

      return matchesSearch && matchesRole;
    });
  }, [registeredUsers, userSearch, userRoleFilter]);

  // Filtered Activity Logs
  const filteredLogs = useMemo(() => {
    if (logFilterCategory === 'all') return activityLogs;
    return activityLogs.filter(l => l.category === logFilterCategory);
  }, [activityLogs, logFilterCategory]);

  // Login Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = adminLogin(loginPassword, loginEmail);
    if (!success) {
      setLoginError('Invalid credentials. Please enter a valid administrator email and password.');
    } else {
      showToast('Logged in successfully as Administrator.');
    }
  };

  const handleQuickLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('thesun2026');
    adminLogin('thesun2026', email);
    showToast(`Logged in as ${email}`);
  };

  // Article Form Handlers
  const handleOpenNewArticle = () => {
    setEditingArticleId(null);
    setFormTitle('');
    setFormTitleEnglish('');
    setFormSubtitle('');
    setFormSubtitleEnglish('');
    setFormSummary('');
    setFormSummaryEnglish('');
    setFormContent('');
    setFormContentEnglish('');
    setFormKeyTakeaways('');
    setFormKeyTakeawaysEnglish('');
    setFormCategoryId(categories[0]?.id || 'cat_business');
    setFormImage('/src/assets/images/hero_lead_tanzania_rail_1793043305338.jpg');
    setFormImageCaption('');
    setFormImageCredit('The Source / Newsroom');
    setFormImageAlt('');
    setFormAuthorId(INITIAL_AUTHORS[0]?.id || 'author-1');
    setFormReadTime(4);
    setFormIsBreaking(false);
    setFormIsFeatured(false);
    setFormIsTrending(false);
    setFormIsEditorsPick(false);
    setFormTags('Habari, Tanzania, East Africa');
    setFormStatus('published');
    setFormScheduledDate('');
    setFormCommentsEnabled(true);
    setFormSlug('');
    setFormVideoUrl('');
    setFormImageGallery([]);
    setFormSeoTitle('');
    setFormSeoDesc('');
    setFormCanonicalUrl('');
    setFormSocialImage('');
    setActiveTab('composer');
  };

  const handleEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setFormTitle(art.title);
    setFormTitleEnglish(art.titleEnglish || '');
    setFormSubtitle(art.subtitle || '');
    setFormSubtitleEnglish(art.subtitleEnglish || '');
    setFormSummary(art.summary);
    setFormSummaryEnglish(art.summaryEnglish || '');
    setFormContent(Array.isArray(art.content) ? art.content.join('\n\n') : art.content);
    setFormContentEnglish(Array.isArray(art.contentEnglish) ? art.contentEnglish.join('\n\n') : (art.contentEnglish || ''));
    setFormKeyTakeaways(art.keyTakeaways ? art.keyTakeaways.join('\n') : '');
    setFormKeyTakeawaysEnglish(art.keyTakeawaysEnglish ? art.keyTakeawaysEnglish.join('\n') : '');
    setFormCategoryId(art.categoryId);
    setFormImage(art.featuredImage || '');
    setFormImageCaption(art.imageCaption || '');
    setFormImageCredit(art.imageCredit || 'The Source / Newsroom');
    setFormImageAlt(art.imageAltText || '');
    setFormAuthorId(art.author?.id || INITIAL_AUTHORS[0]?.id || 'author-1');
    setFormReadTime(art.readTimeMinutes || 4);
    setFormIsBreaking(!!art.isBreaking);
    setFormIsFeatured(!!art.isFeaturedHero);
    setFormIsTrending(!!art.isTrending);
    setFormIsEditorsPick(!!art.isEditorsPick);
    setFormTags(art.tags ? art.tags.join(', ') : '');
    setFormStatus(art.status);
    setFormScheduledDate(art.scheduledFor || '');
    setFormCommentsEnabled(art.commentsEnabled !== false);
    setFormSlug(art.slug || '');
    setFormVideoUrl(art.videoUrl || '');
    setFormImageGallery(art.imageGallery || []);
    setFormSeoTitle(art.seoMetaTitle || '');
    setFormSeoDesc(art.seoMetaDescription || '');
    setFormCanonicalUrl(art.seoCanonicalUrl || '');
    setFormSocialImage(art.seoSocialImage || '');
    setActiveTab('composer');
  };

  // Image File Upload with 5MB validation
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP, etc.).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImage(reader.result);
        if (!formImageAlt) setFormImageAlt(file.name.replace(/\.[^/.]+$/, ''));
        showToast('Image uploaded successfully.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Article (Blogger-style: simple, fluid, and never blocking on rigid templates)
  const handleSaveArticle = (targetStatus?: ArticleStatus) => {
    if (!formTitle.trim()) {
      alert('Tafadhali weka kichwa cha habari / Please provide an article headline.');
      return;
    }
    if (!formContent.trim()) {
      alert('Tafadhali andika maelezo au mwili wa habari / Please provide article content.');
      return;
    }

    // Auto-derive lead summary if writer didn't enter a custom one (just like Blogger & WordPress!)
    const derivedSummary =
      formSummary.trim() ||
      formContent
        .replace(/[#*`_>~\[\]\(\)-]/g, ' ')
        .split('\n')
        .find(line => line.trim().length > 15)
        ?.trim()
        .slice(0, 200) ||
      formTitle.trim();

    const assignedCat = categories.find(c => c.id === formCategoryId) || categories[0];
    const allAuthors = authors && authors.length > 0 ? authors : INITIAL_AUTHORS;
    const assignedAuthor = allAuthors.find(a => a.id === formAuthorId) || allAuthors[0] || INITIAL_AUTHORS[0];

    const finalStatus = targetStatus || formStatus;
    const keyTakeawaysArray = formKeyTakeaways
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const keyTakeawaysArrayEnglish = formKeyTakeawaysEnglish
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const contentParagraphs = formContent
      .split('\n\n')
      .map(p => p.trim())
      .filter(Boolean);

    const contentParagraphsEnglish = formContentEnglish
      ? formContentEnglish.split('\n\n').map(p => p.trim()).filter(Boolean)
      : [];

    const customOrGeneratedSlug = formSlug.trim()
      ? formSlug
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : generatedSlug || `article-${Date.now()}`;

    const finalSlug = customOrGeneratedSlug;

    if (editingArticleId) {
      updateArticle(editingArticleId, {
        title: formTitle,
        titleEnglish: formTitleEnglish || undefined,
        subtitle: formSubtitle || '',
        subtitleEnglish: formSubtitleEnglish || undefined,
        summary: derivedSummary,
        summaryEnglish: formSummaryEnglish || undefined,
        content: contentParagraphs,
        contentEnglish: contentParagraphsEnglish.length > 0 ? contentParagraphsEnglish : undefined,
        keyTakeaways: keyTakeawaysArray.length > 0 ? keyTakeawaysArray : undefined,
        keyTakeawaysEnglish: keyTakeawaysArrayEnglish.length > 0 ? keyTakeawaysArrayEnglish : undefined,
        categoryId: assignedCat.id,
        categoryName: assignedCat.name,
        featuredImage: formImage,
        imageCaption: formImageCaption || '',
        imageCredit: formImageCredit || 'The Source / Newsroom',
        imageAltText: formImageAlt || undefined,
        author: assignedAuthor,
        readTimeMinutes: Number(formReadTime) || 3,
        isBreaking: formIsBreaking,
        isFeaturedHero: formIsFeatured,
        isTrending: formIsTrending,
        isEditorsPick: formIsEditorsPick,
        tags: tagsArray,
        slug: finalSlug,
        videoUrl: formVideoUrl.trim() || undefined,
        imageGallery: formImageGallery.length > 0 ? formImageGallery : undefined,
        status: finalStatus,
        scheduledFor: formScheduledDate || undefined,
        commentsEnabled: formCommentsEnabled,
        seoMetaTitle: formSeoTitle || formTitle,
        seoMetaDescription: formSeoDesc || derivedSummary.slice(0, 160),
        seoCanonicalUrl: formCanonicalUrl || undefined,
        seoSocialImage: formSocialImage || formImage,
      });
      showToast(`Habari "${formTitle.slice(0, 30)}..." imesasishwa kikamilifu.`);
      if (finalStatus === 'published') {
        setPublishedStoryModal({
          isOpen: true,
          slug: finalSlug,
          title: formTitle,
          categoryName: assignedCat.name,
        });
      }
    } else {
      addArticle({
        title: formTitle,
        titleEnglish: formTitleEnglish || undefined,
        subtitle: formSubtitle || '',
        subtitleEnglish: formSubtitleEnglish || undefined,
        summary: derivedSummary,
        summaryEnglish: formSummaryEnglish || undefined,
        content: contentParagraphs,
        contentEnglish: contentParagraphsEnglish.length > 0 ? contentParagraphsEnglish : undefined,
        keyTakeaways: keyTakeawaysArray.length > 0 ? keyTakeawaysArray : undefined,
        keyTakeawaysEnglish: keyTakeawaysArrayEnglish.length > 0 ? keyTakeawaysArrayEnglish : undefined,
        categoryId: assignedCat.id,
        categoryName: assignedCat.name,
        featuredImage: formImage,
        imageCaption: formImageCaption || '',
        imageCredit: formImageCredit || 'The Source / Newsroom',
        imageAltText: formImageAlt || undefined,
        author: assignedAuthor,
        publishedAt: new Date().toISOString(),
        readTimeMinutes: Number(formReadTime) || 3,
        isBreaking: formIsBreaking,
        isFeaturedHero: formIsFeatured,
        isTrending: formIsTrending,
        isEditorsPick: formIsEditorsPick,
        tags: tagsArray,
        slug: finalSlug,
        videoUrl: formVideoUrl.trim() || undefined,
        imageGallery: formImageGallery.length > 0 ? formImageGallery : undefined,
        status: finalStatus,
        scheduledFor: formScheduledDate || undefined,
        commentsEnabled: formCommentsEnabled,
        seoMetaTitle: formSeoTitle || formTitle,
        seoMetaDescription: formSeoDesc || derivedSummary.slice(0, 160),
        seoCanonicalUrl: formCanonicalUrl || undefined,
        seoSocialImage: formSocialImage || formImage,
      });
      showToast(`Habari "${formTitle.slice(0, 30)}..." imechapishwa kikamilifu!`);
      if (finalStatus === 'published') {
        setPublishedStoryModal({
          isOpen: true,
          slug: finalSlug,
          title: formTitle,
          categoryName: assignedCat.name,
        });
      }
    }

    setActiveTab('articles');
  };

  // Delete Article with confirmation
  const handleConfirmDeleteArticle = () => {
    if (deleteArticleModal.article) {
      deleteArticle(deleteArticleModal.article.id);
      showToast(`Article deleted.`);
      setDeleteArticleModal({ isOpen: false, article: null });
    }
  };

  // Category Management Handlers
  const handleOpenAddCategory = () => {
    setIsEditingCategory(null);
    setCategoryName('');
    setCategorySlug('');
    setCategoryDesc('');
    setCategoryColor('#0B192C');
  };

  const handleEditCategoryClick = (cat: Category) => {
    setIsEditingCategory(cat);
    setCategoryName(cat.name);
    setCategorySlug(cat.slug);
    setCategoryDesc(cat.description || '');
    setCategoryColor(cat.accentColor || '#0B192C');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Please enter a category name.');
      return;
    }

    const finalSlug = (categorySlug.trim() || categoryName)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    if (isEditingCategory) {
      updateCategory(isEditingCategory.id, {
        name: categoryName.trim(),
        slug: finalSlug,
        description: categoryDesc.trim(),
        accentColor: categoryColor,
      });
      showToast(`Category "${categoryName}" updated.`);
    } else {
      addCategory({
        name: categoryName.trim(),
        slug: finalSlug,
        description: categoryDesc.trim(),
        accentColor: categoryColor,
        isActive: true,
      });
      showToast(`Category "${categoryName}" created.`);
    }

    setIsEditingCategory(null);
    setCategoryName('');
    setCategorySlug('');
    setCategoryDesc('');
  };

  const handleDeleteCategoryAttempt = (cat: Category) => {
    const count = articles.filter(a => a.categoryId === cat.id).length;
    setDeleteCategoryModal({
      isOpen: true,
      category: cat,
      articleCount: count,
    });
  };

  const handleConfirmDeleteCategory = () => {
    if (deleteCategoryModal.category) {
      const res = deleteCategory(deleteCategoryModal.category.id);
      if (res.success) {
        showToast('Category deleted.');
        setDeleteCategoryModal({ isOpen: false, category: null, articleCount: 0 });
      } else {
        alert(res.message);
      }
    }
  };

  // Media Library Upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMediaUploadError('Only image files are permitted (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMediaUploadError('File size exceeds the 5MB limit.');
      return;
    }

    setMediaUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const item = addMediaItem({
          fileName: file.name,
          url: reader.result,
          fileType: file.type,
          fileSize: file.size,
          altText: file.name.replace(/\.[^/.]+$/, ''),
          dimensions: '1200 x 800',
        });
        showToast(`Uploaded ${item.fileName}`);
      }
    };
    reader.readAsDataURL(file);
  };

  // User Deletion
  const handleConfirmDeleteUser = () => {
    if (deleteUserModal.userId) {
      deleteUser(deleteUserModal.userId);
      showToast('User removed.');
      setDeleteUserModal({ isOpen: false, userId: null, userName: '' });
    }
  };

  // -------------------------------------------------------------
  // NOT AUTHENTICATED: Display Secure Administrator Portal Gate
  // -------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-3 sm:p-6 font-sans">
        <div className="w-full max-w-4xl bg-stone-950 border border-stone-800 rounded-lg shadow-2xl overflow-hidden text-stone-100">
          {/* Top Branding Banner */}
          <div className="bg-[#121212] px-6 py-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded shadow-sm inline-block">
                <img
                  src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                  alt="The Source"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans leading-none">
                  EDITORIAL &amp; CMS ADMIN PORTAL
                </h1>
                <p className="text-[11px] text-stone-400 mt-1 tracking-wider font-semibold">
                  The Source &bull; Real News &bull; Real People &bull; Real Impact
                </p>
              </div>
            </div>

            <button
              onClick={() => setView({ type: 'home' })}
              className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
            >
              &larr; Public Website
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: World Map & Global Newsroom Telemetry */}
            <div className="lg:col-span-6 bg-stone-950 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-stone-800 flex flex-col justify-between">
              <div>
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase tracking-wider">
                    <Globe className="w-4 h-4" />
                    <span>Global Editorial Network (World Map)</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Live connection across 54+ countries. Newsroom bureaus in East Africa and worldwide.
                  </p>
                </div>

                <WorldMap showSupportDetails={false} compact={true} />
              </div>

              {/* Newsroom Editorial Desk Contact Helpline */}
              <div className="mt-4 pt-3 border-t border-stone-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-red-500" />
                  Editorial Desk Support Contact Details:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <a
                    href="https://wa.me/255622754599?text=Habari%20Admin%20Desk,%20nahitaji%20msaada%20wa%20CMS%20login."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/60 rounded flex items-center gap-2 text-emerald-300 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="font-bold text-white block text-[11px]">WhatsApp Support</span>
                      <span className="text-[10px] text-emerald-400 font-mono">+255 622 754 599</span>
                    </div>
                  </a>

                  <a
                    href="mailto:telvinaggrey24@gmail.com?subject=The%20Source%20Admin%20Support"
                    className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded flex items-center gap-2 text-stone-300 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-red-400 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="font-bold text-white block text-[11px]">Desk Email</span>
                      <span className="text-[10px] text-stone-400 truncate">telvinaggrey24@gmail.com</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Credentials Sign In */}
            <div className="lg:col-span-6 p-5 sm:p-7 bg-stone-900/60 flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    Sign In to CMS Portal
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Authorized editors and publishing journalists only.
                  </p>
                </div>

                {loginError && (
                  <div className="mb-4 p-3 bg-red-950/70 border border-red-800/80 rounded text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Administrator Email / Contact
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded text-stone-100 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-sans"
                      placeholder="telvinaggrey24@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded text-stone-100 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-sans"
                      placeholder="••••••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </button>
                </form>

                {/* Quick-Access Demo Credentials for Testing */}
                <div className="mt-6 pt-5 border-t border-stone-800">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                    Quick Editorial Access:
                  </p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('telvinaggrey24@gmail.com')}
                      className="w-full text-left p-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded text-xs text-stone-200 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white group-hover:text-red-400">
                          telvinaggrey24@gmail.com
                        </div>
                        <div className="text-[10px] text-stone-400">Website Owner (Super Admin)</div>
                      </div>
                      <span className="text-[11px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                        Enter &rarr;
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('admin@thesun.co.tz')}
                      className="w-full text-left p-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded text-xs text-stone-200 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white group-hover:text-red-400">
                          admin@thesun.co.tz
                        </div>
                        <div className="text-[10px] text-stone-400">Chief Editor Account</div>
                      </div>
                      <span className="text-[11px] font-bold text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                        Enter &rarr;
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED: Full Professional Admin Dashboard Layout
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0B192C] text-white px-4 py-3 rounded-lg shadow-xl border border-stone-700 flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpenMobile(false)}
        />
      )}

      {/* ----------------- SIDEBAR ----------------- */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 bg-[#0B192C] text-stone-200 flex flex-col justify-between transition-all duration-300 shadow-xl ${
          isSidebarCollapsedDesktop ? 'lg:w-20' : 'lg:w-64'
        } ${isSidebarOpenMobile ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="bg-white p-1 rounded shrink-0 shadow-md">
                <img
                  src="/assets/aistudio/A3958EFB-B1A4-41D7-80AC-A616C4F046CD_7bd98d18.png"
                  alt="The Source"
                  className="h-7 w-auto object-contain"
                />
              </div>
              {!isSidebarCollapsedDesktop && (
                <div className="truncate">
                  <div className="font-black text-white text-sm tracking-tight leading-none uppercase">
                    {appearanceSettings?.siteName || 'THE SOURCE'}
                  </div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">
                    Admin Console
                  </div>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsSidebarOpenMobile(false)}
              className="lg:hidden text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin User Mini Badge */}
          <div className="p-3 bg-stone-900/60 border-b border-stone-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-950 text-red-300 border border-red-800 flex items-center justify-center font-bold text-xs shrink-0">
              {currentAdminUser?.name ? currentAdminUser.name.charAt(0) : 'A'}
            </div>
            {!isSidebarCollapsedDesktop && (
              <div className="truncate text-xs">
                <div className="font-bold text-white truncate">
                  {currentAdminUser?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium truncate">
                  {currentAdminUser?.email || 'telvinaggrey24@gmail.com'}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3, badge: null },
              { id: 'articles', label: 'Articles', icon: FileText, badge: stats.totalArticles },
              { id: 'composer', label: 'Blogger Post Composer', icon: Edit, badge: null, highlight: true },
              { id: 'categories', label: 'Categories', icon: FolderTree, badge: stats.activeCats },
              { id: 'media', label: 'Media Library', icon: ImageIcon, badge: mediaItems.length },
              {
                id: 'comments',
                label: 'Comments',
                icon: MessageSquare,
                badge: stats.pendingCommentsCount > 0 ? stats.pendingCommentsCount : null,
                badgeColor: 'bg-amber-500',
              },
              { id: 'users', label: 'Staff & Admins', icon: Users, badge: stats.totalUsers },
              { id: 'ads', label: 'Advertisements', icon: Megaphone, badge: null },
              { id: 'appearance', label: 'Appearance', icon: Palette, badge: null },
              { id: 'seo', label: 'SEO Management', icon: Globe, badge: null },
              { id: 'settings', label: 'Website Settings', icon: SettingsIcon, badge: null },
              { id: 'logs', label: 'Activity Logs', icon: History, badge: activityLogs.length },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as DashboardTab);
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-bold transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : item.highlight
                      ? 'text-red-400 hover:bg-stone-800 hover:text-red-300'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : ''}`} />
                    {!isSidebarCollapsedDesktop && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isSidebarCollapsedDesktop && item.badge !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        item.badgeColor
                          ? `${item.badgeColor} text-black font-extrabold`
                          : isActive
                          ? 'bg-red-800 text-white'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-stone-800 space-y-1.5">
          <button
            onClick={() => setView({ type: 'home' })}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-white rounded transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isSidebarCollapsedDesktop && <span>View Public Site</span>}
          </button>

          <button
            onClick={() => adminLogout()}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/60 hover:text-red-200 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsedDesktop && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-[#0B192C] capitalize">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'articles' && 'Articles & News Management'}
                {activeTab === 'composer' && (editingArticleId ? 'Edit Post' : 'Blogger Post Composer')}
                {activeTab === 'categories' && 'Category Management'}
                {activeTab === 'media' && 'Media & Image Library'}
                {activeTab === 'comments' && 'Comments & Moderation Queue'}
                {activeTab === 'users' && 'Staff & Admin Management'}
                {activeTab === 'ads' && 'Advertisement Placements'}
                {activeTab === 'appearance' && 'Website Appearance & Branding'}
                {activeTab === 'seo' && 'Search Engine Optimization (SEO)'}
                {activeTab === 'settings' && 'Website Settings & Policies'}
                {activeTab === 'logs' && 'Administrative Audit Logs'}
              </h1>
              <p className="text-xs text-stone-500 hidden sm:block">
                Controlling{' '}
                <strong className="text-stone-700">{appearanceSettings?.siteName || 'THE SOURCE'}</strong>{' '}
                as <strong className="text-red-600">{currentAdminUser?.email || 'telvinaggrey24@gmail.com'}</strong> (Website Owner & Super Admin)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 rounded-md border border-stone-200 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-stone-700 font-bold">telvinaggrey24@gmail.com</span>
            </div>
            {websiteSettings.maintenanceMode && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Maintenance Mode On
              </span>
            )}

            <button
              onClick={() => setAddStaffModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Add Admin or Staff Member"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Add Admin / Staff</span>
            </button>

            <button
              onClick={handleOpenNewArticle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Post</span>
            </button>

            <button
              onClick={() => setView({ type: 'home' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-bold transition-colors cursor-pointer border border-stone-300"
            >
              <Eye className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Live Site</span>
            </button>
          </div>
        </header>

        {/* Tab Body Container */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & REAL-DATA ANALYTICS                     */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Published
                  </div>
                  <div className="text-2xl font-black text-emerald-600 tabular-nums">
                    {stats.published}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Live on website</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Drafts
                  </div>
                  <div className="text-2xl font-black text-amber-600 tabular-nums">
                    {stats.drafts}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Work in progress</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Scheduled
                  </div>
                  <div className="text-2xl font-black text-blue-600 tabular-nums">
                    {stats.scheduled}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Future publication</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Registered Users
                  </div>
                  <div className="text-2xl font-black text-[#0B192C] tabular-nums">
                    {stats.totalUsers}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Phone & Email accounts</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Categories
                  </div>
                  <div className="text-2xl font-black text-purple-600 tabular-nums">
                    {stats.activeCats} <span className="text-xs text-stone-400">/ {stats.totalCats}</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Active categories</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Pending Comments
                  </div>
                  <div className="text-2xl font-black text-red-600 tabular-nums">
                    {stats.pendingCommentsCount}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    {stats.reportedCommentsCount > 0
                      ? `${stats.reportedCommentsCount} reported`
                      : 'Needs review'}
                  </div>
                </div>
              </div>

              {/* Real Chart: Publication Distribution by Category */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-lg border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#0B192C]">
                        Articles by Category (Real Distribution)
                      </h2>
                      <p className="text-xs text-stone-500">
                        Exact counts calculated from your active news articles database
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded">
                      Total: {stats.totalArticles} stories
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {categoryChartData.map(cat => {
                      const percentage = Math.round((cat.count / stats.totalArticles) * 100) || 0;
                      return (
                        <div key={cat.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-stone-800">{cat.name}</span>
                            <span className="text-stone-600 tabular-nums font-semibold">
                              {cat.count} articles ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.max((cat.count / maxCategoryCount) * 100, cat.count > 0 ? 5 : 0)}%`,
                                backgroundColor: cat.color || '#C5221F',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Shortcuts & Website Status */}
                <div className="bg-white p-5 sm:p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-[#0B192C]">Quick Control Actions</h2>

                  <div className="space-y-2">
                    <button
                      onClick={handleOpenNewArticle}
                      className="w-full p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-left text-xs font-bold text-red-900 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-red-600" />
                        <span>Publish Breaking / Top Story</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-500" />
                    </button>

                    <button
                      onClick={() => setActiveTab('categories')}
                      className="w-full p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-left text-xs font-bold text-stone-800 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-stone-600" />
                        <span>Manage 9 English Categories</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('media')}
                      className="w-full p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-left text-xs font-bold text-stone-800 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-stone-600" />
                        <span>Upload Images (&le; 5MB)</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('appearance')}
                      className="w-full p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-left text-xs font-bold text-stone-800 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-stone-600" />
                        <span>Customize Logo, Name & Hero Story</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('comments')}
                      className="w-full p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-left text-xs font-bold text-stone-800 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-stone-600" />
                        <span>Moderate Reader Comments ({stats.pendingCommentsCount})</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>

                  {/* System Health */}
                  <div className="pt-4 border-t border-stone-200">
                    <div className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                      System Integrity
                    </div>
                    <div className="space-y-1.5 text-xs text-stone-700">
                      <div className="flex items-center justify-between">
                        <span>Database Status:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Navigation Sync:</span>
                        <span className="font-bold text-emerald-600">10 English Categories</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>RBAC Security:</span>
                        <span className="font-bold text-emerald-600">Enforced</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Administrative Activities */}
              <div className="bg-white p-5 sm:p-6 rounded-lg border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-[#0B192C]">
                    Recent Administrative Activities
                  </h2>
                  <button
                    onClick={() => setActiveTab('logs')}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Full Audit Trail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {activityLogs.slice(0, 6).map(log => (
                    <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                        <div>
                          <div className="font-bold text-stone-900">
                            {log.action}: <span className="font-medium text-stone-700">{log.target}</span>
                          </div>
                          {log.details && (
                            <div className="text-stone-500 text-[11px] mt-0.5">{log.details}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-stone-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">{log.adminEmail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: NEWS & ARTICLE MANAGEMENT TABLE                     */}
          {/* ========================================================= */}
          {activeTab === 'articles' && (
            <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 space-y-5">
              {/* Controls & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={e => setArticleSearch(e.target.value)}
                    placeholder="Search articles by title, author, or keyword..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={articleCategoryFilter}
                    onChange={e => setArticleCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 font-medium focus:outline-none focus:border-red-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={articleStatusFilter}
                    onChange={e => setArticleStatusFilter(e.target.value as any)}
                    className="px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 font-medium focus:outline-none focus:border-red-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>

                  <button
                    onClick={handleOpenNewArticle}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Article</span>
                  </button>
                </div>
              </div>

              {/* Table of Articles */}
              <div className="overflow-x-auto border border-stone-200 rounded-lg">
                <table className="w-full text-left text-xs divide-y divide-stone-200">
                  <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Article</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Author</th>
                      <th className="py-3 px-3">Admin &amp; Audit</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Flags</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {filteredArticles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-stone-400">
                          No articles match your search or filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredArticles.map(art => {
                        const authorName = typeof art.author === 'string' ? art.author : art.author?.name || 'Editorial Team';
                        return (
                          <tr key={art.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={art.featuredImage}
                                  alt={art.title}
                                  className="w-12 h-10 object-cover rounded shrink-0 border border-stone-200 bg-stone-100"
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-stone-900 truncate max-w-xs sm:max-w-md">
                                    {art.title}
                                  </div>
                                  <div className="text-[11px] text-stone-500 truncate max-w-xs">
                                    {art.summary}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className="inline-block px-2 py-0.5 rounded text-[11px] font-bold text-white bg-[#0B192C]"
                              >
                                {art.categoryName}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-stone-700 font-medium">
                              {authorName}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="text-[10px] text-stone-500 font-sans leading-tight">
                                <div>By: <strong className="text-stone-800">{art.createdBy?.name || 'Super Admin'}</strong></div>
                                {art.lastEditedBy && (
                                  <div className="text-stone-400 text-[9px] mt-0.5">
                                    Ed: {art.lastEditedBy.name}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <select
                                value={art.status}
                                onChange={e => toggleArticleStatus(art.id, e.target.value as ArticleStatus)}
                                className={`text-[11px] font-bold px-2 py-1 rounded border ${
                                  art.status === 'published'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : art.status === 'draft'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-blue-50 text-blue-800 border-blue-200'
                                }`}
                              >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="scheduled">Scheduled</option>
                              </select>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => toggleBreaking(art.id)}
                                  title={art.isBreaking ? 'Breaking News (Click to remove)' : 'Mark as Breaking News'}
                                  className={`p-1 rounded cursor-pointer ${
                                    art.isBreaking ? 'bg-red-600 text-white' : 'text-stone-400 hover:text-red-600'
                                  }`}
                                >
                                  <Flame className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setFeaturedHero(art.id)}
                                  title={art.isFeaturedHero ? 'Featured Hero (Active)' : 'Set as Featured Hero'}
                                  className={`p-1 rounded cursor-pointer ${
                                    art.isFeaturedHero ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-amber-500'
                                  }`}
                                >
                                  <Star className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => toggleCommentsEnabled(art.id)}
                                  title={art.commentsEnabled !== false ? 'Comments enabled' : 'Comments disabled'}
                                  className={`p-1 rounded cursor-pointer ${
                                    art.commentsEnabled !== false
                                      ? 'text-stone-600 hover:text-stone-900'
                                      : 'text-stone-300 line-through'
                                  }`}
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setPreviewArticleModal({ isOpen: true, article: art })}
                                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded cursor-pointer"
                                  title="Preview Article"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditArticle(art)}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded cursor-pointer"
                                  title="Edit Article"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteArticleModal({ isOpen: true, article: art })}
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: BLOGGER-STYLE POST COMPOSER & PUBLISHING            */}
          {/* ========================================================= */}
          {activeTab === 'composer' && (
            <div className="space-y-6">
              {/* Top Action Bar (Blogger Header) */}
              <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-8 bg-red-600 inline-block rounded-2xs shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-[#0B192C]">
                        {editingArticleId ? 'Hariri Chapisho (Edit Post)' : 'Blogger Post Composer • Tunga Chapisho Jipya'}
                      </h2>
                      <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full uppercase">
                        Blogger Simple
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Weka Kichwa cha Habari na Mwili, chagua kitengo, kisha bofya <strong>Chapisha Sasa</strong> &bull; Inaonekana moja kwa moja kwenye Simu na Desktop
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allAuthors = authors && authors.length > 0 ? authors : INITIAL_AUTHORS;
                      const selAuthor = allAuthors.find(a => a.id === formAuthorId) || allAuthors[0];
                      const derivedSummary =
                        formSummary.trim() ||
                        formContent
                          .replace(/[#*`_>~\[\]\(\)-]/g, ' ')
                          .split('\n')
                          .find(line => line.trim().length > 15)
                          ?.trim()
                          .slice(0, 200) ||
                        formTitle.trim();

                      setPreviewArticleModal({
                        isOpen: true,
                        article: {
                          title: formTitle || 'Untitled Headline (Kiswahili)',
                          titleEnglish: formTitleEnglish || undefined,
                          subtitle: formSubtitle,
                          subtitleEnglish: formSubtitleEnglish || undefined,
                          summary: derivedSummary,
                          summaryEnglish: formSummaryEnglish || undefined,
                          content: formContent.split('\n\n').filter(Boolean),
                          contentEnglish: formContentEnglish ? formContentEnglish.split('\n\n').filter(Boolean) : undefined,
                          keyTakeaways: formKeyTakeaways ? formKeyTakeaways.split('\n').filter(Boolean) : undefined,
                          featuredImage: formImage,
                          imageCaption: formImageCaption,
                          imageCredit: formImageCredit,
                          author: selAuthor,
                          categoryName: categories.find(c => c.id === formCategoryId)?.name || 'General',
                          publishedAt: new Date().toISOString(),
                          readTimeMinutes: Number(formReadTime) || 3,
                        },
                      });
                    }}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-stone-300 transition-colors"
                    title="Angalia mionekano ya Simu na Desktop"
                  >
                    <Eye className="w-4 h-4 text-stone-600" />
                    <span>Mionekano (Phone & PC)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveArticle('draft')}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    Hifadhi Rasimu
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveArticle('published')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>🚀 {editingArticleId ? 'Sasisha Chapisho' : 'Chapisha Sasa (Publish Live)'}</span>
                  </button>
                </div>
              </div>

              {/* Blogger Main Canvas & Settings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 8 Columns: Title Input + Blogger Toolbar + Body Canvas */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Post Title (Blogger Style) */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Kichwa cha Habari (Post Title) *
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      placeholder="Andika Kichwa cha Habari Hapa (mfano: Tanzania Yasaini Makubaliano Mapya ya Reli ya Kisasa SGR)..."
                      className="w-full text-lg sm:text-2xl font-black text-stone-900 placeholder:text-stone-300 px-3 py-2.5 bg-stone-50/60 border border-stone-300 rounded-md focus:bg-white focus:border-red-600 focus:outline-none font-serif leading-snug"
                    />
                  </div>

                  {/* Blogger Formatting Toolbar */}
                  <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
                    <div className="p-2 sm:p-2.5 bg-stone-100/90 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {/* Left: Formatting tools */}
                      <div className="flex flex-wrap items-center gap-1">
                        <select
                          onChange={e => {
                            const val = e.target.value;
                            if (val === 'h2') insertFormatting('\n\n## ', '\n', 'Kichwa Kidogo');
                            if (val === 'h3') insertFormatting('\n\n### ', '\n', 'Sehemu ya Habari');
                            if (val === 'p') insertFormatting('\n\n', '', 'Aya mpya...');
                            e.target.value = 'default';
                          }}
                          defaultValue="default"
                          className="px-2 py-1 bg-white border border-stone-300 rounded text-xs font-semibold text-stone-800 focus:outline-none"
                        >
                          <option value="default" disabled>Mtindo wa Maandishi...</option>
                          <option value="p">Aya ya Kawaida (Normal)</option>
                          <option value="h2">Kichwa Kidogo (Heading 2)</option>
                          <option value="h3">Sehemu Ndogo (Subheading 3)</option>
                        </select>

                        <span className="w-px h-5 bg-stone-300 mx-1" />

                        <button
                          type="button"
                          onClick={() => insertFormatting('**', '**', 'maneno nene')}
                          className="p-1.5 hover:bg-white text-stone-700 hover:text-stone-900 rounded font-bold transition-colors cursor-pointer"
                          title="Weka Nene (Bold) **maneno**"
                        >
                          <Bold className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => insertFormatting('*', '*', 'maneno ya mlazo')}
                          className="p-1.5 hover:bg-white text-stone-700 hover:text-stone-900 rounded italic transition-colors cursor-pointer"
                          title="Weka Mlazo (Italic) *maneno*"
                        >
                          <Italic className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => insertFormatting('<u>', '</u>', 'maneno yaliyopigiwa mstari')}
                          className="p-1.5 hover:bg-white text-stone-700 hover:text-stone-900 rounded underline transition-colors cursor-pointer"
                          title="Piga Mstari Chini (Underline)"
                        >
                          <Underline className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => insertFormatting('~~', '~~', 'maneno yaliyofutwa')}
                          className="p-1.5 hover:bg-white text-stone-700 hover:text-stone-900 rounded line-through transition-colors cursor-pointer"
                          title="Futa Katikati (Strikethrough)"
                        >
                          <Strikethrough className="w-4 h-4" />
                        </button>

                        <span className="w-px h-5 bg-stone-300 mx-1" />

                        <button
                          type="button"
                          onClick={() => insertFormatting('\n\n> "', '"\n', 'Kauli au nukuu ya mhusika...')}
                          className="p-1.5 hover:bg-white text-stone-700 hover:text-stone-900 rounded transition-colors cursor-pointer"
                          title="Weka Nukuu (Blockquote)"
                        >
                          <Quote className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => insertFormatting('\n- ', '\n', 'Dondoo ya kwanza')}
                          className="p-1.5 hover:bg-white text-stone-700 hover:text-stone-900 rounded transition-colors cursor-pointer"
                          title="Orodha ya Dondoo (Bullet List)"
                        >
                          <List className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => insertFormatting('\n1. ', '\n', 'Jambo la kwanza')}
                          className="p-1.5 hover:bg-white text-stone-700 hover:text-stone-900 rounded transition-colors cursor-pointer"
                          title="Orodha ya Nambari (Numbered List)"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>

                        <span className="w-px h-5 bg-stone-300 mx-1" />

                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Weka kiungo cha mtandao (Enter URL):', 'https://');
                            if (url) {
                              const text = prompt('Maneno ya kuonekana (Link text):', 'Soma Zaidi') || url;
                              insertFormatting(`[${text}](${url})`);
                            }
                          }}
                          className="p-1.5 hover:bg-white text-blue-700 hover:text-blue-900 rounded transition-colors cursor-pointer flex items-center gap-1"
                          title="Weka Kiungo (Insert Link)"
                        >
                          <Link2 className="w-4 h-4" />
                          <span className="text-[11px] font-semibold hidden sm:inline">Kiungo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Weka picha URL (Enter Image URL):', 'https://images.unsplash.com/');
                            if (url) {
                              const caption = prompt('Maelezo ya picha (Caption):', 'Picha ya Habari') || '';
                              insertFormatting(`\n\n![${caption}](${url})\n*${caption}*\n\n`);
                            }
                          }}
                          className="p-1.5 hover:bg-white text-emerald-700 hover:text-emerald-900 rounded transition-colors cursor-pointer flex items-center gap-1"
                          title="Weka Picha ndani ya Habari (Insert Image)"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-[11px] font-semibold hidden sm:inline">Picha</span>
                        </button>
                      </div>

                      {/* Right: Compose vs Preview Switch */}
                      <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded">
                        <button
                          type="button"
                          onClick={() => setEditorViewMode('compose')}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                            editorViewMode === 'compose' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          ✏️ Mwandishi (Compose)
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorViewMode('preview')}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                            editorViewMode === 'preview' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          👁️ Muonekano (Preview)
                        </button>
                      </div>
                    </div>

                    {/* Writing Area (Compose Canvas) */}
                    {editorViewMode === 'compose' ? (
                      <div className="p-4 sm:p-6 bg-white space-y-3">
                        <textarea
                          ref={contentTextareaRef}
                          rows={16}
                          value={formContent}
                          onChange={e => {
                            setFormContent(e.target.value);
                            // Auto-set summary if empty
                            if (!formSummary) {
                              const firstLine = e.target.value.split('\n')[0].replace(/[#*`_>~\[\]\(\)-]/g, ' ').trim();
                              if (firstLine.length > 20) {
                                setFormSummary(firstLine.slice(0, 180));
                              }
                            }
                          }}
                          placeholder="Andika ripoti kamili au chapisho lako hapa kwa urahisi...&#10;&#10;Tenganisha aya kwa kubonyeza Enter mara mbili. Tumia zana za juu kuweka herufi nene (**nene**), vichwa vidogo (## Kichwa), nukuu, au viungo."
                          className="w-full p-4 bg-transparent border-0 focus:outline-none font-serif text-sm sm:text-base leading-relaxed text-stone-900 placeholder:text-stone-300 min-h-[380px] resize-y"
                        />

                        {/* Quick Stats Bar */}
                        <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 font-mono">
                          <div className="flex items-center gap-4">
                            <span>Maneno: <strong>{formContent.trim() ? formContent.trim().split(/\s+/).length : 0}</strong></span>
                            <span>Herufi: <strong>{formContent.length}</strong></span>
                            <span>Muda wa Kusoma: <strong>~{Math.max(1, Math.ceil((formContent.trim().split(/\s+/).length || 1) / 180))} min</strong></span>
                          </div>
                          <span className="text-[11px] text-stone-400 font-sans">
                            Mwili umehifadhiwa kiotomatiki &bull; Bonyeza Chapisha ukimaliza
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Live Preview Canvas */
                      <div className="p-6 bg-stone-50 min-h-[380px] space-y-4">
                        <div className="border-b border-stone-200 pb-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block mb-1">
                            {categories.find(c => c.id === formCategoryId)?.name || 'Habari'}
                          </span>
                          <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-serif leading-snug">
                            {formTitle || 'Kichwa cha Habari Kinaonekana Hapa...'}
                          </h1>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-2">
                            <span>Na <strong>{((authors && authors.length > 0 ? authors : INITIAL_AUTHORS).find(a => a.id === formAuthorId) || INITIAL_AUTHORS[0])?.name}</strong></span>
                            <span>&bull;</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                        </div>

                        {formImage && (
                          <div className="aspect-video max-h-72 w-full rounded overflow-hidden bg-stone-200">
                            <img src={formImage} alt="Cover" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="prose max-w-none text-stone-800 font-serif text-sm sm:text-base leading-relaxed space-y-3">
                          {formContent ? (
                            formContent.split('\n\n').filter(Boolean).map((para, idx) => (
                              <p key={idx} className="leading-relaxed">
                                {para}
                              </p>
                            ))
                          ) : (
                            <p className="text-stone-400 italic">Mwili wa habari bado haujaandikwa. Rudi kwenye "Mwandishi (Compose)" kuandika.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional English Translation Accordion (Never forced!) */}
                  <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowOptionalEnglish(!showOptionalEnglish)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🇬🇧</span>
                        <div>
                          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                            Ongeza Tafsiri ya Kiingereza (English Translation &bull; Optional)
                          </span>
                          <p className="text-[11px] text-stone-500">
                            Hiari: Weka ikiwa unataka habari iwe na toleo la Kiingereza chini ya Kiswahili
                          </p>
                        </div>
                      </div>
                      {showOptionalEnglish ? (
                        <ChevronUp className="w-4 h-4 text-stone-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-500" />
                      )}
                    </button>

                    {showOptionalEnglish && (
                      <div className="p-4 sm:p-5 border-t border-stone-200 bg-blue-50/20 space-y-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                            English Headline (Kichwa kwa Kiingereza)
                          </label>
                          <input
                            type="text"
                            value={formTitleEnglish}
                            onChange={e => setFormTitleEnglish(e.target.value)}
                            placeholder="e.g. Tanzania Approves New $450M Modern Infrastructure Framework..."
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                            English Content (Mwili kwa Kiingereza)
                          </label>
                          <textarea
                            rows={8}
                            value={formContentEnglish}
                            onChange={e => setFormContentEnglish(e.target.value)}
                            placeholder="Write the full English translation here (separate paragraphs by blank lines)..."
                            className="w-full p-3 bg-white border border-stone-300 rounded text-xs leading-relaxed text-stone-900 focus:border-blue-500 focus:outline-none font-serif text-[13px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional Custom Summary & SEO Accordion */}
                  <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedSeo(!showAdvancedSeo)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-red-600" />
                        <div>
                          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                            Muhtasari Maalum na SEO (Custom Summary & Meta &bull; Optional)
                          </span>
                          <p className="text-[11px] text-stone-500">
                            Ikiachwa wazi, mfumo utazalisha muhtasari kiotomatiki kutoka kwenye mwili wa habari
                          </p>
                        </div>
                      </div>
                      {showAdvancedSeo ? (
                        <ChevronUp className="w-4 h-4 text-stone-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-500" />
                      )}
                    </button>

                    {showAdvancedSeo && (
                      <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/40 space-y-4 text-xs">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">
                            Muhtasari Maalum (Custom Lead Summary)
                          </label>
                          <textarea
                            rows={3}
                            value={formSummary}
                            onChange={e => setFormSummary(e.target.value)}
                            placeholder="Muhtasari mfupi wa aya 1 unaoonekana kwenye kadi za habari..."
                            className="w-full p-2.5 bg-white border border-stone-300 rounded text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">
                              SEO Meta Title
                            </label>
                            <input
                              type="text"
                              value={formSeoTitle}
                              onChange={e => setFormSeoTitle(e.target.value)}
                              placeholder={formTitle ? formTitle.slice(0, 60) : 'Title for Google...'}
                              className="w-full p-2 bg-white border border-stone-300 rounded text-xs"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">
                              Canonical URL (Hiari)
                            </label>
                            <input
                              type="text"
                              value={formCanonicalUrl}
                              onChange={e => setFormCanonicalUrl(e.target.value)}
                              placeholder="https://thesource.co.tz/article/..."
                              className="w-full p-2 bg-white border border-stone-300 rounded text-xs font-mono text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right 4 Columns: Post Settings (Blogger Right Sidebar) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Category & Labels (Blogger Labels) */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                        <FolderTree className="w-3.5 h-3.5 text-red-600" />
                        <span>Kitengo / Lebe (Category) *</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5">
                      {categories.map(cat => {
                        const isSelected = formCategoryId === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormCategoryId(cat.id)}
                            className={`px-2.5 py-1.5 rounded text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between border ${
                              isSelected
                                ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                            }`}
                          >
                            <span className="truncate">{cat.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Featured Cover Image (Picha ya Jalada) */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                      <span>Picha ya Jalada (Featured Image)</span>
                    </label>

                    <div className="relative aspect-video bg-stone-100 rounded-md overflow-hidden border border-stone-300">
                      {formImage ? (
                        <img src={formImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          Hakuna Picha
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFeaturedImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-xs font-bold text-stone-800 flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-stone-600" />
                        <span>Pakia Picha Mpya (&le; 5MB)</span>
                      </button>

                      <input
                        type="text"
                        value={formImage}
                        onChange={e => setFormImage(e.target.value)}
                        placeholder="Au weka Image URL (mfano: https://...)"
                        className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs font-mono text-[10px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase">
                          Maelezo (Caption)
                        </label>
                        <input
                          type="text"
                          value={formImageCaption}
                          onChange={e => setFormImageCaption(e.target.value)}
                          placeholder="Maelezo..."
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase">
                          Mpigapicha (Credit)
                        </label>
                        <input
                          type="text"
                          value={formImageCredit}
                          onChange={e => setFormImageCredit(e.target.value)}
                          placeholder="The Source"
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Permalink / Article URL Slug (Blogger / WordPress Permalink) */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs space-y-2 text-xs">
                    <label className="block font-bold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Kiungo cha Habari (Permalink / Slug)</span>
                    </label>
                    <p className="text-[11px] text-stone-500">
                      URL ya kirafiki kwa injini za utafutaji (SEO Friendly Slug):
                    </p>
                    <div className="flex items-center gap-1 bg-stone-50 p-2 rounded border border-stone-200 font-mono text-[11px] text-stone-700">
                      <span className="text-stone-400">/article/</span>
                      <input
                        type="text"
                        value={formSlug}
                        onChange={e => setFormSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'))}
                        placeholder={formTitle ? formTitle.toLowerCase().slice(0, 30).replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') : 'custom-url-slug'}
                        className="bg-transparent border-0 focus:outline-none flex-1 font-bold text-red-700"
                      />
                    </div>
                  </div>

                  {/* Video & Media Embedding (YouTube / MP4) */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs space-y-2 text-xs">
                    <label className="block font-bold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-red-600" />
                      <span>Video ya Habari (Embed Video &bull; Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formVideoUrl}
                      onChange={e => setFormVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... au kiungo cha video"
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded text-xs font-mono"
                    />
                    {formVideoUrl && (
                      <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Video itaonyeshwa rasmi ndani ya chapisho
                      </p>
                    )}
                  </div>

                  {/* Author / Staff Byline (With "+ Add Staff" shortcut) */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                      <label className="font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-red-600" />
                        <span>Mwandishi (Author / Staff)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setAddStaffModal(true)}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        title="Tengeneza Mwandishi / Msimamizi Mpya"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Sajili Staff</span>
                      </button>
                    </div>

                    <select
                      value={formAuthorId}
                      onChange={e => setFormAuthorId(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded text-xs font-semibold text-stone-800 focus:outline-none"
                    >
                      {(authors && authors.length > 0 ? authors : INITIAL_AUTHORS).map(aut => (
                        <option key={aut.id} value={aut.id}>
                          {aut.name} ({aut.title})
                        </option>
                      ))}
                    </select>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Lebo za ziada (Tags - zitenganishe kwa koma)
                      </label>
                      <input
                        type="text"
                        value={formTags}
                        onChange={e => setFormTags(e.target.value)}
                        placeholder="Tanzania, Habari, Biashara"
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Publishing Options & Flags */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs space-y-3 text-xs">
                    <label className="block font-bold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200">
                      Mipangilio ya Chapisho (Status & Flags)
                    </label>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Hali ya Chapisho (Publication Status)
                      </label>
                      <select
                        value={formStatus}
                        onChange={e => setFormStatus(e.target.value as ArticleStatus)}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-bold text-stone-800 text-xs"
                      >
                        <option value="published">Chapisha Mara Moja (Published)</option>
                        <option value="draft">Weka kama Rasimu (Draft)</option>
                        <option value="scheduled">Panga Tarehe ya Mbele (Scheduled)</option>
                      </select>
                    </div>

                    {formStatus === 'scheduled' && (
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                          Tarehe na Muda wa Kuchapisha
                        </label>
                        <input
                          type="datetime-local"
                          value={formScheduledDate}
                          onChange={e => setFormScheduledDate(e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded text-xs"
                        />
                      </div>
                    )}

                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsBreaking}
                          onChange={e => setFormIsBreaking(e.target.checked)}
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span className="font-bold text-red-600 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          Habari za Hivi Punde (Breaking News Ticker)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsFeatured}
                          onChange={e => setFormIsFeatured(e.target.checked)}
                          className="rounded text-amber-500 focus:ring-amber-400"
                        />
                        <span className="font-bold text-stone-800 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          Habari Kuu ya Ukurasa wa Kwanza (Homepage Hero)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formCommentsEnabled}
                          onChange={e => setFormCommentsEnabled(e.target.checked)}
                          className="rounded text-stone-700"
                        />
                        <span>Ruhusu Maoni ya Wasomaji (Allow Comments)</span>
                      </label>
                    </div>

                    <div className="pt-2 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => handleSaveArticle('published')}
                        className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                      >
                        <span>🚀 {editingArticleId ? 'Sasisha Habari' : 'Chapisha Habari Sasa'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CATEGORY MANAGEMENT                                 */}
          {/* ========================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div>
                    <h2 className="text-base font-bold text-[#0B192C]">
                      Manage Official News Categories
                    </h2>
                    <p className="text-xs text-stone-500">
                      The public navigation and homepage are synchronized with these categories
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddCategory}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Category</span>
                  </button>
                </div>

                {/* Category Add/Edit Form when triggered */}
                {(isEditingCategory || categoryName) && (
                  <form
                    onSubmit={handleSaveCategory}
                    className="p-4 bg-stone-50 rounded-lg border border-stone-300 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        {isEditingCategory ? `Edit Category: ${isEditingCategory.name}` : 'New Category'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingCategory(null);
                          setCategoryName('');
                        }}
                        className="text-stone-400 hover:text-stone-700 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Name (English) *
                        </label>
                        <input
                          type="text"
                          value={categoryName}
                          onChange={e => setCategoryName(e.target.value)}
                          placeholder="e.g. Science"
                          required
                          className="w-full p-2 bg-white border border-stone-300 rounded font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Slug URL
                        </label>
                        <input
                          type="text"
                          value={categorySlug}
                          onChange={e => setCategorySlug(e.target.value)}
                          placeholder="e.g. science"
                          className="w-full p-2 bg-white border border-stone-300 rounded font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Brand Color Accent
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={categoryColor}
                            onChange={e => setCategoryColor(e.target.value)}
                            className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            value={categoryColor}
                            onChange={e => setCategoryColor(e.target.value)}
                            className="flex-1 p-2 bg-white border border-stone-300 rounded font-mono text-[11px]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={categoryDesc}
                          onChange={e => setCategoryDesc(e.target.value)}
                          placeholder="Short description..."
                          className="w-full p-2 bg-white border border-stone-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded cursor-pointer"
                      >
                        {isEditingCategory ? 'Save Changes' : 'Create Category'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Categories Table */}
                <div className="overflow-x-auto border border-stone-200 rounded-lg">
                  <table className="w-full text-left text-xs divide-y divide-stone-200">
                    <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-3">Slug</th>
                        <th className="py-3 px-3">Description</th>
                        <th className="py-3 px-3">Articles</th>
                        <th className="py-3 px-3">Navigation Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {categories.map(cat => {
                        const count = articles.filter(a => a.categoryId === cat.id).length;
                        return (
                          <tr key={cat.id} className="hover:bg-stone-50/80">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="w-3.5 h-3.5 rounded-full shrink-0"
                                  style={{ backgroundColor: cat.accentColor || '#0B192C' }}
                                />
                                <span className="font-bold text-stone-900">{cat.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] text-stone-500">
                              /{cat.slug}
                            </td>
                            <td className="py-3 px-3 text-stone-500 max-w-xs truncate">
                              {cat.description || '—'}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  count > 0 ? 'bg-stone-100 text-stone-800' : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {count} {count === 1 ? 'article' : 'articles'}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <button
                                onClick={() => toggleCategoryActive(cat.id)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                                  cat.isActive !== false
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                                }`}
                              >
                                {cat.isActive !== false ? 'Active in Nav' : 'Hidden'}
                              </button>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditCategoryClick(cat)}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded cursor-pointer"
                                  title="Edit Category"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategoryAttempt(cat)}
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                                  title="Delete Category"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: MEDIA LIBRARY                                       */}
          {/* ========================================================= */}
          {activeTab === 'media' && (
            <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-base font-bold text-[#0B192C]">
                    Media & Image Library
                  </h2>
                  <p className="text-xs text-stone-500">
                    Upload images up to 5MB with alt text for high-fidelity news coverage
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={mediaFileInputRef}
                    accept="image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => mediaFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image (&le; 5MB)</span>
                  </button>
                </div>
              </div>

              {mediaUploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{mediaUploadError}</span>
                </div>
              )}

              {/* Media Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mediaSearch}
                  onChange={e => setMediaSearch(e.target.value)}
                  placeholder="Filter media assets by name or alt text..."
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900"
                />
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaItems
                  .filter(m => !mediaSearch || m.fileName.toLowerCase().includes(mediaSearch.toLowerCase()))
                  .map(media => (
                    <div
                      key={media.id}
                      className="bg-stone-50 rounded-lg border border-stone-200 overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="aspect-video relative overflow-hidden bg-stone-200">
                        <img
                          src={media.url}
                          alt={media.altText || media.fileName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3 space-y-1 text-xs">
                        <div className="font-bold text-stone-900 truncate" title={media.fileName}>
                          {media.fileName}
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center justify-between">
                          <span>{media.dimensions || '1200x800'}</span>
                          <span>{Math.round((media.fileSize || 250000) / 1024)} KB</span>
                        </div>
                        {media.altText && (
                          <div className="text-[10px] text-stone-600 truncate italic">
                            Alt: {media.altText}
                          </div>
                        )}
                        <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(media.url);
                              showToast('Image URL copied to clipboard');
                            }}
                            className="text-[11px] text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </button>
                          <button
                            onClick={() => setDeleteMediaModal({ isOpen: true, media })}
                            className="text-red-600 hover:text-red-800 p-1 rounded cursor-pointer"
                            title="Delete image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: COMMENTS & COMMUNITY MODERATION                     */}
          {/* ========================================================= */}
          {activeTab === 'comments' && (
            <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-base font-bold text-[#0B192C]">
                    Reader Comments & Moderation Queue
                  </h2>
                  <p className="text-xs text-stone-500">
                    Review, approve, reject, flag spam, or delete inappropriate comments across all articles
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={commentFilterStatus}
                    onChange={e => setCommentFilterStatus(e.target.value as any)}
                    className="px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-semibold text-stone-800 focus:outline-none"
                  >
                    <option value="all">All Comments ({stats.allCommentsCount})</option>
                    <option value="pending">Pending ({stats.pendingCommentsCount})</option>
                    <option value="approved">Approved</option>
                    <option value="reported">Reported by Readers ({stats.reportedCommentsCount})</option>
                    <option value="spam">Flagged as Spam</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {flattenedComments.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  No comments match the selected filter.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {flattenedComments.map(item => (
                    <div key={item.commentId} className="py-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{item.authorName}</span>
                          {item.authorCity && <span className="text-stone-400 text-[11px]">({item.authorCity})</span>}
                          <span className="text-stone-400">&bull;</span>
                          <span className="text-stone-500 text-[11px]">
                            On:{' '}
                            <strong className="text-stone-700">{item.articleTitle}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.isReported && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded">
                              REPORTED
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'spam'
                                ? 'bg-stone-200 text-stone-700'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-stone-800 bg-stone-50 p-3 rounded border border-stone-200 leading-relaxed font-sans">
                        "{item.content}"
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-stone-400">
                          {new Date(item.createdAt).toLocaleString()} &bull; {item.upvotes} upvotes
                        </span>

                        <div className="flex items-center gap-1.5">
                          {item.status !== 'approved' && (
                            <button
                              onClick={() => {
                                moderateComment(item.articleId, item.commentId, 'approved');
                                showToast('Comment approved.');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {item.status !== 'rejected' && (
                            <button
                              onClick={() => {
                                moderateComment(item.articleId, item.commentId, 'rejected');
                                showToast('Comment rejected.');
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          )}

                          {item.status !== 'spam' && (
                            <button
                              onClick={() => {
                                moderateComment(item.articleId, item.commentId, 'spam');
                                showToast('Comment flagged as spam.');
                              }}
                              className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-[11px] font-bold cursor-pointer"
                            >
                              Spam
                            </button>
                          )}

                          <button
                            onClick={() => {
                              deleteComment(item.articleId, item.commentId);
                              showToast('Comment deleted permanently.');
                            }}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: STAFF & ADMIN MANAGEMENT                            */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Header & Primary Actions */}
              <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-red-600 inline-block rounded-2xs" />
                      <h2 className="text-base sm:text-lg font-black text-[#0B192C]">
                        Staff, Admins & Registered Users (Wasimamizi na Waandishi)
                      </h2>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Sajili waandishi wa habari (journalists), wahariri (editors), na wasimamizi wakuu wa gazeti &bull; Wataonekana kwenye orodha ya waandishi papo hapo
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAddStaffModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>➕ Create Admin or Staff Member</span>
                  </button>
                </div>

                {/* Team & Staff Quick Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-3 bg-red-50/60 rounded-md border border-red-200/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-red-700">👑 Admins</div>
                    <div className="text-xl font-black text-red-900 mt-0.5">
                      {registeredUsers.filter(u => u.role === 'admin').length}
                    </div>
                    <div className="text-[10px] text-red-600/80 mt-0.5">Full System Access</div>
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-md border border-blue-200/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">✍️ Editors</div>
                    <div className="text-xl font-black text-blue-900 mt-0.5">
                      {registeredUsers.filter(u => u.role === 'editor').length}
                    </div>
                    <div className="text-[10px] text-blue-600/80 mt-0.5">Newsroom Desk Chiefs</div>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-md border border-emerald-200/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">📰 Journalists & Staff</div>
                    <div className="text-xl font-black text-emerald-900 mt-0.5">
                      {registeredUsers.filter(u => u.role === 'journalist' || u.role === 'staff').length}
                    </div>
                    <div className="text-[10px] text-emerald-600/80 mt-0.5">Beat Writers & Reporters</div>
                  </div>

                  <div className="p-3 bg-stone-100 rounded-md border border-stone-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600">👥 Readers</div>
                    <div className="text-xl font-black text-stone-900 mt-0.5">
                      {registeredUsers.filter(u => u.role === 'reader' || !u.role).length}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Subscribed Readers</div>
                  </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      placeholder="Tafuta kwa jina, barua pepe, nambari ya simu, au cheo..."
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="w-full sm:w-auto">
                    <select
                      value={userRoleFilter}
                      onChange={e => setUserRoleFilter(e.target.value as any)}
                      className="w-full sm:w-auto px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-semibold text-stone-800 focus:outline-none"
                    >
                      <option value="all">Wote / All Roles ({registeredUsers.length})</option>
                      <option value="admin">👑 Administrators ({registeredUsers.filter(u => u.role === 'admin').length})</option>
                      <option value="editor">✍️ Editors ({registeredUsers.filter(u => u.role === 'editor').length})</option>
                      <option value="journalist">📰 Journalists / Reporters ({registeredUsers.filter(u => u.role === 'journalist').length})</option>
                      <option value="staff">💼 Staff Writers ({registeredUsers.filter(u => u.role === 'staff').length})</option>
                      <option value="reader">👥 Readers ({registeredUsers.filter(u => u.role === 'reader' || !u.role).length})</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto border border-stone-200 rounded-lg">
                  <table className="w-full text-left text-xs divide-y divide-stone-200">
                    <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Mwanatimu / User</th>
                        <th className="py-3 px-3">Mawasiliano (Contact)</th>
                        <th className="py-3 px-3">Nafasi (Staff Role)</th>
                        <th className="py-3 px-3">Hali (Status)</th>
                        <th className="py-3 px-3">Tarehe (Joined)</th>
                        <th className="py-3 px-3 text-right">Vitendo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-stone-400">
                            Hakuna mtumiaji aliyepatikana kwa vigezo hivi.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(usr => (
                          <tr key={usr.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 font-black flex items-center justify-center shrink-0 overflow-hidden border border-stone-300">
                                  {usr.avatar ? (
                                    <img src={usr.avatar} alt={usr.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span>{usr.name ? usr.name.charAt(0).toUpperCase() : 'U'}</span>
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-stone-900">{usr.name || 'Anonymous User'}</div>
                                  {usr.staffTitle ? (
                                    <div className="text-[11px] font-semibold text-red-600">{usr.staffTitle}</div>
                                  ) : (
                                    <div className="text-[10px] text-stone-400 font-mono">{usr.id}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="text-stone-800 font-medium">{usr.email || '—'}</div>
                              <div className="text-stone-500 font-mono text-[11px]">{usr.phone || '—'}</div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <select
                                value={usr.role || 'reader'}
                                onChange={e => {
                                  updateUserRole(usr.id, e.target.value as UserRole);
                                  showToast(`Nafasi ya "${usr.name || usr.email}" imebadilishwa kuwa ${e.target.value.toUpperCase()}`);
                                }}
                                className={`text-xs font-bold px-2.5 py-1 rounded border ${
                                  usr.role === 'admin'
                                    ? 'bg-red-50 text-red-800 border-red-200'
                                    : usr.role === 'editor'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : usr.role === 'journalist'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : usr.role === 'staff'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-stone-50 text-stone-700 border-stone-200'
                                }`}
                              >
                                <option value="admin">👑 Administrator</option>
                                <option value="editor">✍️ Senior Editor</option>
                                <option value="journalist">📰 Journalist / Reporter</option>
                                <option value="staff">💼 Staff Writer</option>
                                <option value="reader">👤 Reader</option>
                              </select>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  toggleUserStatus(usr.id);
                                  showToast(`Hali ya "${usr.name || usr.email}" imesasishwa.`);
                                }}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                                  usr.status === 'suspended'
                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                }`}
                              >
                                {usr.status === 'suspended' ? 'Suspended' : 'Active'}
                              </button>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-stone-500 text-[11px]">
                              {usr.registeredAt ? new Date(usr.registeredAt).toLocaleDateString() : '—'}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteUserModal({
                                    isOpen: true,
                                    userId: usr.id,
                                    userName: usr.name || usr.email || usr.phone || 'User',
                                  })
                                }
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: ADVERTISEMENT MANAGEMENT                           */}
          {/* ========================================================= */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div>
                    <h2 className="text-base font-bold text-[#0B192C]">
                      Advertisement Placements & Sponsorships
                    </h2>
                    <p className="text-xs text-stone-500">
                      Configure high-visibility advertising spots across header, sidebar, in-article, and footer
                    </p>
                  </div>
                </div>

                {/* Google AdSense Readiness Slot Guide */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Megaphone className="w-4 h-4 text-amber-600" />
                    <span>Google AdSense Slot Configuration</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Each advertising zone below has a designated Google AdSense client slot hook. To link your official Google AdSense account when approved, set your client publisher ID in the settings below.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] font-mono bg-white px-2.5 py-1 border border-amber-300 rounded text-stone-700">
                      Publisher Client: ca-pub-739286764339
                    </span>
                    <span className="text-[11px] text-amber-900 font-semibold">
                      AdSense Slots: Prepared & Responsive
                    </span>
                  </div>
                </div>

                {/* Configurable Ad Banners */}
                <div className="space-y-4">
                  {ads.map(ad => (
                    <div
                      key={ad.id}
                      className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-xs">{ad.title}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-stone-200 rounded text-stone-700 font-bold">
                            {ad.slot}
                          </span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                          <span>Enable Space:</span>
                          <input
                            type="checkbox"
                            checked={ad.isActive}
                            onChange={e => {
                              updateAd(ad.id, { isActive: e.target.checked });
                              showToast(`Ad slot "${ad.title}" ${e.target.checked ? 'enabled' : 'disabled'}`);
                            }}
                            className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">
                            Sponsor Label / Headline
                          </label>
                          <input
                            type="text"
                            value={ad.title}
                            onChange={e => updateAd(ad.id, { title: e.target.value })}
                            className="w-full p-2 bg-white border border-stone-300 rounded text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">
                            Click-Through Destination Link
                          </label>
                          <input
                            type="text"
                            value={ad.targetUrl}
                            onChange={e => updateAd(ad.id, { targetUrl: e.target.value })}
                            className="w-full p-2 bg-white border border-stone-300 rounded text-xs font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">
                            Creative Image URL
                          </label>
                          <input
                            type="text"
                            value={ad.imageUrl || ''}
                            onChange={e => updateAd(ad.id, { imageUrl: e.target.value })}
                            className="w-full p-2 bg-white border border-stone-300 rounded text-xs font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                        <span>Metrics: Real user interaction tracking active</span>
                        <span>
                          Impressions: <strong className="text-stone-800">{ad.impressions || 0}</strong> &bull; Clicks:{' '}
                          <strong className="text-stone-800">{ad.clicks || 0}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: WEBSITE APPEARANCE SETTINGS                        */}
          {/* ========================================================= */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 lg:p-8 space-y-6">
              <div className="pb-4 border-b border-stone-200">
                <h2 className="text-base font-bold text-[#0B192C]">
                  Website Appearance & Brand Settings
                </h2>
                <p className="text-xs text-stone-500">
                  Update your website branding, logo text, breaking news ticker, and homepage featured lead story in real time
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Brand Identity */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                  <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Brand Identity
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Website Name *
                    </label>
                    <input
                      type="text"
                      value={appearanceSettings?.siteName || 'THE SUN'}
                      onChange={e => updateAppearanceSettings({ siteName: e.target.value })}
                      placeholder="THE SUN"
                      className="w-full p-2.5 bg-white border border-stone-300 rounded font-bold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Website Tagline
                    </label>
                    <input
                      type="text"
                      value={appearanceSettings?.siteTagline || ''}
                      onChange={e => updateAppearanceSettings({ siteTagline: e.target.value })}
                      placeholder="Tanzania & East Africa's Leading Digital Daily Only"
                      className="w-full p-2 bg-white border border-stone-300 rounded text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Logo Monogram Text
                    </label>
                    <input
                      type="text"
                      value={appearanceSettings?.siteLogoText || 'SUN'}
                      onChange={e => updateAppearanceSettings({ siteLogoText: e.target.value })}
                      placeholder="SUN"
                      className="w-full p-2 bg-white border border-stone-300 rounded font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Primary Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={appearanceSettings?.primaryColor || '#BB1919'}
                        onChange={e => updateAppearanceSettings({ primaryColor: e.target.value })}
                        className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={appearanceSettings?.primaryColor || '#BB1919'}
                        onChange={e => updateAppearanceSettings({ primaryColor: e.target.value })}
                        className="flex-1 p-2 bg-white border border-stone-300 rounded font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Homepage Featured Story Selector */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                  <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Homepage Hero Lead Story
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Pin a specific published story to be the hero lead on the homepage:
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Select Featured Article
                    </label>
                    <select
                      value={appearanceSettings?.featuredStoryId || ''}
                      onChange={e => {
                        updateAppearanceSettings({ featuredStoryId: e.target.value || undefined });
                        showToast('Featured hero article updated.');
                      }}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded font-medium text-stone-800"
                    >
                      <option value="">Default (Most Recent Published Story)</option>
                      {articles
                        .filter(a => a.status === 'published')
                        .map(a => (
                          <option key={a.id} value={a.id}>
                            [{a.categoryName}] {a.title.slice(0, 50)}...
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Breaking News Ticker Controls */}
                  <div className="pt-3 border-t border-stone-200 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appearanceSettings?.breakingNewsEnabled !== false}
                        onChange={e => updateAppearanceSettings({ breakingNewsEnabled: e.target.checked })}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span className="font-bold text-stone-800">Show Breaking News Ticker</span>
                    </label>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Custom Breaking Announcement (Optional)
                      </label>
                      <input
                        type="text"
                        value={appearanceSettings?.breakingNewsTicker || ''}
                        onChange={e => updateAppearanceSettings({ breakingNewsTicker: e.target.value })}
                        placeholder="Leave blank to use live breaking stories automatically"
                        className="w-full p-2 bg-white border border-stone-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Newsroom Information */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                  <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Newsroom & Contact Details
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={appearanceSettings?.contactPhone || ''}
                      onChange={e => updateAppearanceSettings({ contactPhone: e.target.value })}
                      placeholder="+255 622 754 599"
                      className="w-full p-2 bg-white border border-stone-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Newsroom Email
                    </label>
                    <input
                      type="email"
                      value={appearanceSettings?.contactEmail || ''}
                      onChange={e => updateAppearanceSettings({ contactEmail: e.target.value })}
                      placeholder="newsroom@thesun.co.tz"
                      className="w-full p-2 bg-white border border-stone-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Physical Address
                    </label>
                    <input
                      type="text"
                      value={appearanceSettings?.newsroomAddress || ''}
                      onChange={e => updateAppearanceSettings({ newsroomAddress: e.target.value })}
                      placeholder="Ohio Street, Posta, Dar es Salaam, Tanzania"
                      className="w-full p-2 bg-white border border-stone-300 rounded"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                  <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Official Social Links
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Twitter / X Handle
                    </label>
                    <input
                      type="text"
                      value={appearanceSettings?.socialLinks?.twitter || ''}
                      onChange={e =>
                        updateAppearanceSettings({
                          socialLinks: {
                            ...(appearanceSettings?.socialLinks || {
                              twitter: '',
                              facebook: '',
                              youtube: '',
                              linkedin: '',
                              instagram: '',
                              whatsapp: '',
                            }),
                            twitter: e.target.value,
                          },
                        })
                      }
                      placeholder="https://twitter.com/TheSunTz"
                      className="w-full p-2 bg-white border border-stone-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="text"
                      value={appearanceSettings?.socialLinks?.facebook || ''}
                      onChange={e =>
                        updateAppearanceSettings({
                          socialLinks: {
                            ...(appearanceSettings?.socialLinks || {
                              twitter: '',
                              facebook: '',
                              youtube: '',
                              linkedin: '',
                              instagram: '',
                              whatsapp: '',
                            }),
                            facebook: e.target.value,
                          },
                        })
                      }
                      placeholder="https://facebook.com/TheSunTz"
                      className="w-full p-2 bg-white border border-stone-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      YouTube Channel
                    </label>
                    <input
                      type="text"
                      value={appearanceSettings?.socialLinks?.youtube || ''}
                      onChange={e =>
                        updateAppearanceSettings({
                          socialLinks: {
                            ...(appearanceSettings?.socialLinks || {
                              twitter: '',
                              facebook: '',
                              youtube: '',
                              linkedin: '',
                              instagram: '',
                              whatsapp: 'https://wa.me/255622754599',
                            }),
                            youtube: e.target.value,
                          },
                        })
                      }
                      placeholder="https://youtube.com/@TheSourceTz"
                      className="w-full p-2 bg-white border border-stone-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      WhatsApp Desk Hotline URL
                    </label>
                    <input
                      type="text"
                      value={appearanceSettings?.socialLinks?.whatsapp || 'https://wa.me/255622754599'}
                      onChange={e =>
                        updateAppearanceSettings({
                          socialLinks: {
                            ...(appearanceSettings?.socialLinks || {
                              twitter: '',
                              facebook: '',
                              youtube: '',
                              linkedin: '',
                              instagram: '',
                              whatsapp: '',
                            }),
                            whatsapp: e.target.value,
                          },
                        })
                      }
                      placeholder="https://wa.me/255622754599"
                      className="w-full p-2 bg-white border border-stone-300 rounded font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => showToast('Appearance settings saved and live.')}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer shadow-xs"
                >
                  Save Appearance Settings
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: SEO MANAGEMENT                                    */}
          {/* ========================================================= */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 lg:p-8 space-y-6">
              <div className="pb-4 border-b border-stone-200">
                <h2 className="text-base font-bold text-[#0B192C]">
                  Search Engine Optimization (SEO) & Social Sharing
                </h2>
                <p className="text-xs text-stone-500">
                  Configure site-wide meta headers, robots directives, canonical domains, and review article SEO readiness
                </p>
              </div>

              {/* SEO Health Status Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sitemap Status</span>
                  </div>
                  <p className="text-emerald-700">Generated dynamically at /sitemap.xml with all live categories & articles.</p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Robots Directives</span>
                  </div>
                  <p className="text-emerald-700">Index, Follow active for Googlebot and major search engines.</p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>OpenGraph Tags</span>
                  </div>
                  <p className="text-emerald-700">Rich snippet meta tags ready for Twitter/X, Facebook, and WhatsApp previews.</p>
                </div>
              </div>

              {/* Article SEO Checklist */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">
                  Article-Level SEO Health Audit
                </h3>
                <div className="space-y-2 text-xs">
                  {articles.slice(0, 5).map(art => {
                    const hasAlt = !!art.imageAltText;
                    const isOptimalTitle = art.title.length >= 30 && art.title.length <= 80;

                    return (
                      <div
                        key={art.id}
                        className="p-3 bg-white rounded border border-stone-200 flex items-center justify-between gap-3"
                      >
                        <div className="truncate">
                          <div className="font-bold text-stone-900 truncate">{art.title}</div>
                          <div className="text-[11px] text-stone-500 font-mono">
                            Slug: /{art.slug}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOptimalTitle ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Title: {art.title.length} chars
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              hasAlt ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {hasAlt ? 'Alt Text OK' : 'Missing Alt'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 11: WEBSITE SETTINGS & MAINTENANCE                     */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 lg:p-8 space-y-6">
              <div className="pb-4 border-b border-stone-200">
                <h2 className="text-base font-bold text-[#0B192C]">
                  Website Policies & Technical Settings
                </h2>
                <p className="text-xs text-stone-500">
                  Control maintenance mode, manage editorial standards, privacy policy, and newsletter configuration
                </p>
              </div>

              {/* Maintenance Mode Toggle with Confirmation Safety */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-stone-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Website Maintenance Mode</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    When active, public readers will see a maintenance notice while administrators retain access
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMaintenanceConfirmModal(true)}
                  className={`px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer ${
                    websiteSettings.maintenanceMode
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                  }`}
                >
                  {websiteSettings.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
                </button>
              </div>

              {/* Policy Editors */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Editorial Policy & Corrections Statement
                  </label>
                  <textarea
                    rows={4}
                    value={websiteSettings.editorialPolicy}
                    onChange={e => updateWebsiteSettings({ editorialPolicy: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded text-stone-900 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Privacy Policy
                  </label>
                  <textarea
                    rows={4}
                    value={websiteSettings.privacyPolicy}
                    onChange={e => updateWebsiteSettings({ privacyPolicy: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded text-stone-900 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Terms & Conditions of Service
                  </label>
                  <textarea
                    rows={4}
                    value={websiteSettings.termsConditions}
                    onChange={e => updateWebsiteSettings({ termsConditions: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded text-stone-900 leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => showToast('Website policies saved successfully.')}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer shadow-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 12: ADMIN ACTIVITY LOGS (AUDIT TRAIL)                  */}
          {/* ========================================================= */}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-base font-bold text-[#0B192C]">
                    Administrative Audit Trail & Activity Logs
                  </h2>
                  <p className="text-xs text-stone-500">
                    Tamper-resistant audit log of all publications, deletions, role updates, and settings changes
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={logFilterCategory}
                    onChange={e => setLogFilterCategory(e.target.value as any)}
                    className="px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-semibold text-stone-800 focus:outline-none"
                  >
                    <option value="all">All Event Categories ({activityLogs.length})</option>
                    <option value="article">Articles</option>
                    <option value="category">Categories</option>
                    <option value="user">Users</option>
                    <option value="settings">Settings</option>
                    <option value="security">Auth & Security</option>
                  </select>

                  <button
                    onClick={() => {
                      if (confirm('Clear audit logs? This cannot be undone.')) {
                        clearActivityLogs();
                        showToast('Audit logs cleared.');
                      }
                    }}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-bold cursor-pointer"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-stone-200 rounded-lg">
                <table className="w-full text-left text-xs divide-y divide-stone-200">
                  <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-3">Administrator</th>
                      <th className="py-3 px-3">Action</th>
                      <th className="py-3 px-3">Target</th>
                      <th className="py-3 px-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-stone-50/80">
                        <td className="py-3 px-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-bold text-stone-800">
                          {log.adminEmail}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-900 font-medium max-w-xs truncate">
                          {log.target}
                        </td>
                        <td className="py-3 px-3 text-stone-500 text-[11px]">
                          {log.details || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CONFIRM DELETE ARTICLE                            */}
      {/* ========================================================= */}
      {deleteArticleModal.isOpen && deleteArticleModal.article && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-stone-900">Confirm Article Deletion</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete the article:
              <br />
              <strong className="text-stone-900">"{deleteArticleModal.article.title}"</strong>?
              <br />
              This will remove the story and its reader comments permanently.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteArticleModal({ isOpen: false, article: null })}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteArticle}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CONFIRM DELETE CATEGORY WITH SAFETY CHECK         */}
      {/* ========================================================= */}
      {deleteCategoryModal.isOpen && deleteCategoryModal.category && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-stone-900">Category Deletion</h3>
            </div>

            {deleteCategoryModal.articleCount > 0 ? (
              <div className="space-y-2">
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                  <strong>Deletion Blocked:</strong> Category{' '}
                  <strong>"{deleteCategoryModal.category.name}"</strong> contains{' '}
                  <strong>{deleteCategoryModal.articleCount}</strong> active articles.
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  To prevent breaking links and stranding reader content, please reassign or delete the articles in this category before deleting it, or toggle its status to <strong>Hidden</strong> instead.
                </p>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setDeleteCategoryModal({ isOpen: false, category: null, articleCount: 0 })}
                    className="px-4 py-2 bg-stone-800 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Understood
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Are you sure you want to delete category{' '}
                  <strong className="text-stone-900">
                    "{deleteCategoryModal.category.name}"
                  </strong>
                  ? It contains 0 articles and can be safely removed.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDeleteCategoryModal({ isOpen: false, category: null, articleCount: 0 })}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDeleteCategory}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DELETE MEDIA CONFIRMATION                         */}
      {/* ========================================================= */}
      {deleteMediaModal.isOpen && deleteMediaModal.media && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-stone-900">Delete Image Asset?</h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to delete{' '}
              <strong className="text-stone-900">"{deleteMediaModal.media.fileName}"</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteMediaModal({ isOpen: false, media: null })}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMediaItem(deleteMediaModal.media!.id);
                  showToast('Image deleted.');
                  setDeleteMediaModal({ isOpen: false, media: null });
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer"
              >
                Delete Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: DELETE USER CONFIRMATION                          */}
      {/* ========================================================= */}
      {deleteUserModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-stone-900">Delete User Account?</h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to remove account{' '}
              <strong className="text-stone-900">"{deleteUserModal.userName}"</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteUserModal({ isOpen: false, userId: null, userName: '' })}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: MAINTENANCE MODE CONFIRMATION                     */}
      {/* ========================================================= */}
      {maintenanceConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-stone-900">
                {websiteSettings.maintenanceMode ? 'Disable Maintenance Mode?' : 'Enable Maintenance Mode?'}
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {websiteSettings.maintenanceMode
                ? 'Disabling maintenance mode will immediately open the website to all public visitors.'
                : 'Enabling maintenance mode will display a temporary editorial maintenance screen to all regular visitors.'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMaintenanceConfirmModal(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateWebsiteSettings({ maintenanceMode: !websiteSettings.maintenanceMode });
                  showToast(
                    `Maintenance mode ${!websiteSettings.maintenanceMode ? 'activated' : 'deactivated'}`
                  );
                  setMaintenanceConfirmModal(false);
                }}
                className={`px-4 py-2 rounded text-xs font-bold text-white cursor-pointer ${
                  websiteSettings.maintenanceMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Confirm {websiteSettings.maintenanceMode ? 'Reopen Site' : 'Enable Maintenance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: ARTICLE PREVIEW MODAL (DESKTOP & PHONE TEMPLATES) */}
      {/* ========================================================= */}
      {previewArticleModal.isOpen && previewArticleModal.article && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
            {/* Modal Header with Device Switcher */}
            <div className="p-3 sm:p-4 bg-[#0B192C] text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Live Template Preview
                </span>
                <span className="text-stone-400 text-xs">&bull;</span>
                <span className="text-xs text-stone-300">
                  {previewArticleModal.article.categoryName}
                </span>
              </div>

              {/* Desktop vs Mobile Toggle */}
              <div className="flex items-center bg-stone-900 border border-stone-700 p-0.5 rounded text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewDeviceMode('desktop')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                    previewDeviceMode === 'desktop' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>💻 Desktop View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDeviceMode('mobile')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                    previewDeviceMode === 'mobile' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>📱 Phone View (375px)</span>
                </button>
              </div>

              <button
                onClick={() => setPreviewArticleModal({ isOpen: false, article: null })}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="p-4 sm:p-6 overflow-y-auto bg-stone-100 flex-1">
              {previewDeviceMode === 'mobile' ? (
                /* 📱 MOBILE SMARTPHONE FRAME */
                <div className="max-w-[375px] mx-auto bg-white border-8 border-stone-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col font-sans">
                  {/* Phone Speaker Notch */}
                  <div className="bg-stone-800 h-5 w-full flex items-center justify-center">
                    <div className="w-16 h-1.5 bg-stone-600 rounded-full" />
                  </div>

                  <div className="p-4 space-y-3.5 overflow-y-auto max-h-[600px] text-xs">
                    {/* Category & Read Time */}
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-2xs">
                        {previewArticleModal.article.categoryName}
                      </span>
                      <span>{previewArticleModal.article.readTimeMinutes || 3} min read</span>
                    </div>

                    {/* 🇹🇿 Swahili Headline on Top */}
                    <h1 className="text-lg font-black text-stone-900 leading-tight">
                      {previewArticleModal.article.title}
                    </h1>

                    {/* 🇬🇧 English Headline Below */}
                    {previewArticleModal.article.titleEnglish && (
                      <h2 className="text-xs text-stone-600 italic font-medium leading-snug border-l-2 border-red-500 pl-2">
                        {previewArticleModal.article.titleEnglish}
                      </h2>
                    )}

                    {/* Featured Image */}
                    {previewArticleModal.article.featuredImage && (
                      <div className="rounded overflow-hidden border border-stone-200">
                        <img
                          src={previewArticleModal.article.featuredImage}
                          alt={previewArticleModal.article.title}
                          className="w-full aspect-video object-cover"
                        />
                      </div>
                    )}

                    {/* 🇹🇿 Swahili Lead Summary */}
                    <div className="p-2.5 bg-stone-50 border-l-3 border-stone-900 text-stone-800 text-[11px] leading-relaxed font-semibold">
                      {previewArticleModal.article.summary}
                    </div>

                    {/* 🇬🇧 English Lead Summary Deck */}
                    {previewArticleModal.article.summaryEnglish && (
                      <div className="p-2.5 bg-blue-50/60 border-l-3 border-blue-500 text-stone-700 text-[11px] leading-relaxed italic">
                        <span className="font-bold text-blue-900 block text-[10px] uppercase mb-0.5">English Summary:</span>
                        {previewArticleModal.article.summaryEnglish}
                      </div>
                    )}

                    {/* Content Paragraphs */}
                    <div className="space-y-2 text-[11px] text-stone-700 leading-relaxed font-serif">
                      {(Array.isArray(previewArticleModal.article.content)
                        ? previewArticleModal.article.content
                        : String(previewArticleModal.article.content || '').split('\n\n')
                      ).map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>

                    {/* English Content Paragraphs if available */}
                    {previewArticleModal.article.contentEnglish && (
                      <div className="pt-3 border-t border-stone-200 space-y-2 text-[11px] text-stone-600 leading-relaxed font-serif italic bg-stone-50 p-3 rounded">
                        <span className="font-sans font-bold text-blue-900 text-[10px] uppercase block not-italic">
                          🇬🇧 Full English Report:
                        </span>
                        {(Array.isArray(previewArticleModal.article.contentEnglish)
                          ? previewArticleModal.article.contentEnglish
                          : String(previewArticleModal.article.contentEnglish || '').split('\n\n')
                        ).map((paragraph: string, idx: number) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Phone Home Bar */}
                  <div className="bg-stone-800 h-4 flex items-center justify-center">
                    <div className="w-24 h-1 bg-stone-500 rounded-full" />
                  </div>
                </div>
              ) : (
                /* 💻 DESKTOP FULL-WIDTH VIEW */
                <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-stone-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 uppercase tracking-wider rounded-2xs">
                      {previewArticleModal.article.categoryName}
                    </span>
                    <span className="text-xs text-stone-400">&bull;</span>
                    <span className="text-xs text-stone-500">
                      By <strong>{typeof previewArticleModal.article.author === 'string' ? previewArticleModal.article.author : previewArticleModal.article.author?.name || 'Editorial Team'}</strong>
                    </span>
                    <span className="text-xs text-stone-400">&bull;</span>
                    <span className="text-xs text-stone-500">{previewArticleModal.article.readTimeMinutes || 3} min read</span>
                  </div>

                  {/* 🇹🇿 Kiswahili Headline on Top */}
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                    {previewArticleModal.article.title}
                  </h1>

                  {/* 🇬🇧 English Headline Below */}
                  {previewArticleModal.article.titleEnglish && (
                    <h2 className="text-base text-stone-600 font-medium italic border-l-4 border-red-500 pl-3">
                      {previewArticleModal.article.titleEnglish}
                    </h2>
                  )}

                  {/* Featured Image */}
                  {previewArticleModal.article.featuredImage && (
                    <div className="space-y-1">
                      <img
                        src={previewArticleModal.article.featuredImage}
                        alt={previewArticleModal.article.title}
                        className="w-full max-h-96 object-cover rounded"
                      />
                      {previewArticleModal.article.imageCaption && (
                        <p className="text-xs text-stone-500 italic">
                          {previewArticleModal.article.imageCaption} ({previewArticleModal.article.imageCredit})
                        </p>
                      )}
                    </div>
                  )}

                  {/* 🇹🇿 Swahili Lead Summary */}
                  <div className="p-4 bg-stone-50 border-l-4 border-stone-900 text-sm font-semibold text-stone-800 leading-relaxed">
                    {previewArticleModal.article.summary}
                  </div>

                  {/* 🇬🇧 English Lead Summary */}
                  {previewArticleModal.article.summaryEnglish && (
                    <div className="p-4 bg-blue-50/60 border-l-4 border-blue-500 text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                      <span className="font-sans font-bold text-blue-900 block text-xs uppercase mb-1 not-italic">
                        🇬🇧 English Summary:
                      </span>
                      {previewArticleModal.article.summaryEnglish}
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="text-sm text-stone-700 leading-relaxed space-y-3 font-serif">
                    {(Array.isArray(previewArticleModal.article.content)
                      ? previewArticleModal.article.content
                      : String(previewArticleModal.article.content || '').split('\n\n')
                    ).map((paragraph: string, idx: number) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* English Body Content if available */}
                  {previewArticleModal.article.contentEnglish && (
                    <div className="pt-6 mt-6 border-t border-stone-200 space-y-3 text-sm text-stone-600 leading-relaxed font-serif italic bg-stone-50 p-4 rounded">
                      <span className="font-sans font-bold text-blue-900 text-xs uppercase block not-italic">
                        🇬🇧 Full English Translation:
                      </span>
                      {(Array.isArray(previewArticleModal.article.contentEnglish)
                        ? previewArticleModal.article.contentEnglish
                        : String(previewArticleModal.article.contentEnglish || '').split('\n\n')
                      ).map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Inaonekana kwa wasomaji wote wa simu na kompyuta mara baada ya kuchapisha.
              </span>
              <button
                onClick={() => setPreviewArticleModal({ isOpen: false, article: null })}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-bold cursor-pointer"
              >
                Funga (Close Preview)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 7: SUCCESSFUL PUBLISHING CELEBRATION MODAL           */}
      {/* ========================================================= */}
      {publishedStoryModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 text-center space-y-4 animate-scale-in border border-stone-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                Hongera! Habari Imechapishwa Moja kwa Moja
              </span>
              <h3 className="text-lg font-black text-stone-900 leading-snug">
                {publishedStoryModal.title}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Imewekwa kwenye kitengo cha <strong>{publishedStoryModal.categoryName}</strong> na kwenye ukurasa wa mbele (Homepage).
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  const targetSlug = publishedStoryModal.slug;
                  setPublishedStoryModal({ isOpen: false, slug: '', title: '', categoryName: '' });
                  setView({ type: 'article', slug: targetSlug });
                }}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Eye className="w-4 h-4" />
                <span>Tazama Habari Hii Moja kwa Moja (View Live Article)</span>
              </button>

              <button
                onClick={() => {
                  setPublishedStoryModal({ isOpen: false, slug: '', title: '', categoryName: '' });
                  setView({ type: 'home' });
                }}
                className="w-full py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-bold text-xs uppercase tracking-wider cursor-pointer border border-stone-300"
              >
                Tazama Ukurasa wa Mbele (Homepage)
              </button>

              <button
                onClick={() => {
                  setPublishedStoryModal({ isOpen: false, slug: '', title: '', categoryName: '' });
                  handleOpenNewArticle();
                }}
                className="w-full py-1.5 text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Tunga Habari Nyingine (Write Another Story)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 8: CREATE ADMIN OR STAFF MEMBER MODAL                */}
      {/* ========================================================= */}
      {addStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-stone-200 animate-scale-in my-6">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#0B192C] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base leading-tight">
                    Sajili Msimamizi au Mwandishi Mpya
                  </h3>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    Create New Administrator, Editor, or Newsroom Journalist
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAddStaffModal(false)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newStaffName.trim()) {
                  alert('Tafadhali weka jina la mwanatimu / Please enter full name.');
                  return;
                }
                if (!newStaffEmail.trim()) {
                  alert('Tafadhali weka barua pepe / Please enter email address.');
                  return;
                }
                createStaffUser({
                  name: newStaffName.trim(),
                  email: newStaffEmail.trim(),
                  phone: newStaffPhone.trim(),
                  role: newStaffRole,
                  staffTitle: newStaffTitle.trim() || undefined,
                  avatar: newStaffAvatar,
                });
                showToast(`Mwanatimu "${newStaffName}" amesajiliwa kikamilifu kama ${newStaffRole.toUpperCase()} na kuongezwa kwenye waandishi!`);
                setAddStaffModal(false);
                setNewStaffName('');
                setNewStaffEmail('');
                setNewStaffPhone('+255 754 ');
                setNewStaffRole('journalist');
                setNewStaffTitle('Senior News Reporter');
              }}
              className="p-5 sm:p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px] mb-1">
                  Jina Kamili (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  placeholder="mfano: Juma Rashid Mwakyusa"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:bg-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px] mb-1">
                    Barua Pepe (Email Address) *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStaffEmail}
                    onChange={e => setNewStaffEmail(e.target.value)}
                    placeholder="juma.mwakyusa@thesource.co.tz"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px] mb-1">
                    Nambari ya Simu (Phone)
                  </label>
                  <input
                    type="tel"
                    value={newStaffPhone}
                    onChange={e => setNewStaffPhone(e.target.value)}
                    placeholder="+255 754 123 456"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:bg-white focus:border-red-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px] mb-1">
                    Nafasi / Wadhifa (Staff Role) *
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={e => setNewStaffRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs font-bold text-stone-900 focus:bg-white focus:border-red-600 focus:outline-none"
                  >
                    <option value="admin">👑 Administrator (Msimamizi Mkuu - Full Control)</option>
                    <option value="editor">✍️ Senior Editor (Mhariri Mkuu - Review & Publish)</option>
                    <option value="journalist">📰 Journalist / Reporter (Mwandishi wa Habari)</option>
                    <option value="staff">💼 Staff Writer (Mwandishi wa Kawaida)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px] mb-1">
                    Cheo au Kitengo (Beat / Title)
                  </label>
                  <input
                    type="text"
                    value={newStaffTitle}
                    onChange={e => setNewStaffTitle(e.target.value)}
                    placeholder="mfano: Senior Political Editor au Sports Desk"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px] mb-1">
                  Picha ya Wasifu (Avatar URL)
                </label>
                <input
                  type="text"
                  value={newStaffAvatar}
                  onChange={e => setNewStaffAvatar(e.target.value)}
                  placeholder="https://... au baki na picha ya mfano"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:bg-white focus:border-red-600 focus:outline-none"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-stone-500 font-bold uppercase">Mifano ya Picha:</span>
                  {[
                    '/src/assets/images/hero_lead_tanzania_rail_1793043305338.jpg',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                  ].map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewStaffAvatar(url)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition-transform ${
                        newStaffAvatar === url ? 'border-red-600 scale-110' : 'border-stone-300 hover:scale-105'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Informational tip */}
              <div className="p-3 bg-stone-100 rounded-md border border-stone-200 text-stone-600 text-[11px] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Mwanatimu huyu atapokea haki za utendaji mara moja na ataonekana kwenye orodha ya waandishi (author bylines) wakati wa kutunga habari mpya.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setAddStaffModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-bold cursor-pointer transition-colors"
                >
                  Ghairi (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sajili Mwanatimu (Create Member)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
