'use client';

import { useEffect, useRef } from 'react';

const HERO_ID = 'YuHRtvPb3es';

const SILENT_SRC = `https://www.youtube.com/embed/${HERO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_ID}&modestbranding=1&rel=0&playsinline=1&disablekb=1&enablejsapi=1`;

export default function HeroVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.event === 'onReady') {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
          );
        }
      } catch (_) {}
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="absolute inset-0">
      <iframe
        ref={iframeRef}
        src={SILENT_SRC}
        className="hero-video-iframe absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ border: 'none', pointerEvents: 'none' }}
        allow="autoplay; fullscreen"
        title="Blaske Studio reel"
      />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  );
}
