'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { WorkItem } from '@/lib/types';
import { parseVideoUrl } from '@/lib/sheets';

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
  item: WorkItem | null;
  onClose: () => void;
}

export default function VideoLightbox({ item, onClose }: Props) {
  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  const src = getEmbedSrc(item);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
      style={{ backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors duration-150 cursor-pointer"
      >
        Close ✕
      </button>

      {/* Video container — stops click propagation so backdrop click closes */}
      <div
        className="relative w-full mx-6"
        style={{ maxWidth: '1100px', aspectRatio: '16/9' }}
        onClick={(e) => e.stopPropagation()}
      >
        {src ? (
          <iframe
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

      {/* Title below video */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
        <span className="text-white/70 text-xs tracking-[0.1em]">{item.title}</span>
        <span className="text-white/30 text-[10px] tracking-[0.12em] uppercase font-semibold">{item.client}</span>
      </div>
    </div>,
    document.body
  );
}
