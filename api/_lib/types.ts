/** Slim types for serverless wire handlers (keeps the Vercel bundle self-contained). */

export interface Author {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio?: string;
  location?: string;
  joinedYear?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  accentColor?: string;
  isActive?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  titleEnglish?: string;
  subtitle: string;
  subtitleEnglish?: string;
  summary: string;
  summaryEnglish?: string;
  content: string[];
  contentEnglish?: string[];
  categoryId: string;
  categoryName: string;
  featuredImage: string;
  imageCaption: string;
  imageCredit: string;
  imageAltText?: string;
  author: Author;
  publishedAt: string;
  readTimeMinutes: number;
  viewsCount: number;
  isBreaking: boolean;
  isFeaturedHero: boolean;
  isTrending: boolean;
  isEditorsPick: boolean;
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
  reactions: {
    insightful: number;
    inspiring: number;
    surprised: number;
    concerned: number;
  };
  comments: [];
  commentsEnabled?: boolean;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoCanonicalUrl?: string;
  seoSocialImage?: string;
  sourceUrl?: string;
  isWireStory?: boolean;
}
