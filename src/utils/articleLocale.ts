import type { Article } from '../types';
import type { SiteLanguage } from './locale';

export interface LocalizedArticleCopy {
  title: string;
  subtitle: string;
  summary: string;
  content: string[];
  keyTakeaways?: string[];
  /** True when English translation fields are shown instead of original Kiswahili */
  isTranslation: boolean;
  hasTranslation: boolean;
}

function hasDistinctEnglish(article: Article): boolean {
  const en = article.titleEnglish?.trim();
  if (!en) return false;
  return en.toLowerCase() !== article.title.trim().toLowerCase() || Boolean(article.contentEnglish?.length);
}

/**
 * CMS posts: Kiswahili is the original; English fields are the translation.
 * Wire posts: usually English-only — both languages fall back to the same copy.
 */
export function localizeArticle(article: Article, language: SiteLanguage): LocalizedArticleCopy {
  const hasTranslation = hasDistinctEnglish(article);

  if (language === 'en' && hasTranslation) {
    return {
      title: article.titleEnglish!.trim(),
      subtitle: (article.subtitleEnglish || article.subtitle || '').trim(),
      summary: (article.summaryEnglish || article.summary || '').trim(),
      content:
        article.contentEnglish && article.contentEnglish.length > 0
          ? article.contentEnglish
          : article.content,
      keyTakeaways: article.keyTakeawaysEnglish?.length
        ? article.keyTakeawaysEnglish
        : article.keyTakeaways,
      isTranslation: true,
      hasTranslation,
    };
  }

  return {
    title: article.title,
    subtitle: article.subtitle,
    summary: article.summary,
    content: article.content,
    keyTakeaways: article.keyTakeaways,
    isTranslation: false,
    hasTranslation,
  };
}
