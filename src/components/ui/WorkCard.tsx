'use client';

import { useState } from 'react';
import { WorkItem } from '@/lib/types';

function getSilentEmbedSrc(item: WorkItem): string {
  if (item.contentType === 'project' && item.thumbnailShortUrl) {
    const id = item.thumbnailShortUrl;
    return `https://iframe.videodelivery.net/${id}?autoplay=true&muted=true&loop=true&controls=false&preload=true`;
  }
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (!video || video.type === 'local' || !video.id) return '';
  if (video.type === 'vimeo')
    return `https://player.vimeo.com/video/${video.id}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`;
  if (video.type === 'youtube')
    return `https://www.youtube.com/embed/${video.id}?enablejsapi=1&mute=1&controls=0&loop=1&playlist=${video.id}&modestbranding=1&rel=0&playsinline=1`;
  return '';
}

interface Props {
  item: WorkItem;
  onClick: () => void;
}

export default function WorkCard({ item, onClick }: Props) {
  const [videoReady, setVideoReady] = useState(false);
  const silentSrc = getSilentEmbedSrc(item);
  const isCaseStudy = item.contentType === 'case-study';
  const isCloudflare = item.contentType === 'project' && !!item.thumbnailShortUrl;
  const isYouTube = !isCloudflare && (item.contentType === 'project' ? item.video : item.heroVideo)?.type === 'youtube';

  // CF thumbnail shown as background while iframe loads, hidden once video paints
  const cfThumbStyle = isCloudflare
    ? { backgroundImage: `url(https://videodelivery.net/${(item as any).thumbnailShortUrl}/thumbnails/thumbnail.jpg?time=0s)`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div
      className="group flex flex-col cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={isCaseStudy ? `Read case study: ${item.title}` : `Play: ${item.title}`}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-[#111]" style={cfThumbStyle}>
        {silentSrc && (
          <iframe
            src={silentSrc}
            className="absolute inset-0 w-full h-full transition-opacity duration-700"
            style={{ border: 'none', pointerEvents: 'none', opacity: videoReady ? 1 : 0 }}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={item.title}
            onLoad={(e) => {
              if (isYouTube) {
                const iframe = e.target as HTMLIFrameElement;
                try {
                  iframe.contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
                  );
                } catch (_) {}
              }
              setVideoReady(true);
            }}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none flex flex-col justify-end p-3 gap-0.5">
          <span className="text-sm text-white font-medium leading-tight">{item.title}</span>
          <span className="text-xs text-white/70 font-normal leading-tight">
            {item.client}{item.year ? `, ${item.year}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
