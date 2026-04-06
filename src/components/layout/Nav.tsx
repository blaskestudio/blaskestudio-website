'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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

const textColor = isHome && !introduced ? 'white' : 'black';
  const colorTransition = 'color 500ms ease, fill 500ms ease';

  const linkClass = 'text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold no-underline';

  return (
    <header
      className="relative md:fixed md:top-0 md:left-0 md:right-0 z-50 overflow-visible"
      style={{
        height: 'var(--nav-height)',
        background: 'transparent',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* White background bar */}
      <div
        className="absolute inset-0 bg-white"
        style={{
          transform: (isHome && !introduced) ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 800ms cubic-bezier(0.4,0,0.2,1)',
          zIndex: 0,
        }}
      />

      {/* Nav content */}
      <div
        className="relative h-full flex items-center justify-between"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)', zIndex: 1 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="no-underline shrink-0"
        >
          <Image
            src="/logo.webp"
            alt="Blaske Studio"
            width={120}
            height={46}
            style={{
              height: '36px',
              width: 'auto',
              display: 'block',
              filter: (isHome && !introduced) ? 'invert(1)' : 'invert(0)',
              transition: 'filter 500ms ease',
            }}
            priority
          />
        </Link>

        {/* Desktop nav */}
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
                  linkClass,
                  active ? 'underline underline-offset-[3px] decoration-[2.84px] pointer-events-none' : '',
                ].join(' ')}
                style={{
                  color: textColor,
                  transition: colorTransition,
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
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
