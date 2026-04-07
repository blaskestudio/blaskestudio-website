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

// ── Featured slide ─────────────────────────────────────────────
function FeaturedSlide({ item, onClick }: { item: WorkItem; onClick: () => void }) {
  const [iframeReady, setIframeReady] = useState(false);
  const isCaseStudy = item.contentType === 'case-study';
  const silentSrc = getSilentSrc(item);
  const thumbnail = item.thumbnailStill || getAutoThumbnail(item);
  const youtubeCard = isYouTubeItem(item);

  return (
    <div
      className="w-full h-full bg-black flex items-center cursor-pointer group"
      style={{ paddingTop: 'var(--nav-height)', paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={isCaseStudy ? `Read case study: ${item.title}` : `Play: ${item.title}`}
    >
      <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
        {/* Video */}
        <div className="relative w-full sm:w-3/4 aspect-video overflow-hidden shrink-0" style={{ background: '#000' }}>
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, 75vw"
              className="object-cover transition-opacity duration-500"
              style={{ opacity: iframeReady ? 0 : 1 }}
              unoptimized={thumbnail.startsWith('https://img.youtube')}
            />
          )}
          {silentSrc && (
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
          {isCaseStudy && (
            <div className="absolute top-4 left-4">
              <span className="text-[10px] tracking-[0.12em] uppercase bg-white text-black px-2.5 py-1.5 leading-none font-semibold">
                Case Study
              </span>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-col gap-4 sm:w-1/4">
          <div className="flex flex-col gap-1">
            <span className="text-xl md:text-[32px] font-bold tracking-tight text-white leading-tight">
              {item.title}
            </span>
            <span className="text-sm text-neutral-400 font-normal">{item.client}</span>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Link
              href={`/work?category=${item.contentType === 'case-study' ? 'case-study' : item.category}`}
              onClick={(e) => e.stopPropagation()}
              className="pill self-start"
            >
              {item.contentType === 'case-study' ? 'Case Study' : CATEGORY_LABELS[item.category as WorkCategory]}
            </Link>
            {item.year > 0 && (
              <span className="text-sm text-neutral-400">{item.year}</span>
            )}
          </div>
        </div>
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
  const [scrolled, setScrolled] = useState(0);
  const [vh, setVh] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  // Total = 1 hero+studio slide + N featured slides
  const totalSlides = items.length + 1;

  useEffect(() => {
    setVh(window.innerHeight);
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setScrolled(Math.max(0, -rect.top));
      // Tell Nav to stay white as long as deck container is in the viewport
      window.dispatchEvent(
        new CustomEvent('hero-deck-change', { detail: { active: rect.bottom > 0 } })
      );
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = useCallback((item: WorkItem) => {
    if (item.contentType === 'case-study') {
      router.push(`/work/${item.slug}`);
    } else {
      setLightboxItem(item);
    }
  }, [router]);

  // Slide 0 progress (hero+studio exiting)
  const slide0Progress = vh > 0 ? Math.min(1, Math.max(0, scrolled / vh)) : 0;

  return (
    <>
      <div ref={containerRef} style={{ height: `${totalSlides * 100}vh` }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* ── Slide 0: Hero + Studio statement ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: totalSlides,
              transform: `translateY(${-slide0Progress * 100}%)`,
              willChange: 'transform',
            }}
          >
            <div className="w-full h-full bg-black flex flex-col">
              {/* Hero video — 75vh */}
              <div className="relative overflow-hidden flex-none" style={{ height: '75vh' }}>
                <HeroVideo />
              </div>
              {/* Studio statement — fills remaining 25vh */}
              <div
                className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
                style={{
                  paddingTop: 'clamp(1.5rem, 3vw, 3rem)',
                  paddingBottom: 'clamp(1.5rem, 3vw, 3rem)',
                  paddingLeft: 'var(--page-gutter)',
                  paddingRight: 'var(--page-gutter)',
                }}
              >
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl leading-tight text-white">
                  A full-service production studio in South Bend, Indiana.
                </h2>
                <Link
                  href="/work"
                  className="shrink-0 inline-flex items-center gap-2 border border-white px-6 py-3 text-[16px] tracking-[0.04em] uppercase font-bold text-white bg-transparent hover:bg-white hover:text-black transition-colors duration-150 no-underline"
                >
                  View All Work
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M0 5H12M8 1L12 5L8 9" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Featured work slides ── */}
          {items.map((item, i) => {
            const slideIndex = i + 1;
            const progress = vh > 0
              ? Math.min(1, Math.max(0, (scrolled - slideIndex * vh) / vh))
              : 0;
            const isLast = slideIndex === totalSlides - 1;
            const translateY = isLast ? '0%' : `${-progress * 100}%`;

            return (
              <div
                key={item.slug}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: totalSlides - slideIndex,
                  transform: `translateY(${translateY})`,
                  willChange: 'transform',
                }}
              >
                <FeaturedSlide item={item} onClick={() => handleClick(item)} />
              </div>
            );
          })}

        </div>
      </div>
      <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
