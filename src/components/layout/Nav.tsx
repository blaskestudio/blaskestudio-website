'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/capabilities', label: 'Capabilities' },
  { href: 'https://blaskestudio.substack.com/', label: 'News', external: true },
  { href: '/about', label: 'About' },
  { href: '/inquire', label: 'Inquire' },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [introduced, setIntroduced] = useState(!isHome);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const lastScrollY = useRef(0);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    if (!isHome) return;
    const t = setTimeout(() => setIntroduced(true), 2500);
    return () => clearTimeout(t);
  }, [isHome]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 0) {
        setHidden(false);
      } else if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
        setMenuOpen(false);
      } else if (currentY < lastScrollY.current) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On home before introduced: text is white, floating over video
  // After introduced (or not home): text turns black
  const textColor = isHome && !introduced ? 'white' : 'black';
  const colorTransition = 'color 500ms ease, fill 500ms ease';

  return (
    <header
      className="relative md:fixed md:top-0 md:left-0 md:right-0 z-50 overflow-hidden"
      style={{
        height: 'var(--nav-height)',
        background: 'transparent',
        // Scroll hide/show — whole header
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* ── White background bar — slides in on intro only ── */}
      <div
        className="absolute inset-0 bg-white"
        style={{
          transform: (isHome && !introduced) ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 800ms cubic-bezier(0.4,0,0.2,1)',
          zIndex: 0,
        }}
      />

      {/* ── Nav content — always visible, color transitions ── */}
      <div
        className="relative h-full flex items-center justify-between"
        style={{
          paddingLeft: 'var(--page-gutter)',
          paddingRight: 'var(--page-gutter)',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center no-underline shrink-0">
          <svg
            viewBox="0 0 456 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Blaske Studio"
            style={{ height: '28px', width: 'auto', display: 'block', color: textColor, transition: colorTransition }}
          >
            <path d="M0 0H43.47C67.36 0 73.62 2.35 73.62 10.52V31.07C73.62 37.38 69.7 40.23 57.56 41.22C69.7 42.21 73.62 45.06 73.62 51.25V76.13C73.62 84.3 67.35 86.65 43.47 86.65H0V0ZM43.47 11.63C43.47 9.65 42.69 8.91 37.6 8.91H30.16V36.76H37.6C42.69 36.76 43.47 36.02 43.47 34.04V11.63ZM30.15 45.68V77.74H37.59C42.68 77.74 43.46 77 43.46 75.02V48.41C43.46 46.31 42.68 45.69 37.59 45.69H30.15V45.68Z" fill="currentColor" />
            <g transform="translate(82 0)"><path d="M0 0H30.15V77.74H52.47V86.65H0V0Z" fill="currentColor" /></g>
            <g transform="translate(143 0)"><path d="M46.21 74.89H28.98L27.02 86.65H0L18.8 0H59.92L78.72 86.65H48.57L46.22 74.89H46.21ZM30.94 65.98H44.65L44.26 63.5C41.52 45.68 39.17 32.31 37.6 15.35C36.03 32.31 34.08 45.68 31.33 63.5L30.94 65.98Z" fill="currentColor" /></g>
            <g transform="translate(230 0)"><path d="M41.11 59.54C41.11 54.22 39.54 51.74 25.45 45.43C5.48 36.15 0 32.56 0 22.53V10.52C0 2.35 6.27001 0 29.76 0H41.12C65.01 0 71.27 2.35 71.27 10.52V31.07H43.08V11.64C43.08 9.66 42.3 8.92 37.21 8.92H35.64C30.94 8.92 30.16 9.66 30.16 11.64V23.77C30.16 29.22 31.33 31.69 45.43 38.01C65.4 47.17 71.28 50.76 71.28 60.79V77.38C71.28 85.55 65.01 87.9 41.13 87.9H29.77C6.27 87.9 0.0100098 85.55 0.0100098 77.38V52.5H28.2V76.27C28.2 78.25 28.98 78.99 34.07 78.99H35.24C40.33 78.99 41.11 78.25 41.11 76.27V59.56V59.54Z" fill="currentColor" /></g>
            <g transform="translate(310 0)"><path d="M0 0H30.15V39.36C32.11 35.27 32.5 33.54 34.46 30.32L51.69 0H79.49L54.82 40.85L80.27 86.65H48.94L33.28 54.34C32.11 51.99 30.93 48.65 30.15 45.06V86.65H0V0Z" fill="currentColor" /></g>
            <g transform="translate(399 0)"><path d="M30.15 37.13H50.51V46.04H30.15V77.73H56.39V86.64H0V0H56.39V8.91H30.15V37.13Z" fill="currentColor" /></g>
          </svg>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label, external }) => {
            const active = !external && isActive(href);
            return (
              <Link
                key={href}
                href={href}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                aria-current={active ? 'page' : undefined}
                onMouseEnter={() => { if (!active) setHoveredLink(href); }}
                onMouseLeave={() => setHoveredLink(null)}
                className={[
                  'text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold no-underline',
                  active ? 'underline underline-offset-[3px] decoration-[2.84px] pointer-events-none' : '',
                ].join(' ')}
                style={{
                  color: hoveredLink === href ? '#60A5FA' : textColor,
                  transition: hoveredLink === href ? 'color 150ms ease' : 'color 500ms ease, fill 500ms ease',
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-6 h-6 p-0 bg-transparent border-0 cursor-pointer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block h-px transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
            style={{ backgroundColor: textColor, transition: `background-color 500ms ease, transform 300ms` }} />
          <span className={`block h-px transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            style={{ backgroundColor: textColor, transition: `background-color 500ms ease, opacity 300ms` }} />
          <span className={`block h-px transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
            style={{ backgroundColor: textColor, transition: `background-color 500ms ease, transform 300ms` }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden absolute top-full left-0 right-0 bg-white"
          style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)', zIndex: 1 }}
        >
          <ul className="flex flex-col py-6 gap-6">
            {NAV_LINKS.map(({ href, label, external }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className={`text-[13px] tracking-[0.04em] uppercase font-bold ${
                    !external && isActive(href) ? 'text-black' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
