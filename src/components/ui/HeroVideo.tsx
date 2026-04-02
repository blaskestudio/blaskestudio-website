'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const HERO_ID = 'OUhcJS9PIBE';
const NAV_DELAY = 2500; // must match Nav.tsx

const SILENT_SRC = `https://www.youtube.com/embed/${HERO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_ID}&modestbranding=1&rel=0&playsinline=1&disablekb=1`;
const SOUND_SRC  = `https://www.youtube.com/embed/${HERO_ID}?autoplay=1&rel=0&modestbranding=1`;

export default function HeroVideo() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [cursorReady, setCursorReady]   = useState(false);

  // Show cursor label at the same moment the nav slides in
  useEffect(() => {
    const t = setTimeout(() => setCursorReady(true), NAV_DELAY);
    return () => clearTimeout(t);
  }, []);

  const close = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, close]);

  return (
    <>
      {/* ── Silent background video ── */}
      <div
        className="absolute inset-0"
        onClick={() => setLightboxOpen(true)}
        role="button"
        aria-label="Play reel with sound"
        tabIndex={0}
        {...(cursorReady ? { 'data-cursor-label': 'Watch Full Reel' } : {})}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true); }}
      >
        <iframe
          src={SILENT_SRC}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 'calc(100vw + 200px)',
            height: 'calc((100vw + 200px) * 9 / 16)',
            minHeight: 'calc(100vh + 200px)',
            minWidth: 'calc((100vh + 200px) * 16 / 9)',
            border: 'none',
            pointerEvents: 'none',
          }}
          allow="autoplay; fullscreen"
          title="Blaske Studio reel"
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
          style={{ backdropFilter: 'blur(4px)' }}
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 text-white/50 hover:text-white text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors duration-150 cursor-pointer"
          >
            Close ✕
          </button>

          <div
            className="relative w-full mx-6"
            style={{ maxWidth: '1100px', aspectRatio: '16/9' }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={SOUND_SRC}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
              title="Blaske Studio reel"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
