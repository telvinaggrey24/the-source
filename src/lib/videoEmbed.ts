export type VideoSource =
  | { kind: 'iframe'; src: string; provider: 'youtube' | 'vimeo' | 'facebook' | 'tiktok' }
  | { kind: 'file'; src: string; poster?: string };

const FILE_EXT = /\.(mp4|m4v|mov|webm|ogv)(\?.*)?$/i;

function youtubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
  if (host === 'youtu.be') return url.pathname.split('/')[1] || null;
  if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'music.youtube.com') {
    if (url.pathname === '/watch') return url.searchParams.get('v');
    const m = url.pathname.match(/^\/(embed|shorts|live|v)\/([\w-]{6,})/);
    if (m) return m[2];
  }
  return null;
}

function cloudinaryPlayable(src: string): { src: string; poster?: string } {
  if (!src.includes('res.cloudinary.com') || !src.includes('/video/upload/')) return { src };
  const base = src.replace(/\.[a-z0-9]+(\?.*)?$/i, '');
  return {
    // iPhone .mov (HEVC) does not play in Chrome/Android; ask Cloudinary for H.264 MP4.
    src: `${base.replace('/video/upload/', '/video/upload/f_mp4,vc_h264,q_auto/')}.mp4`,
    poster: `${base.replace('/video/upload/', '/video/upload/so_0,f_jpg,q_auto,w_1280/')}.jpg`,
  };
}

/** Turn a pasted link or uploaded file URL into something we can embed in the article. */
export function parseVideoUrl(raw: string | undefined | null): VideoSource | null {
  const value = (raw || '').trim();
  if (!/^https?:\/\//i.test(value)) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const yt = youtubeId(url);
  if (yt) {
    return {
      kind: 'iframe',
      provider: 'youtube',
      src: `https://www.youtube-nocookie.com/embed/${yt}?rel=0&playsinline=1`,
    };
  }

  const host = url.hostname.replace(/^www\./, '');

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = url.pathname.match(/(\d{5,})/)?.[1];
    if (id) return { kind: 'iframe', provider: 'vimeo', src: `https://player.vimeo.com/video/${id}` };
  }

  if (host === 'facebook.com' || host === 'fb.watch' || host === 'm.facebook.com') {
    return {
      kind: 'iframe',
      provider: 'facebook',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(value)}&show_text=false`,
    };
  }

  if (host === 'tiktok.com') {
    const id = url.pathname.match(/\/video\/(\d+)/)?.[1];
    if (id) return { kind: 'iframe', provider: 'tiktok', src: `https://www.tiktok.com/embed/v2/${id}` };
  }

  if (FILE_EXT.test(url.pathname + url.search) || url.pathname.includes('/video/upload/')) {
    return { kind: 'file', ...cloudinaryPlayable(value) };
  }

  return null;
}

/** A body line that is only a video link (optionally written as [label](link)). */
export function videoUrlFromLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const md = trimmed.match(/^\[[^\]]*\]\((https?:\/\/[^)\s]+)\)$/);
  const candidate = md ? md[1] : trimmed;
  if (/\s/.test(candidate)) return null;
  return parseVideoUrl(candidate) ? candidate : null;
}
