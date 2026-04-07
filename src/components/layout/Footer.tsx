import Link from 'next/link';
import NewsletterForm from '@/components/ui/NewsletterForm';
import FooterWordmark from '@/components/ui/FooterWordmark';

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/blaske.studio/',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/blaske-studio',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@blaskestudio',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: 'Substack',
    href: 'https://blaskestudio.substack.com/',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
];

const labelClass =
  'text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase text-black font-bold leading-none';

// External link arrow (↗)
const ExternalArrow = () => (
  <svg
    width="10" height="10" viewBox="0 0 10 10"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M2 8L8 2M4 2H8V6" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="mt-auto shrink-0 min-h-screen flex flex-col justify-between">

      {/* Main grid — 3 cols on desktop */}
      <div
        className="py-12 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >

        {/* Col 1 — Location & Hours */}
        <div className="flex flex-col gap-5">
          <p className={labelClass}>Location &amp; Hours</p>
          <div className="flex flex-col gap-0.5 text-sm text-neutral-700 leading-relaxed">
            <span>240 E Tutt Street</span>
            <span>South Bend, IN 46601</span>
            <span className="mt-3">By appointment only</span>
          </div>
        </div>

        {/* Col 2 — Contact Us */}
        <div className="flex flex-col gap-5">
          <p className={labelClass}>Contact Us</p>
          <div className="flex flex-col gap-3 text-sm text-neutral-700">
            <a
              href="mailto:hello@blaskestudio.com"
              className="inline-flex items-center gap-1.5 hover:text-black transition-colors duration-150"
            >
              hello@blaskestudio.com
              <ExternalArrow />
            </a>
            <Link
              href="/inquire"
              className="inline-flex items-center gap-1.5 hover:text-black transition-colors duration-150 no-underline"
            >
              Inquire
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M0 4H9M6 1L9 4L6 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Col 3 — Newsletter + social */}
        <div className="flex flex-col gap-5">
          <NewsletterForm />
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 bg-black flex items-center justify-center text-white hover:bg-neutral-800 transition-colors duration-150"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* BLASKE wordmark */}
      <div style={{
        paddingLeft: 'var(--page-gutter)',
        paddingRight: 'var(--page-gutter)',
        paddingTop: 'clamp(4rem, 10vw, 8rem)',
        paddingBottom: 'var(--page-gutter)',
      }}>
        <FooterWordmark />
      </div>

    </footer>
  );
}
