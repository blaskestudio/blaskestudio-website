'use client';

import { useEffect, useRef, useState } from 'react';

const HERO_ID = 'YuHRtvPb3es';

const SILENT_SRC = `https://www.youtube.com/embed/${HERO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_ID}&modestbranding=1&rel=0&playsinline=1&disablekb=1&enablejsapi=1&iv_load_policy=3`;

const POSTER = `https://img.youtube.com/vi/${HERO_ID}/maxresdefault.jpg`;

export default function HeroVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.event === 'onReady') {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
          );
        }
        // state 1 = playing — fires on Chrome/Android but not iOS Safari
        if (data?.event === 'onStateChange' && data?.info === 1) {
          setPlaying(true);
        }
      } catch (_) {}
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      {/* Poster: shows instantly, fades out when video plays.
          Stays visible on iOS Safari where autoplay is blocked — no black, no YouTube UI. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={POSTER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: playing ? 0 : 1, transition: 'opacity 700ms ease' }}
      />
      <iframe
        ref={iframeRef}
        src={SILENT_SRC}
        className="hero-video-iframe absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ border: 'none', pointerEvents: 'none', opacity: playing ? 1 : 0, transition: 'opacity 700ms ease' }}
        allow="autoplay; fullscreen"
        title="Blaske Studio reel"
      />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  );
}
