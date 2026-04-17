'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { WorkItem } from '@/lib/types';

function getEmbedSrc(item: WorkItem): string {
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (!video || video.type === 'local') return '';
  if (video.type === 'vimeo')
    return `https://player.vimeo.com/video/${video.id}?autoplay=1&byline=0&title=0&portrait=0&color=ffffff`;
  if (video.type === 'youtube')
    return `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
  return '';
}

interface Props {
  items: WorkItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function VideoLightbox({ items, index, onClose, onNavigate }: Props) {
  const item = index !== null ? items[index] : null;

  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && index !== null && index > 0) onNavigate(index - 1);
      if (e.key === 'ArrowRight' && index !== null && index < items.length - 1) onNavigate(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [item, index, items.length, onClose, onNavigate]);

  if (!item || index === null) return null;

  const src = getEmbedSrc(item);
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
      style={{ backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white text-[12px] tracking-[0.08em] uppercase font-normal transition-colors duration-150 cursor-pointer"
      >
        Close ✕
      </button>

      {/* Prev arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(index - 1); }}
        className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white transition-opacity duration-150 ${hasPrev ? 'opacity-60 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Previous video"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 4l-8 8 8 8" />
        </svg>
      </button>

      {/* Video container */}
      <div
        className="relative w-full mx-16 sm:mx-20"
        style={{ maxWidth: '1100px', aspectRatio: '16/9' }}
        onClick={(e) => e.stopPropagation()}
      >
        {src ? (
          <iframe
            key={item.slug}
            src={src}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
            title={item.title}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm tracking-wide">
            No video available
          </div>
        )}
      </div>

      {/* Next arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(index + 1); }}
        className={`absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white transition-opacity duration-150 ${hasNext ? 'opacity-60 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Next video"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 4l8 8-8 8" />
        </svg>
      </button>

      {/* Title + client below video */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
        <span className="text-base text-white/70 font-medium">{item.title}</span>
        <span className="text-base text-white/70 font-medium">{item.client}</span>
      </div>
    </div>,
    document.body
  );
}
