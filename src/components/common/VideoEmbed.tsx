import React from 'react';
import { parseVideoUrl } from '../../lib/videoEmbed';

interface VideoEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title = 'Video', className = '' }) => {
  const source = parseVideoUrl(url);
  if (!source) return null;

  if (source.kind === 'iframe') {
    const vertical = source.provider === 'tiktok';
    return (
      <div
        className={`relative w-full overflow-hidden bg-black ${
          vertical ? 'mx-auto max-w-sm h-[640px]' : 'aspect-video'
        } ${className}`}
      >
        <iframe
          src={source.src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <video
      key={source.src}
      src={source.src}
      poster={source.poster}
      controls
      playsInline
      preload="metadata"
      className={`w-full aspect-video bg-black object-contain ${className}`}
    >
      <a href={url}>{title}</a>
    </video>
  );
};
