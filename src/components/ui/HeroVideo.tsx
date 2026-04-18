'use client';

import { useEffect, useRef, useState } from 'react';

const HERO_ID = '606Rf0aH9N0';

const SILENT_SRC = `https://www.youtube.com/embed/${HERO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_ID}&modestbranding=1&rel=0&playsinline=1&disablekb=1&enablejsapi=1&iv_load_policy=3`;

const POSTER = `https://img.youtube.com/vi/${HERO_ID}/maxresdefault.jpg`;

export default function HeroVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // posterVisible starts true; we fade it out once the video is playing
  const [posterVisible, setPosterVisible] = useState(true);

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
        // state 1 = playing — fade out the poster immediately
        if (data?.event === 'onStateChange' && data?.info === 1) {
          setPosterVisible(false);
        }
      } catch (_) {}
    }
    window.addEventListener('message', handleMessage);
    // Fallback: hide poster after 1.5s even if events never fire (iOS Safari)
    const fallback = setTimeout(() => setPosterVisible(false), 1500);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      {/* iframe is always visible and playing underneath — no fade-in delay */}
      <iframe
        ref={iframeRef}
        src={SILENT_SRC}
        className="hero-video-iframe absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ border: 'none', pointerEvents: 'none' }}
        allow="autoplay; fullscreen"
        title="Blaske Studio reel"
      />
      {/* Poster sits on top and fades out once the video is confirmed playing.
          On iOS Safari where autoplay is blocked, it stays visible — no black, no YouTube UI. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={POSTER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: posterVisible ? 1 : 0, transition: 'opacity 600ms ease' }}
      />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  );
}
