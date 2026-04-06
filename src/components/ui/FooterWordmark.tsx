'use client';

import { useEffect, useRef, useState } from 'react';

// Each letter as a standalone path + its local viewBox width so we can set transform-origin
const LETTERS = [
  // B
  {
    d: 'M0 0H43.47C67.36 0 73.62 2.35 73.62 10.52V31.07C73.62 37.38 69.7 40.23 57.56 41.22C69.7 42.21 73.62 45.06 73.62 51.25V76.13C73.62 84.3 67.35 86.65 43.47 86.65H0V0ZM43.47 11.63C43.47 9.65 42.69 8.91 37.6 8.91H30.16V36.76H37.6C42.69 36.76 43.47 36.02 43.47 34.04V11.63ZM30.15 45.68V77.74H37.59C42.68 77.74 43.46 77 43.46 75.02V48.41C43.46 46.31 42.68 45.69 37.59 45.69H30.15V45.68Z',
    tx: 0,
  },
  // L
  {
    d: 'M0 0H30.15V77.74H52.47V86.65H0V0Z',
    tx: 82,
  },
  // A
  {
    d: 'M46.21 74.89H28.98L27.02 86.65H0L18.8 0H59.92L78.72 86.65H48.57L46.22 74.89H46.21ZM30.94 65.98H44.65L44.26 63.5C41.52 45.68 39.17 32.31 37.6 15.35C36.03 32.31 34.08 45.68 31.33 63.5L30.94 65.98Z',
    tx: 143,
  },
  // S
  {
    d: 'M41.11 59.54C41.11 54.22 39.54 51.74 25.45 45.43C5.48 36.15 0 32.56 0 22.53V10.52C0 2.35 6.27001 0 29.76 0H41.12C65.01 0 71.27 2.35 71.27 10.52V31.07H43.08V11.64C43.08 9.66 42.3 8.92 37.21 8.92H35.64C30.94 8.92 30.16 9.66 30.16 11.64V23.77C30.16 29.22 31.33 31.69 45.43 38.01C65.4 47.17 71.28 50.76 71.28 60.79V77.38C71.28 85.55 65.01 87.9 41.13 87.9H29.77C6.27 87.9 0.0100098 85.55 0.0100098 77.38V52.5H28.2V76.27C28.2 78.25 28.98 78.99 34.07 78.99H35.24C40.33 78.99 41.11 78.25 41.11 76.27V59.56V59.54Z',
    tx: 230,
  },
  // K
  {
    d: 'M0 0H30.15V39.36C32.11 35.27 32.5 33.54 34.46 30.32L51.69 0H79.49L54.82 40.85L80.27 86.65H48.94L33.28 54.34C32.11 51.99 30.93 48.65 30.15 45.06V86.65H0V0Z',
    tx: 310,
  },
  // E
  {
    d: 'M30.15 37.13H50.51V46.04H30.15V77.73H56.39V86.64H0V0H56.39V8.91H30.15V37.13Z',
    tx: 399,
  },
];

export default function FooterWordmark() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <>
      <style>{`
        @keyframes letterBounce {
          0%   { transform: translateY(0); }
          35%  { transform: translateY(-14px); }
          65%  { transform: translateY(-14px); }
          100% { transform: translateY(0); }
        }
        .letter-bounce {
          transform-box: fill-box;
          transform-origin: bottom center;
          animation: letterBounce 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 456 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Blaske"
        className="w-full block"
      >
        {LETTERS.map(({ d, tx }, i) => (
          // Outer g: handles SVG x-position (never animated)
          // Inner g: handles the CSS bounce (no SVG transform, so no conflict)
          <g key={i} transform={tx > 0 ? `translate(${tx} 0)` : undefined}>
            <g
              className={animated ? 'letter-bounce' : undefined}
              style={animated ? { animationDelay: `${i * 80}ms` } : undefined}
            >
              <path d={d} fill="black" />
            </g>
          </g>
        ))}
      </svg>
    </>
  );
}
