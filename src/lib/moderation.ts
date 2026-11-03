import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { isAdminEmail } from './auth';

const DOC = 'moderation';

export async function fetchHiddenArticleIds(): Promise<string[]> {
  if (!db || !isFirebaseConfigured) return [];
  try {
    const snap = await getDoc(doc(db, 'settings', DOC));
    if (!snap.exists()) return [];
    const ids = snap.data()?.hiddenArticleIds;
    return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [];
  } catch (error) {
    console.warn('[moderation] Failed to load hidden articles', error);
    return [];
  }
}

export async function saveHiddenArticleIds(ids: string[]): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const user = auth?.currentUser;
  if (!user || !isAdminEmail(user.email)) {
    throw new Error('Sign in as admin to change article visibility for all visitors.');
  }
  await setDoc(
    doc(db, 'settings', DOC),
    { hiddenArticleIds: ids, updatedAt: new Date().toISOString() },
    { merge: true }
  );
}
