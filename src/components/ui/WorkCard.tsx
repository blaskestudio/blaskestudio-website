'use client';

import { useState, useEffect, useRef } from 'react';
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

interface Props {
  item: WorkItem;
  onClick: () => void;
}

export default function WorkCard({ item, onClick }: Props) {
  const [iframeReady, setIframeReady] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const silentSrc = getSilentEmbedSrc(item);
  const isCaseStudy = item.contentType === 'case-study';
  const isYouTube = (item.contentType === 'project' ? item.video : item.heroVideo)?.type === 'youtube';

  // Mount iframe 800px ahead of viewport so it buffers before becoming visible
  useEffect(() => {
    if (!silentSrc) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '800px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [silentSrc]);

  return (
    <div
      ref={containerRef}
      className="group flex flex-col cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={isCaseStudy ? `Read case study: ${item.title}` : `Play: ${item.title}`}
    >
      <div
        className="relative w-full aspect-video overflow-hidden"
        style={{ background: '#111' }}
      >
        {silentSrc && inView && (
          <iframe
            src={silentSrc}
            className="absolute inset-0 w-full h-full transition-opacity duration-700"
            style={{ border: 'none', pointerEvents: 'none', opacity: iframeReady ? 1 : 0 }}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={item.title}
            onLoad={(e) => {
              const iframe = e.target as HTMLIFrameElement;
              if (isYouTube) {
                // Trigger autoplay, then reveal after a short delay — long enough for
                // YouTube to start playing so the branded player UI never shows.
                try {
                  iframe.contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
                  );
                } catch (_) {}
                setTimeout(() => setIframeReady(true), 1200);
              } else {
                // Vimeo background player strips all UI — safe to reveal immediately
                setIframeReady(true);
              }
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
