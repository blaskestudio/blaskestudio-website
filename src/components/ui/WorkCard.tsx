'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { WorkItem } from '@/lib/types';

function getSilentEmbedSrc(item: WorkItem): string {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (!video || video.type === 'local' || !video.id) return '';
  if (video.type === 'vimeo')
    return `https://player.vimeo.com/video/${video.id}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`;
  if (video.type === 'youtube')
    return `https://www.youtube.com/embed/${video.id}?enablejsapi=1&mute=1&controls=0&loop=1&playlist=${video.id}&modestbranding=1&rel=0&playsinline=1`;
  return '';
}

function isYouTubeItem(item: WorkItem): boolean {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  return video?.type === 'youtube';
}

function getAutoThumbnail(item: WorkItem): string {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (video?.type === 'youtube' && video.id)
    return `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  return '';
}

interface Props {
  item: WorkItem;
  onClick: () => void;
}

export default function WorkCard({ item, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const shortUrl = item.thumbnailShortUrl ?? '';
  const useShortVideo = !!shortUrl;
  const silentSrc = useShortVideo ? '' : getSilentEmbedSrc(item);
  const hasVideo = useShortVideo || !!silentSrc;
  const thumbnail = item.thumbnailStill || getAutoThumbnail(item);
  const youtubeCard = !useShortVideo && isYouTubeItem(item);
  const isCaseStudy = item.contentType === 'case-study';

  // Load video/iframe as soon as card enters viewport (200px margin)
  useEffect(() => {
    if (!hasVideo) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasVideo]);

  const mediaReady = useShortVideo ? videoReady : iframeReady;

  return (
    <div
      ref={containerRef}
      className="group flex flex-col cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={isCaseStudy ? `Read case study: ${item.title}` : `Play: ${item.title}`}
    >
      {/* ── Media container ──────────────────────────────── */}
      <div
        className="relative w-full aspect-video overflow-hidden"
        style={{ background: '#111' }}
      >
        {/* Thumbnail — fades out once video/iframe is playing */}
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-opacity duration-700"
            style={{ opacity: mediaReady ? 0 : 1 }}
            priority={false}
            unoptimized={thumbnail.startsWith('https://img.youtube')}
          />
        )}

        {/* Short looping video — used when thumbnail_short_url is set */}
        {useShortVideo && inView && (
          <video
            src={shortUrl}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ pointerEvents: 'none', opacity: videoReady ? 1 : 0 }}
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={() => setVideoReady(true)}
          />
        )}

        {/* Silent autoplay iframe — fallback when no short video */}
        {!useShortVideo && silentSrc && inView && (
          <iframe
            src={silentSrc}
            className="absolute inset-0 w-full h-full transition-opacity duration-700"
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

        {/* Hover overlay — title + client */}
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
