'use client';
import { useEffect } from 'react';

export default function AboutHeroScroll() {
  useEffect(() => {
    // Reset to top in case of back navigation
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      const hero = document.getElementById('about-hero-image');
      if (!hero) return;

      const target = hero.offsetTop;
      const duration = 900;
      const startTime = performance.now();

      // ease-in-out cubic — matches feel of nav drop-in
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        window.scrollTo(0, target * ease(t));
        if (t < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }, 400); // brief pause so the image is visible before scrolling

    return () => clearTimeout(timer);
  }, []);

  return null;
}
