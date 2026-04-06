import Link from 'next/link';
import NewsletterForm from '@/components/ui/NewsletterForm';
import FooterWordmark from '@/components/ui/FooterWordmark';

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/blaske.studio/',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/blaske-studio',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@blaskestudio',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
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
