'use client';

import { useEffect, useRef, useState } from 'react';

const HERO_ID = 'YuHRtvPb3es';

const SILENT_SRC = `https://www.youtube.com/embed/${HERO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_ID}&modestbranding=1&rel=0&playsinline=1&disablekb=1&enablejsapi=1&iv_load_policy=3`;

export default function HeroVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Fallback for iOS Safari which blocks autoplay events — show after 4s regardless
    const fallback = setTimeout(() => setPlaying(true), 4000);

    function handleMessage(e: MessageEvent) {
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.event === 'onReady') {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
          );
        }
        // info: 1 = playing — fires on Chrome/Android, not iOS Safari
        if (data?.event === 'onStateChange' && data?.info === 1) {
          clearTimeout(fallback);
          setPlaying(true);
        }
      } catch (_) {}
    }
    window.addEventListener('message', handleMessage);
    return () => {
      clearTimeout(fallback);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      <iframe
        ref={iframeRef}
        src={SILENT_SRC}
        className="hero-video-iframe absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700"
        style={{ border: 'none', pointerEvents: 'none', opacity: playing ? 1 : 0 }}
        allow="autoplay; fullscreen"
        title="Blaske Studio reel"
      />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  );
}
