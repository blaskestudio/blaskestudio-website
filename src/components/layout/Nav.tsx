'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, CSSProperties } from 'react';
import Image from 'next/image';

const WORK_LINKS = [
  { href: '/work?type=video', label: 'Video' },
  { href: '/work?type=photo', label: 'Photo' },
];

const ABOUT_LINKS = [
  { href: '/about', label: 'Who We Are' },
  { href: '/studio', label: 'Our Space' },
  { href: '/culture', label: 'Culture' },
  { href: 'https://blaskestudio.substack.com/', label: 'News', external: true, arrow: true },
];

export default function Nav() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<'hero' | 'dark' | 'light'>('light');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [workOpen, setWorkOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  const isHome = pathname === '/';
  const isHomeRef = useRef(isHome);
  useEffect(() => { isHomeRef.current = isHome; }, [isHome]);

  const headerRef = useRef<HTMLElement>(null);
  const workTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const aboutTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Slide nav in from top on home page load
  useEffect(() => {
    if (!isHome) { setIntroReady(true); return; }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setIntroReady(true)));
    return () => cancelAnimationFrame(raf);
  }, [isHome]);

  const isActive = (href: string) =>
    pathname.startsWith(href.split('?')[0]);

  const workActive = pathname.startsWith('/work');
  const aboutActive = pathname.startsWith('/about') || pathname.startsWith('/studio') || pathname.startsWith('/culture');

  // Detect which section is behind the nav via elementsFromPoint
  const checkTheme = useRef<() => void>(() => {});

  useEffect(() => {
    const check = () => {
      const midX = window.innerWidth / 2;
      const midY = 32; // vertical midpoint of 64px nav
      const elements = document.elementsFromPoint(midX, midY);
      for (const el of elements) {
        // Skip elements that belong to the nav itself
        if (headerRef.current && (headerRef.current === el || headerRef.current.contains(el))) continue;
        const themed = (el as HTMLElement).closest?.('[data-nav-theme]') as HTMLElement | null;
        if (themed) {
          const t = themed.dataset.navTheme as 'hero' | 'dark' | 'light';
          setNavTheme(t === 'hero' || t === 'dark' || t === 'light' ? t : 'light');
          return;
        }
      }
      // On home page, once we've gone dark stay dark (never revert to light)
      setNavTheme(prev => (isHomeRef.current && prev === 'dark') ? 'dark' : 'light');
    };

    checkTheme.current = check;

    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check(); // initial state
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  // Re-check theme on every navigation so the nav updates immediately
  useEffect(() => {
    // rAF ensures the new page's DOM has painted before we sample elementsFromPoint
    const raf = requestAnimationFrame(() => checkTheme.current());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  const navDark = navTheme === 'dark';
  const navHero = navTheme === 'hero';
  const textColor = (navDark || navHero) ? 'white' : 'black';

  // Dropdown open/close with short delay so mouse can travel to panel
  const openWork  = () => { clearTimeout(workTimer.current);  setWorkOpen(true);  };
  const closeWork = () => { workTimer.current  = setTimeout(() => setWorkOpen(false),  80); };
  const keepWork  = () => { clearTimeout(workTimer.current); };
  const openAbout  = () => { clearTimeout(aboutTimer.current); setAboutOpen(true);  };
  const closeAbout = () => { aboutTimer.current = setTimeout(() => setAboutOpen(false), 80); };
  const keepAbout  = () => { clearTimeout(aboutTimer.current); };

  // Nav item style — active = filled, hover = outline, default = plain
  const itemStyle = (active: boolean, hovered: boolean): CSSProperties => {
    const base: CSSProperties = {
      display: 'inline-flex', alignItems: 'center',
      height: '36px', padding: '0 10px',
      transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
    };
    if (active) {
      return {
        ...base,
        backgroundColor: (navDark || navHero) ? 'white' : 'black',
        color: (navDark || navHero) ? 'black' : 'white',
        border: `1px solid ${(navDark || navHero) ? 'white' : 'black'}`,
        pointerEvents: 'none',
      };
    }
    if (hovered) {
      return {
        ...base,
        backgroundColor: 'transparent',
        color: textColor,
        border: `1px solid ${textColor}`,
      };
    }
    return {
      ...base,
      backgroundColor: 'transparent',
      color: textColor,
      border: '1px solid transparent',
    };
  };

  const linkClass = 'text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold no-underline';

  const dropdownItemClass =
    'block px-4 py-2.5 text-base tracking-[0.08em] uppercase font-medium text-black hover:bg-neutral-50 no-underline transition-colors duration-100';

  return (
    <header
      ref={headerRef}
      className="relative md:fixed md:top-0 md:left-0 md:right-0 z-50 overflow-visible"
      style={{
        height: 'var(--nav-height)',
        backgroundColor: navHero ? 'transparent' : navDark ? '#0a0a0a' : 'white',
        transform: introReady ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'background-color 300ms ease, transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className="relative h-full flex items-center justify-between"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        {/* Logo */}
        <Link href="/" className="no-underline shrink-0">
          <Image
            src="/logo.webp"
            alt="Blaske Studio"
            width={120}
            height={46}
            style={{
              height: '36px', width: 'auto', display: 'block',
              filter: (navDark || navHero) ? 'invert(1)' : 'invert(0)',
              transition: 'filter 300ms ease',
            }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-12 lg:gap-16">

          {/* Work dropdown */}
          <div className="relative" onMouseEnter={openWork} onMouseLeave={closeWork}>
            <Link href="/work" className={linkClass} style={itemStyle(false, workActive || workOpen)}>
              Work
            </Link>
            {workOpen && (
              <div
                className="absolute left-0 top-full pt-1 z-50"
                onMouseEnter={keepWork}
                onMouseLeave={closeWork}
              >
                <div className="bg-white border border-neutral-100 shadow-sm py-1 min-w-[148px]">
                  {WORK_LINKS.map(({ href, label }) => (
                    <Link key={href} href={href} onClick={() => setWorkOpen(false)} className={dropdownItemClass}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Capabilities */}
          <Link
            href="/capabilities"
            className={linkClass}
            onMouseEnter={() => setHoveredLink('/capabilities')}
            onMouseLeave={() => setHoveredLink(null)}
            style={itemStyle(isActive('/capabilities'), hoveredLink === '/capabilities')}
          >
            Capabilities
          </Link>

          {/* About dropdown */}
          <div className="relative" onMouseEnter={openAbout} onMouseLeave={closeAbout}>
            <Link href="/about" className={linkClass} style={itemStyle(false, aboutActive || aboutOpen)}>
              About
            </Link>
            {aboutOpen && (
              <div
                className="absolute left-0 top-full pt-1 z-50"
                onMouseEnter={keepAbout}
                onMouseLeave={closeAbout}
              >
                <div className="bg-white border border-neutral-100 shadow-sm py-1 min-w-[160px]">
                  {ABOUT_LINKS.map(({ href, label, external, arrow }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setAboutOpen(false)}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={dropdownItemClass + ' flex items-center gap-1.5'}
                    >
                      {label}
                      {arrow && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 8L8 2M4 2H8V6" />
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inquire */}
          <Link
            href="/inquire"
            className={linkClass}
            onMouseEnter={() => setHoveredLink('/inquire')}
            onMouseLeave={() => setHoveredLink(null)}
            style={itemStyle(isActive('/inquire'), hoveredLink === '/inquire')}
          >
            Inquire
          </Link>

        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-6 h-6 p-0 bg-transparent border-0 cursor-pointer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {(['rotate-45 translate-y-[7px]', '', '-rotate-45 -translate-y-[7px]'] as const).map((rotate, i) => (
            <span
              key={i}
              className={`block h-px transition-all duration-300 ${i === 0 ? `origin-center ${menuOpen ? rotate : ''}` : i === 1 ? `${menuOpen ? 'opacity-0' : ''}` : `origin-center ${menuOpen ? rotate : ''}`}`}
              style={{ backgroundColor: textColor }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-neutral-100"
          style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)', zIndex: 1 }}
        >
          <ul className="flex flex-col py-6 gap-5">
            <li>
              <p className="text-[12px] tracking-[0.08em] uppercase font-medium text-neutral-600 mb-2">Work</p>
              <ul className="flex flex-col gap-3 pl-3">
                {WORK_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setMenuOpen(false)}
                      className="text-[16px] tracking-[0.04em] uppercase font-medium text-neutral-700 hover:text-black no-underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href="/capabilities" onClick={() => setMenuOpen(false)}
                className={`text-[16px] tracking-[0.04em] uppercase font-medium no-underline ${isActive('/capabilities') ? 'text-black' : 'text-neutral-700 hover:text-black'}`}>
                Capabilities
              </Link>
            </li>
            <li>
              <p className="text-[12px] tracking-[0.08em] uppercase font-medium text-neutral-600 mb-2">About</p>
              <ul className="flex flex-col gap-3 pl-3">
                {ABOUT_LINKS.map(({ href, label, external, arrow }) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setMenuOpen(false)}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex items-center gap-1.5 text-[16px] tracking-[0.04em] uppercase font-medium text-neutral-700 hover:text-black no-underline">
                      {label}
                      {arrow && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 8L8 2M4 2H8V6" />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href="/inquire" onClick={() => setMenuOpen(false)}
                className={`text-[16px] tracking-[0.04em] uppercase font-medium no-underline ${isActive('/inquire') ? 'text-black' : 'text-neutral-700 hover:text-black'}`}>
                Inquire
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
