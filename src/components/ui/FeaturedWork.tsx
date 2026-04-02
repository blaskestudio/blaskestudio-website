'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { WorkItem, CATEGORY_LABELS, WorkCategory } from '@/lib/types';
import VideoLightbox from './VideoLightbox';
import Link from 'next/link';

function getSilentSrc(item: WorkItem): string {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (!video || video.type === 'local') return '';
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

function FeaturedCard({ item, onClick, reversed }: { item: WorkItem; onClick: () => void; reversed: boolean }) {
  const [hovered, setHovered]       = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const isCaseStudy = item.contentType === 'case-study';
  const silentSrc   = getSilentSrc(item);
  const thumbnail   = item.thumbnailStill || getAutoThumbnail(item);
  const youtubeCard = isYouTubeItem(item);

  return (
    <div
      className={`group flex flex-col gap-6 sm:gap-8 py-12 items-start ${reversed ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setIframeReady(false); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={isCaseStudy ? `Read case study: ${item.title}` : `Play: ${item.title}`}
    >
      <div
        className="relative w-full sm:w-3/4 aspect-video overflow-hidden shrink-0"
        style={{ background: '#111' }}
        data-cursor-label={isCaseStudy ? 'Read the Story' : 'Watch Video'}
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
        {silentSrc && hovered && (
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
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500 pointer-events-none" />
        {isCaseStudy && (
          <div className="absolute top-4 left-4">
            <span className="text-sm tracking-[0.12em] uppercase bg-white text-black px-2.5 py-1.5 leading-none font-semibold">
              Case Study
            </span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className={`flex flex-col gap-3 sm:pt-1 sm:w-1/4 ${reversed ? 'sm:items-end sm:text-right' : ''}`}>
        <span className="text-base md:text-lg font-bold text-black leading-tight">
          {item.title}
        </span>
        <span className="text-sm text-neutral-700">{item.client}</span>
        <div className={`flex flex-col gap-2 mt-auto pt-4 ${reversed ? 'sm:items-end' : ''}`}>
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
  );
}

export default function FeaturedWork({ items }: Props) {
  const router = useRouter();
  const [lightboxItem, setLightboxItem] = useState<WorkItem | null>(null);

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
      <div className="flex flex-col">
        {items.map((item, i) => (
          <FeaturedCard key={item.slug} item={item} onClick={() => handleClick(item)} reversed={i % 2 !== 0} />
        ))}
      </div>
      <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
