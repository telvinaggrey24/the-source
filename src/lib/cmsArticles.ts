import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  type DocumentData,
} from 'firebase/firestore';
import type { Article } from '../types';
import { db, isFirebaseConfigured } from './firebase';

const COLLECTION = 'articles';

/** Firestore rejects `undefined` field values. */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => stripUndefined(item)) as T;
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      out[key] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

export function isCmsArticle(article: Article | null | undefined): boolean {
  return Boolean(article && !article.isWireStory);
}

export async function fetchCmsArticles(): Promise<Article[]> {
  if (!db || !isFirebaseConfigured) return [];
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const items: Article[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data() as DocumentData;
      if (!data || data.isWireStory) return;
      items.push({
        ...(data as Article),
        id: docSnap.id,
        isWireStory: false,
      });
    });
    return items;
  } catch (error) {
    console.warn('[cms] Failed to load articles from Firestore', error);
    return [];
  }
}

export async function upsertCmsArticle(article: Article): Promise<void> {
  if (!db || !isFirebaseConfigured || !isCmsArticle(article)) return;
  const payload = stripUndefined({
    ...article,
    id: article.id,
    isWireStory: false,
  });
  await setDoc(doc(db, COLLECTION, article.id), payload, { merge: true });
}

export async function deleteCmsArticle(id: string): Promise<void> {
  if (!db || !isFirebaseConfigured || !id) return;
  await deleteDoc(doc(db, COLLECTION, id));
}

export function mergeCmsArticles(local: Article[], remote: Article[]): Article[] {
  const map = new Map<string, Article>();
  for (const a of local) {
    if (isCmsArticle(a)) map.set(a.id, a);
  }
  for (const a of remote) {
    if (!isCmsArticle(a)) continue;
    const existing = map.get(a.id);
    if (!existing) {
      map.set(a.id, a);
      continue;
    }
    const localTs = new Date(existing.updatedAt || existing.publishedAt || 0).getTime();
    const remoteTs = new Date(a.updatedAt || a.publishedAt || 0).getTime();
    map.set(a.id, remoteTs >= localTs ? a : existing);
  }
  return Array.from(map.values());
}

/** Push browser-only CMS posts to Firestore so other visitors can see them. */
export async function migrateLocalCmsToFirestore(articles: Article[]): Promise<number> {
  if (!db || !isFirebaseConfigured) return 0;
  const cms = articles.filter(isCmsArticle);
  if (cms.length === 0) return 0;
  let saved = 0;
  for (const article of cms) {
    try {
      await upsertCmsArticle(article);
      saved += 1;
    } catch (error) {
      console.warn('[cms] Failed to sync article', article.id, error);
    }
  }
  return saved;
}
