import { doc, getDoc, setDoc } from 'firebase/firestore';
import type {
  AdBanner,
  Author,
  Category,
  WebsiteAppearanceSettings,
  WebsiteSettings,
} from '../types';
import { auth, db, isFirebaseConfigured } from './firebase';
import { isAdminEmail } from './auth';

export interface PublicSiteConfig {
  categories: Category[];
  appearance: WebsiteAppearanceSettings;
  website: WebsiteSettings;
  ads?: AdBanner[];
  authors?: Author[];
  updatedAt?: string;
}

function assertCanWriteSite(): void {
  if (!db || !isFirebaseConfigured) {
    throw new Error('Firebase is not configured on this site build.');
  }
  const user = auth?.currentUser;
  if (!user || !isAdminEmail(user.email)) {
    throw new Error('Sign in as admin to save site settings for every visitor.');
  }
}

export async function fetchSiteConfig(): Promise<PublicSiteConfig | null> {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const snap = await getDoc(doc(db, 'settings', 'public'));
    if (!snap.exists()) return null;
    const data = snap.data() as Partial<PublicSiteConfig>;
    if (!Array.isArray(data.categories) || !data.appearance || !data.website) return null;
    return {
      categories: data.categories,
      appearance: data.appearance,
      website: data.website,
      ads: Array.isArray(data.ads) ? data.ads : undefined,
      authors: Array.isArray(data.authors) ? data.authors : undefined,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.warn('[siteConfig] Failed to load public settings', error);
    return null;
  }
}

export async function saveSiteConfig(
  config: Omit<PublicSiteConfig, 'updatedAt'>
): Promise<void> {
  assertCanWriteSite();
  await setDoc(
    doc(db!, 'settings', 'public'),
    {
      categories: config.categories,
      appearance: config.appearance,
      website: config.website,
      ads: config.ads || [],
      authors: config.authors || [],
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
