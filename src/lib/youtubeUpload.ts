import { GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { isAdminEmail } from './auth';

const UPLOAD_SCOPE = 'https://www.googleapis.com/auth/youtube.upload';
const MAX_BYTES = 2 * 1024 * 1024 * 1024;

export type YouTubePrivacy = 'public' | 'unlisted' | 'private';

let cachedToken: { value: string; expiresAt: number } | null = null;

export function hasYouTubeAccess(): boolean {
  return Boolean(cachedToken && cachedToken.expiresAt > Date.now());
}

/**
 * Must be called from a tap (popup). Re-authenticates the signed-in admin with the
 * YouTube upload permission without changing who is signed in.
 */
export async function connectYouTube(): Promise<void> {
  const user = auth?.currentUser;
  if (!auth || !user) {
    throw new Error('Sign in with Google as the site admin first.');
  }
  if (!isAdminEmail(user.email)) {
    throw new Error('Only the site admin can upload to YouTube.');
  }

  const provider = new GoogleAuthProvider();
  provider.addScope(UPLOAD_SCOPE);
  provider.setCustomParameters({ login_hint: user.email || '', prompt: 'consent' });

  const result = await reauthenticateWithPopup(user, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential?.accessToken) {
    throw new Error('Google did not give YouTube upload access. Allow the YouTube permission and try again.');
  }
  cachedToken = { value: credential.accessToken, expiresAt: Date.now() + 50 * 60 * 1000 };
}

function explainYouTubeError(status: number, body: string): string {
  let reason = '';
  let message = '';
  try {
    const parsed = JSON.parse(body) as {
      error?: { message?: string; errors?: Array<{ reason?: string }> };
    };
    message = parsed.error?.message || '';
    reason = parsed.error?.errors?.[0]?.reason || '';
  } catch {
    // not JSON
  }

  if (status === 401) {
    cachedToken = null;
    return 'YouTube access expired. Tap “Unganisha YouTube” again.';
  }
  if (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded') {
    return 'YouTube daily upload limit reached for this site. Try again tomorrow or upload to Cloudinary.';
  }
  if (reason === 'accessNotConfigured' || /has not been used|is disabled/i.test(message)) {
    return 'YouTube Data API v3 is not enabled for this Google project (the-source-41c0d). Enable it in Google Cloud Console, then try again.';
  }
  if (reason === 'youtubeSignupRequired' || /youtube.*(channel|signup)/i.test(message)) {
    return 'This Google account has no YouTube channel yet. Create one at youtube.com, then try again.';
  }
  if (reason === 'uploadLimitExceeded') {
    return 'This YouTube channel hit its upload limit. Try again later.';
  }
  if (reason === 'forbidden' || status === 403) {
    return message || 'YouTube refused the upload. Check the permission you granted and try again.';
  }
  return message || `YouTube upload failed (${status}).`;
}

export interface YouTubeUploadOptions {
  title: string;
  description?: string;
  privacy?: YouTubePrivacy;
  onProgress?: (percent: number) => void;
}

export interface YouTubeUploadResult {
  id: string;
  url: string;
  privacy: YouTubePrivacy;
}

export async function uploadVideoToYouTube(
  file: File,
  options: YouTubeUploadOptions
): Promise<YouTubeUploadResult> {
  if (!hasYouTubeAccess() || !cachedToken) {
    throw new Error('Tap “Unganisha YouTube” first.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Video must be 2GB or smaller.');
  }
  const token = cachedToken.value;
  const contentType = file.type || 'video/*';
  const privacy = options.privacy || 'public';

  const metadata = {
    snippet: {
      title: (options.title || file.name.replace(/\.[^.]+$/, '') || 'The Source').slice(0, 100),
      description: (options.description || '').slice(0, 4900),
      categoryId: '25',
    },
    status: {
      privacyStatus: privacy,
      embeddable: true,
      selfDeclaredMadeForKids: false,
    },
  };

  const start = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': String(file.size),
        'X-Upload-Content-Type': contentType,
      },
      body: JSON.stringify(metadata),
    }
  );
  if (!start.ok) {
    throw new Error(explainYouTubeError(start.status, await start.text().catch(() => '')));
  }
  const sessionUrl = start.headers.get('Location');
  if (!sessionUrl) {
    throw new Error('YouTube did not start the upload session. Try again.');
  }

  options.onProgress?.(0);
  const result = await new Promise<{ status: number; body: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', sessionUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        options.onProgress?.(Math.min(99, Math.round((event.loaded / event.total) * 100)));
      }
    };
    xhr.onerror = () =>
      reject(new Error('Network error while uploading to YouTube. Check your connection and try again.'));
    xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText });
    xhr.send(file);
  });

  if (result.status < 200 || result.status >= 300) {
    throw new Error(explainYouTubeError(result.status, result.body));
  }

  let id = '';
  let finalPrivacy: YouTubePrivacy = privacy;
  try {
    const parsed = JSON.parse(result.body) as { id?: string; status?: { privacyStatus?: YouTubePrivacy } };
    id = parsed.id || '';
    finalPrivacy = parsed.status?.privacyStatus || privacy;
  } catch {
    // handled below
  }
  if (!id) throw new Error('YouTube accepted the file but returned no video id.');

  options.onProgress?.(100);
  return { id, url: `https://www.youtube.com/watch?v=${id}`, privacy: finalPrivacy };
}
