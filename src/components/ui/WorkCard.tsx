'use client';

import { useState } from 'react';
import Image from 'next/image';
import { WorkItem } from '@/lib/types';

function getSilentEmbedSrc(item: WorkItem): string {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (!video || video.type === 'local') return '';
  if (video.type === 'vimeo')
    return `https://player.vimeo.com/video/${video.id}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`;
  // enablejsapi=1 lets us trigger play via postMessage — more reliable than ?autoplay=1 across multiple iframes
  if (video.type === 'youtube')
    return `https://www.youtube.com/embed/${video.id}?enablejsapi=1&mute=1&controls=0&loop=1&playlist=${video.id}&modestbranding=1&rel=0&playsinline=1`;
  return '';
}

function isYouTubeItem(item: WorkItem): boolean {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  return video?.type === 'youtube';
}

// Free YouTube thumbnail — no API key needed
function getAutoThumbnail(item: WorkItem): string {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (video?.type === 'youtube' && video.id) {
    return `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  }
  return '';
}

interface Props {
  item: WorkItem;
  onClick: () => void;
}

export default function WorkCard({ item, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  const silentSrc = getSilentEmbedSrc(item);
  const hasVideo = !!silentSrc;
  const thumbnail = item.thumbnailStill || getAutoThumbnail(item);
  const youtubeCard = isYouTubeItem(item);
  const isCaseStudy = item.contentType === 'case-study';

  return (
    <div
      className="group flex flex-col gap-3 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setIframeReady(false); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={isCaseStudy ? `Read case study: ${item.title}` : `Play: ${item.title}`}
    >
      {/* ── Media container ──────────────────────────────── */}
      <div
        className="relative w-full aspect-video overflow-hidden"
        style={{ background: '#111' }}
        data-cursor-label={isCaseStudy ? 'Read the Story' : 'Watch Video'}
      >
        {/* Thumbnail — fades out once iframe is playing */}
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-opacity duration-500"
            style={{ opacity: iframeReady ? 0 : 1 }}
            priority={false}
            unoptimized={thumbnail.startsWith('https://img.youtube')}
          />
        )}

        {/* Silent autoplay iframe — loads on hover only */}
        {hasVideo && hovered && (
          <iframe
            src={silentSrc}
            className="absolute inset-0 w-full h-full transition-opacity duration-500"
            style={{ border: 'none', pointerEvents: 'none', opacity: iframeReady ? 1 : 0 }}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={item.title}
            onLoad={(e) => {
              if (youtubeCard) {
                try {
                  (e.target as HTMLIFrameElement).contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
                  );
                } catch (_) {}
              }
              setIframeReady(true);
            }}
          />
        )}

        {/* Dark hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 pointer-events-none" />

        {/* CTA hint — case studies only; videos use the cursor pill */}
        {isCaseStudy && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="text-[10px] tracking-[0.12em] uppercase text-white font-semibold">
              Read the Story →
            </span>
          </div>
        )}

        {/* Case study badge */}
        {isCaseStudy && (
          <div className="absolute top-3 left-3">
            <span className="text-[9px] tracking-[0.12em] uppercase bg-white text-black px-2 py-1 leading-none font-semibold">
              Case Study
            </span>
          </div>
        )}
      </div>

      {/* ── Metadata ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-black">
          {item.title}
        </span>
        <p className="text-xs text-neutral-400 tracking-wide">
          {item.client}{item.year ? ` — ${item.year}` : ''}
        </p>
      </div>
    </div>
  );
}
