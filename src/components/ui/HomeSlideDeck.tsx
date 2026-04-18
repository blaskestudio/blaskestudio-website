'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import HeroVideo from '@/components/ui/HeroVideo';
import VideoLightbox from '@/components/ui/VideoLightbox';
import { WorkItem, CATEGORY_LABELS, WorkCategory } from '@/lib/types';

// ── Helpers ────────────────────────────────────────────────────
function getSilentSrc(item: WorkItem): string {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (!video || video.type === 'local' || !video.id) return '';
  if (video.type === 'vimeo')
    return `https://player.vimeo.com/video/${video.id}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`;
  if (video.type === 'youtube')
    return `https://www.youtube.com/embed/${video.id}?autoplay=1&enablejsapi=1&mute=1&controls=0&loop=1&playlist=${video.id}&modestbranding=1&rel=0&playsinline=1`;
  return '';
}

function isYouTubeItem(item: WorkItem): boolean {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  return video?.type === 'youtube';
}


// ── Featured section ───────────────────────────────────────────
function getThumbnail(item: WorkItem): string {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (item.thumbnailStill) return item.thumbnailStill;
  if (video?.type === 'youtube' && video.id)
    return `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  if (video?.type === 'vimeo' && video.id)
    return `https://vumbnail.com/${video.id}.jpg`;
  return '';
}

function FeaturedSection({ item, index, onClick }: { item: WorkItem; index: number; onClick: () => void }) {
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isCaseStudy = item.contentType === 'case-study';
  const silentSrc = getSilentSrc(item);
  const youtubeCard = isYouTubeItem(item);
  const reversed = index % 2 !== 0;
  const thumbnail = getThumbnail(item);

  // Listen for YouTube onReady and trigger play
  useEffect(() => {
    if (!youtubeCard) return;
    function handleMessage(e: MessageEvent) {
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.event === 'onReady') {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
          );
          setTimeout(() => setIframeReady(true), 500);
        }
      } catch (_) {}
    }
    window.addEventListener('message', handleMessage);
    // Fallback: show iframe after 3s even if onReady never fires
    const fallback = setTimeout(() => setIframeReady(true), 3000);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(fallback);
    };
  }, [youtubeCard]);

  const videoEl = (
    <div className="relative w-full sm:w-3/4 aspect-video overflow-hidden shrink-0" style={{ background: '#000' }}>

      {/* Thumbnail — visible while video loads */}
      {thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: iframeReady ? 0 : 1 }}
        />
      )}

      {silentSrc && (
        <iframe
          ref={iframeRef}
          src={silentSrc}
          className="absolute w-full transition-opacity duration-500"
          style={{ border: 'none', pointerEvents: 'none', opacity: iframeReady ? 1 : 0, top: '-5%', height: '110%', left: 0 }}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={item.title}
          onLoad={() => {
            if (!youtubeCard) setIframeReady(true);
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
    </div>
  );

  const categoryLabel = item.contentType === 'case-study' ? 'Case Study' : CATEGORY_LABELS[item.category as WorkCategory];
  const categoryHref = item.contentType === 'case-study' ? '/work/video/case-studies' : `/work/video/${item.category}`;

  const metaEl = (
    <div className="flex flex-col justify-between sm:w-1/4 self-stretch border border-white p-4 sm:p-6">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <span className="text-[22px] sm:text-[28px] font-semibold tracking-tight text-white leading-snug">
          {item.title}
        </span>
        {/* Mobile: client · category in one row. Desktop: client only here, category moves to bottom */}
        <div className="flex items-center gap-2 flex-wrap sm:block">
          <span className="text-[17px] sm:text-[22px] text-neutral-300 font-normal">{item.client}</span>
          <span className="text-[17px] sm:text-[22px] text-neutral-500 font-normal select-none sm:hidden">·</span>
          <Link
            href={categoryHref}
            onClick={(e) => e.stopPropagation()}
            className="text-[17px] sm:hidden text-neutral-300 font-normal hover:text-white transition-colors duration-150 no-underline"
          >
            {categoryLabel}
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Link
          href={categoryHref}
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:inline text-base tracking-[0.08em] uppercase text-white font-medium hover:text-neutral-300 transition-colors duration-150 no-underline self-start"
        >
          {categoryLabel}
        </Link>
        {item.year > 0 && (
          <span className="text-base text-neutral-500 font-semibold">{item.year}</span>
        )}
      </div>
    </div>
  );

  return (
    <div
      data-nav-theme="light"
      className="w-full bg-black flex items-center cursor-pointer group"
      style={{ paddingTop: 'var(--nav-height)', paddingBottom: 'var(--nav-height)', paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={isCaseStudy ? `Read case study: ${item.title}` : `Play: ${item.title}`}
    >
      <div className={`w-full flex flex-col items-center gap-[var(--page-gutter)] sm:gap-8 ${reversed ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
        {videoEl}
        {metaEl}
      </div>
    </div>
  );
}

// ── Hero + Studio statement ────────────────────────────────────
function HeroSection({ ready }: { ready: boolean }) {
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const DURATION = '700ms';

  return (
    <div className="w-full bg-black flex flex-col overflow-hidden sm:h-screen">
      {/* Mobile: natural 16:9 height. sm+: fills remaining space so nav+video+statement = 100vh */}
      <div data-nav-theme="hero" className="relative overflow-hidden aspect-video sm:aspect-auto sm:flex-1">
        <HeroVideo />
      </div>
      {/* Studio statement — slides up from below on load */}
      <div
        data-nav-theme="light"
        className="flex-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-8 py-6 sm:py-8 md:py-0 md:h-[25vh]"
        style={{
          paddingLeft: 'var(--page-gutter)',
          paddingRight: 'var(--page-gutter)',
          transform: ready ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform ${DURATION} ${EASING}`,
        }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight max-w-5xl leading-tight text-white text-balance sm:text-pretty">
          A full-service production studio.{' '}<br className="hidden sm:block" />Built on craft, collaboration, and story.
        </h2>
        <Link
          href="/work"
          className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-6 py-3 text-[16px] tracking-[0.04em] uppercase font-bold text-black bg-white hover:bg-neutral-200 transition-colors duration-150 no-underline"
        >
          Our Work
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M0 5H12M8 1L12 5L8 9" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
interface Props {
  items: WorkItem[];
}

export default function HomeSlideDeck({ items }: Props) {
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxItems = items.filter(i => i.contentType !== 'case-study');
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setIntroReady(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClick = useCallback((item: WorkItem) => {
    if (item.contentType === 'case-study') {
      router.push(`/work/${item.slug}`);
    } else {
      const idx = lightboxItems.indexOf(item);
      setLightboxIndex(idx >= 0 ? idx : null);
    }
  }, [router, lightboxItems]);

  return (
    <>
      {/* ── Hero + Studio statement ── */}
      <HeroSection ready={introReady} />

      {/* ── Featured work — normal scroll, alternating layout ── */}
      {items.map((item, i) => (
        <FeaturedSection
          key={item.slug}
          item={item}
          index={i}
          onClick={() => handleClick(item)}
        />
      ))}

      <VideoLightbox items={lightboxItems} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </>
  );
}
