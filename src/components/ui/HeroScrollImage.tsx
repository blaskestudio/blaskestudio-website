'use client';

import { useState, useRef, useEffect } from 'react';

const NAV_HEIGHT = 64;

export default function HeroScrollImage({ src, alt = '', visibleVh = 0.75 }: { src: string; alt?: string; visibleVh?: number }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle already-cached images
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  // Scroll so visible image height = 75vh - navHeight (matches home page video)
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      window.scrollTo(0, 0);
      const imageBottom = containerRef.current.getBoundingClientRect().bottom;
      const visibleHeight = visibleVh * window.innerHeight - NAV_HEIGHT;
      const target = Math.max(0, imageBottom - visibleHeight);

      const duration = 900;
      const startTime = performance.now();
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        window.scrollTo(0, target * ease(t));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 400);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[16/9] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
