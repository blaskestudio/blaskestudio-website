'use client';

const HERO_ID = 'YuHRtvPb3es';

const SILENT_SRC = `https://www.youtube.com/embed/${HERO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_ID}&modestbranding=1&rel=0&playsinline=1&disablekb=1`;

export default function HeroVideo() {
  return (
    <div className="absolute inset-0">
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
  );
}
