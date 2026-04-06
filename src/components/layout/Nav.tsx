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
  { href: '/about', label: 'About Us' },
  { href: '/studio', label: 'Studio Space' },
  { href: 'https://blaskestudio.substack.com/', label: 'News', external: true },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [workOpen, setWorkOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const lastScrollY = useRef(0);
  const workTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const aboutTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isActive = (href: string) =>
    pathname.startsWith(href.split('?')[0]);

  const workActive = pathname.startsWith('/work');
  const aboutActive = pathname.startsWith('/about') || pathname.startsWith('/studio');

  useEffect(() => {
    setPastHero(isHome ? window.scrollY > window.innerHeight - 80 : true);
  }, [isHome]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (isHome) setPastHero(y > window.innerHeight - 80);
      if (y <= 0) setHidden(false);
      else if (y > lastScrollY.current && y > 80) { setHidden(true); setMenuOpen(false); }
      else if (y < lastScrollY.current) setHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const showWhite = isHome && !pastHero;
  const textColor = showWhite ? 'white' : 'black';

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
        backgroundColor: showWhite ? 'white' : 'black',
        color: showWhite ? 'black' : 'white',
        border: `1px solid ${showWhite ? 'white' : 'black'}`,
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
    'block px-4 py-2.5 text-[12px] tracking-[0.06em] uppercase font-semibold text-black hover:bg-neutral-50 no-underline transition-colors duration-100';

  return (
    <header
      className="relative md:fixed md:top-0 md:left-0 md:right-0 z-50 overflow-visible"
      style={{
        height: 'var(--nav-height)',
        backgroundColor: showWhite ? 'transparent' : 'white',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'background-color 300ms ease, transform 300ms cubic-bezier(0.4,0,0.2,1)',
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
              filter: showWhite ? 'invert(1)' : 'invert(0)',
              transition: 'filter 300ms ease',
            }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">

          {/* Work dropdown */}
          <div className="relative" onMouseEnter={openWork} onMouseLeave={closeWork}>
            <Link href="/work" className={linkClass} style={itemStyle(workActive, workOpen && !workActive)}>
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
            <Link href="/about" className={linkClass} style={itemStyle(aboutActive, aboutOpen && !aboutActive)}>
              About
            </Link>
            {aboutOpen && (
              <div
                className="absolute left-0 top-full pt-1 z-50"
                onMouseEnter={keepAbout}
                onMouseLeave={closeAbout}
              >
                <div className="bg-white border border-neutral-100 shadow-sm py-1 min-w-[160px]">
                  {ABOUT_LINKS.map(({ href, label, external }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setAboutOpen(false)}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={dropdownItemClass}
                    >
                      {label}
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
              <p className="text-[10px] tracking-[0.08em] uppercase font-bold text-neutral-400 mb-2">Work</p>
              <ul className="flex flex-col gap-3 pl-3">
                {WORK_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setMenuOpen(false)}
                      className="text-[13px] tracking-[0.04em] uppercase font-bold text-neutral-700 hover:text-black no-underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href="/capabilities" onClick={() => setMenuOpen(false)}
                className={`text-[13px] tracking-[0.04em] uppercase font-bold no-underline ${isActive('/capabilities') ? 'text-black' : 'text-neutral-700 hover:text-black'}`}>
                Capabilities
              </Link>
            </li>
            <li>
              <p className="text-[10px] tracking-[0.08em] uppercase font-bold text-neutral-400 mb-2">About</p>
              <ul className="flex flex-col gap-3 pl-3">
                {ABOUT_LINKS.map(({ href, label, external }) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setMenuOpen(false)}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-[13px] tracking-[0.04em] uppercase font-bold text-neutral-700 hover:text-black no-underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href="/inquire" onClick={() => setMenuOpen(false)}
                className={`text-[13px] tracking-[0.04em] uppercase font-bold no-underline ${isActive('/inquire') ? 'text-black' : 'text-neutral-700 hover:text-black'}`}>
                Inquire
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
