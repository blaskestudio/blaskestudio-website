'use client';

import { useState, useEffect, useCallback } from 'react';
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
function FeaturedSection({ item, index, onClick }: { item: WorkItem; index: number; onClick: () => void }) {
  const [iframeReady, setIframeReady] = useState(false);
  const isCaseStudy = item.contentType === 'case-study';
  const silentSrc = getSilentSrc(item);
  const youtubeCard = isYouTubeItem(item);
  const reversed = index % 2 !== 0;


  const videoEl = (
    <div className="relative w-full sm:w-3/4 aspect-video overflow-hidden shrink-0" style={{ background: '#000' }}>

      {silentSrc && (
        <iframe
          src={silentSrc}
          className="absolute w-full transition-opacity duration-500"
          style={{ border: 'none', pointerEvents: 'none', opacity: iframeReady ? 1 : 0, top: '-5%', height: '110%', left: 0 }}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={item.title}
          onLoad={(e) => {
            const iframe = e.target as HTMLIFrameElement;
            if (youtubeCard) {
              try {
                iframe.contentWindow?.postMessage(
                  JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
                );
              } catch (_) {}
              setTimeout(() => setIframeReady(true), 1200);
            } else {
              setIframeReady(true);
            }
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
    </div>
  );

  const metaEl = (
    <div className="flex flex-col justify-between sm:w-1/4 self-stretch border border-white p-6">
      <div className="flex flex-col gap-2">
        <span className="text-[32px] font-semibold tracking-tight text-white leading-snug">
          {item.title}
        </span>
        <span className="text-[24px] text-neutral-300 font-normal">{item.client}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Link
          href={item.contentType === 'case-study' ? '/work/video/case-studies' : `/work/video/${item.category}`}
          onClick={(e) => e.stopPropagation()}
          className="text-base tracking-[0.08em] uppercase text-white font-medium hover:text-neutral-300 transition-colors duration-150 no-underline self-start"
        >
          {item.contentType === 'case-study' ? 'Case Study' : CATEGORY_LABELS[item.category as WorkCategory]}
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
      <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
        {reversed ? <>{videoEl}{metaEl}</> : <>{metaEl}{videoEl}</>}
      </div>
    </div>
  );
}

// ── Hero + Studio statement ────────────────────────────────────
function HeroSection({ ready }: { ready: boolean }) {
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const DURATION = '700ms';

  return (
    <div className="w-full bg-black flex flex-col overflow-hidden md:h-screen">
      {/* Hero video — 16:9 on mobile, 75vh on desktop */}
      <div data-nav-theme="hero" className="relative overflow-hidden flex-none aspect-video md:aspect-auto md:h-[75vh]">
        <HeroVideo />
      </div>
      {/* Studio statement — slides up from below on load */}
      <div
        data-nav-theme="light"
        className="flex-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 py-8 md:py-0 md:h-[25vh]"
        style={{
          paddingLeft: 'var(--page-gutter)',
          paddingRight: 'var(--page-gutter)',
          transform: ready ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform ${DURATION} ${EASING}`,
        }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-5xl leading-tight text-white">
          A full-service production studio.{' '}<br />Built on craft, collaboration, and story.
        </h2>
        <Link
          href="/work"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-[16px] tracking-[0.04em] uppercase font-bold text-black bg-white hover:bg-neutral-200 transition-colors duration-150 no-underline"
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
  const [lightboxItem, setLightboxItem] = useState<WorkItem | null>(null);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setIntroReady(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClick = useCallback((item: WorkItem) => {
    if (item.contentType === 'case-study') {
      router.push(`/work/${item.slug}`);
    } else {
      setLightboxItem(item);
    }
  }, [router]);

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

      <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
