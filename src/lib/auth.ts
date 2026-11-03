import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/** Sole CMS owner — only this Google account may enter admin. */
export const SOLE_ADMIN_EMAIL = 'telvinaggrey24@gmail.com';

export function getAdminAllowlist(): string[] {
  // Hard lock: only the owner Google account may enter CMS — ignore extra env entries
  void import.meta.env.VITE_ADMIN_EMAILS;
  return [SOLE_ADMIN_EMAIL];
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminAllowlist().includes(email.trim().toLowerCase());
}

export async function signInWithGoogle(): Promise<User> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error('Firebase Auth is not configured.');
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFirebase(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function firebaseUserToProfile(
  user: User,
  role: 'admin' | 'reader' = 'reader'
) {
  return {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'Reader',
    email: user.email || undefined,
    avatar: user.photoURL || undefined,
    role,
    status: 'active' as const,
    isSubscriber: false,
    isDonor: false,
    registeredAt: user.metadata.creationTime || new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
}
