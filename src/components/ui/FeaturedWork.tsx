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

function FeaturedSlide({ item, index, onClick }: { item: WorkItem; index: number; onClick: () => void }) {
  const [iframeReady, setIframeReady] = useState(false);
  const isCaseStudy = item.contentType === 'case-study';
  const silentSrc = getSilentSrc(item);
  const thumbnail = item.thumbnailStill || getAutoThumbnail(item);
  const youtubeCard = isYouTubeItem(item);
  const reversed = index % 2 !== 0;

  const videoEl = (
    <div
      className="relative w-full sm:w-3/4 aspect-video overflow-hidden shrink-0"
      style={{ background: '#000' }}
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
    </div>
  );

  const metaEl = (
    <div className="flex flex-col gap-4 sm:w-1/4">
      <div className="flex flex-col gap-1">
        <span className="text-xl md:text-[32px] font-bold tracking-tight text-white leading-tight">
          {item.title}
        </span>
        <span className="text-base text-neutral-400 font-normal">{item.client}</span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <Link
          href={item.contentType === 'case-study' ? '/work/video/case-studies' : `/work/video/${item.category}`}
          onClick={(e) => e.stopPropagation()}
          className="pill self-start"
        >
          {item.contentType === 'case-study' ? 'Case Study' : CATEGORY_LABELS[item.category as WorkCategory]}
        </Link>
        {item.year > 0 && (
          <span className="text-base text-neutral-400">{item.year}</span>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="w-full h-full bg-black flex items-center cursor-pointer group"
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
        {reversed ? (
          <>{metaEl}{videoEl}</>
        ) : (
          <>{videoEl}{metaEl}</>
        )}
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
                  index={i}
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
