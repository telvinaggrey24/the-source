import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { isFirebaseConfigured } from '../../lib/firebase';
import { X, Shield, LogOut } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    loginWithGoogle,
    logoutUser,
    language,
  } = useNews();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogle = async () => {
    setError('');
    setBusy(true);
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/55">
      <div className="w-full max-w-md bg-white shadow-2xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-[#121212] text-white">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#BB1919]" />
            <h2 className="font-bbc-headline text-sm font-bold uppercase tracking-wide">
              {language === 'sw' ? 'Ingia' : 'Sign in'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="text-stone-300 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {currentUser ? (
            <>
              <p className="text-sm text-stone-700">
                {language === 'sw' ? 'Umeingia kama' : 'Signed in as'}{' '}
                <strong>{currentUser.name}</strong>
                {currentUser.email ? ` (${currentUser.email})` : ''}
              </p>
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-2.5 px-4 border border-stone-300 text-stone-800 text-sm font-bold flex items-center justify-center gap-2 hover:bg-stone-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {language === 'sw' ? 'Toka' : 'Sign out'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-stone-600">
                {language === 'sw'
                  ? 'Tumia akaunti yako ya Google tu. Hakuna nenosiri la barua pepe.'
                  : 'Use your Google account only. Email and password sign-in is disabled.'}
              </p>

              {!isFirebaseConfigured && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 p-3">
                  Firebase Auth is not configured in this environment.
                </p>
              )}

              {error && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>
              )}

              <button
                type="button"
                disabled={busy || !isFirebaseConfigured}
                onClick={() => void handleGoogle()}
                className="w-full py-3 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-900 text-sm font-bold flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
                  />
                  <path
                    fill="#34A853"
                    d="M6.6 14.3l-.9.7-2.5 1.9C4.9 19.5 8.2 21.6 12 21.6c2.4 0 4.4-.8 5.9-2.1l-3.1-2.4c-.8.6-1.9.9-2.8.9-2.2 0-4-1.5-4.7-3.5z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M3.2 7.1C2.4 8.7 2 10.3 2 12s.4 3.3 1.2 4.9l3.4-2.6C6.2 13.5 6 12.8 6 12s.2-1.5.5-2.2L3.2 7.1z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 5.4c1.3 0 2.5.5 3.4 1.3l2.6-2.6C16.4 2.5 14.4 1.6 12 1.6 8.2 1.6 4.9 3.7 3.2 7.1l3.3 2.6C7.9 6.9 9.8 5.4 12 5.4z"
                  />
                </svg>
                {busy
                  ? language === 'sw'
                    ? 'Inaendelea…'
                    : 'Signing in…'
                  : language === 'sw'
                    ? 'Endelea na Google'
                    : 'Continue with Google'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
