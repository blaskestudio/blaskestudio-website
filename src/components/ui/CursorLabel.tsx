'use client';

import { useEffect, useRef } from 'react';

export default function CursorLabel() {
  const pillRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId: number;
    const lastPos = { x: -1, y: -1 };

    const applyLabel = (x: number, y: number) => {
      // Walk up from element at point to find data-cursor-label
      let el = document.elementFromPoint(x, y) as HTMLElement | null;
      let found = '';
      while (el) {
        const l = el.getAttribute('data-cursor-label');
        if (l) { found = l; break; }
        el = el.parentElement;
      }
      if (pillRef.current)  pillRef.current.style.opacity = found ? '1' : '0';
      if (labelRef.current && found) labelRef.current.textContent = found;
    };

    const onMove = (e: MouseEvent) => {
      lastPos.x = e.clientX;
      lastPos.y = e.clientY;

      applyLabel(e.clientX, e.clientY);

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (pillRef.current) {
          pillRef.current.style.transform =
            `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
        }
      });
    };

    // Poll at the last known position — catches attribute changes without mouse movement
    const interval = setInterval(() => {
      if (lastPos.x >= 0) applyLabel(lastPos.x, lastPos.y);
    }, 80);

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={pillRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none transition-opacity duration-150"
      style={{ opacity: 0, willChange: 'transform' }}
      aria-hidden="true"
    >
      <div className="text-black text-[10px] tracking-[0.14em] uppercase font-semibold px-5 py-3 rounded-full flex items-center gap-2.5 whitespace-nowrap shadow-[0_2px_20px_rgba(0,0,0,0.18)]" style={{ backgroundColor: '#60A5FA' }}>
        <span className="text-[11px]">▶</span>
        <span ref={labelRef} />
      </div>
    </div>
  );
}
