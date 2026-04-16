'use client';
import { useEffect } from 'react';

const NAV_HEIGHT = 64;
const VIDEO_VH = 0.75; // home page hero is 75vh

export default function AboutHeroScroll() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      const hero = document.getElementById('about-hero-image');
      if (!hero) return;

      // Scroll so the visible portion of the image = 75vh - navHeight (matches home video)
      const imageBottom = hero.getBoundingClientRect().bottom; // scrollY=0 so same as abs position
      const visibleHeight = VIDEO_VH * window.innerHeight - NAV_HEIGHT;
      const target = imageBottom - visibleHeight;

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
  }, []);

  return null;
}
