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
  const [pastHero, setPastHero] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const lastScrollY = useRef(0);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    // Sync immediately on route change
    if (isHome) {
      setPastHero(window.scrollY > window.innerHeight - 80);
    } else {
      setPastHero(true);
    }
  }, [isHome]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Track hero boundary on home page
      if (isHome) {
        setPastHero(currentY > window.innerHeight - 80);
      }

      // Hide/show on scroll direction
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
  }, [isHome]);

  // White style only on home page while the hero is in view
  const showWhite = isHome && !pastHero;

  const textColor = showWhite ? 'white' : 'black';

  const linkClass = 'text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold no-underline';

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
      {/* Nav content */}
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
              height: '36px',
              width: 'auto',
              display: 'block',
              filter: showWhite ? 'invert(1)' : 'invert(0)',
              transition: 'filter 300ms ease',
            }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label, external }) => {
            const active = !external && isActive(href);
            const hovered = hoveredLink === href;

            return (
              <Link
                key={href}
                href={href}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                aria-current={active ? 'page' : undefined}
                onMouseEnter={() => { if (!active) setHoveredLink(href); }}
                onMouseLeave={() => setHoveredLink(null)}
                className={linkClass}
                style={
                  active
                    ? {
                        // Box outline for active link, same height as logo
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '36px',
                        padding: '0 10px',
                        border: `1px solid ${textColor}`,
                        color: textColor,
                        transition: 'color 300ms ease, border-color 300ms ease',
                        pointerEvents: 'none',
                      }
                    : {
                        // Filled box on hover for non-active
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '36px',
                        padding: '0 10px',
                        backgroundColor: hovered ? 'black' : 'transparent',
                        color: hovered ? 'white' : textColor,
                        border: hovered ? '1px solid black' : '1px solid transparent',
                        transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
                      }
                }
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
          <span
            className={`block h-px transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
            style={{ backgroundColor: textColor, transition: 'background-color 300ms ease, transform 300ms' }}
          />
          <span
            className={`block h-px transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            style={{ backgroundColor: textColor, transition: 'background-color 300ms ease, opacity 300ms' }}
          />
          <span
            className={`block h-px transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
            style={{ backgroundColor: textColor, transition: 'background-color 300ms ease, transform 300ms' }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-neutral-100"
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
