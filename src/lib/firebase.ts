import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // Images use Cloudinary — Firebase Storage bucket unused
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([key, value]) => key !== 'measurementId' && !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missing.length === 0;

if (!isFirebaseConfigured) {
  console.warn(
    `[firebase] Missing env: ${missing.join(', ')}. Admin Auth / Firestore CMS disabled until configured.`
  );
}

export const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!app) return Promise.resolve(null);
  analyticsPromise ??= isSupported()
    .then(supported => (supported ? getAnalytics(app) : null))
    .catch(() => null);
  return analyticsPromise;
}
