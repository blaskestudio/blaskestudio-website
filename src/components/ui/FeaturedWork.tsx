'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { WorkItem, CATEGORY_LABELS, WorkCategory } from '@/lib/types';
import VideoLightbox from './VideoLightbox';
import Link from 'next/link';

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
  if (video?.type === 'youtube')
    return `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  return '';
}

interface Props {
  items: WorkItem[];
}

function FeaturedSlide({ item, onClick }: { item: WorkItem; onClick: () => void }) {
  const [iframeReady, setIframeReady] = useState(false);
  const isCaseStudy = item.contentType === 'case-study';
  const silentSrc = getSilentSrc(item);
  const thumbnail = item.thumbnailStill || getAutoThumbnail(item);
  const youtubeCard = isYouTubeItem(item);

  return (
    <div
      className="w-full h-full bg-white flex items-center cursor-pointer group"
      style={{
        paddingTop: 'var(--nav-height)',
        paddingLeft: 'var(--page-gutter)',
        paddingRight: 'var(--page-gutter)',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={isCaseStudy ? `Read case study: ${item.title}` : `Play: ${item.title}`}
    >
      <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">

        {/* Video */}
        <div
          className="relative w-full sm:w-3/4 aspect-video overflow-hidden shrink-0"
          style={{ background: '#111', maxHeight: '70vh' }}
        >
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
        <div className="flex flex-col gap-3 sm:w-1/4">
          <span className="text-xl md:text-[32px] font-bold tracking-tight text-black leading-tight">
            {item.title}
          </span>
          <span className="text-sm text-neutral-700">{item.client}</span>
          <div className="flex flex-col gap-2 mt-2">
            <Link
              href={`/work?category=${item.contentType === 'case-study' ? 'case-study' : item.category}`}
              onClick={(e) => e.stopPropagation()}
              className="pill self-start"
            >
              {item.contentType === 'case-study' ? 'Case Study' : CATEGORY_LABELS[item.category as WorkCategory]}
            </Link>
            {item.year > 0 && (
              <span className="text-sm text-neutral-600">{item.year}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function FeaturedWork({ items }: Props) {
  const router = useRouter();
  const [lightboxItem, setLightboxItem] = useState<WorkItem | null>(null);
  const [scrolled, setScrolled] = useState(0);
  const [vh, setVh] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

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
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = useCallback(
    (item: WorkItem) => {
      if (item.contentType === 'case-study') {
        router.push(`/work/${item.slug}`);
      } else {
        setLightboxItem(item);
      }
    },
    [router]
  );

  return (
    <>
      {/* Outer container creates scroll space: N slides × 100vh */}
      <div
        ref={containerRef}
        style={{ height: `${items.length * 100}vh` }}
      >
        {/* Sticky viewport — cards stack inside here */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {items.map((item, i) => {
            // How far through this card's scroll slot are we? (0 → 1)
            const progress = vh > 0
              ? Math.min(1, Math.max(0, (scrolled - i * vh) / vh))
              : 0;

            // Last card never exits — it stays until the sticky zone ends
            const translateY = i < items.length - 1
              ? `${-progress * 100}%`
              : '0%';

            return (
              <div
                key={item.slug}
                style={{
                  position: 'absolute',
                  inset: 0,
                  // Earlier cards sit on top (they slide out over the next)
                  zIndex: items.length - i,
                  transform: `translateY(${translateY})`,
                  willChange: 'transform',
                }}
              >
                <FeaturedSlide
                  item={item}
                  onClick={() => handleClick(item)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
