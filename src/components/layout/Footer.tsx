import Link from 'next/link';
import NewsletterForm from '@/components/ui/NewsletterForm';

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
        <svg
          viewBox="0 0 456 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Blaske"
          className="w-full block"
        >
          <path d="M0 0H43.47C67.36 0 73.62 2.35 73.62 10.52V31.07C73.62 37.38 69.7 40.23 57.56 41.22C69.7 42.21 73.62 45.06 73.62 51.25V76.13C73.62 84.3 67.35 86.65 43.47 86.65H0V0ZM43.47 11.63C43.47 9.65 42.69 8.91 37.6 8.91H30.16V36.76H37.6C42.69 36.76 43.47 36.02 43.47 34.04V11.63ZM30.15 45.68V77.74H37.59C42.68 77.74 43.46 77 43.46 75.02V48.41C43.46 46.31 42.68 45.69 37.59 45.69H30.15V45.68Z" fill="black" />
          <g transform="translate(82 0)"><path d="M0 0H30.15V77.74H52.47V86.65H0V0Z" fill="black" /></g>
          <g transform="translate(143 0)"><path d="M46.21 74.89H28.98L27.02 86.65H0L18.8 0H59.92L78.72 86.65H48.57L46.22 74.89H46.21ZM30.94 65.98H44.65L44.26 63.5C41.52 45.68 39.17 32.31 37.6 15.35C36.03 32.31 34.08 45.68 31.33 63.5L30.94 65.98Z" fill="black" /></g>
          <g transform="translate(230 0)"><path d="M41.11 59.54C41.11 54.22 39.54 51.74 25.45 45.43C5.48 36.15 0 32.56 0 22.53V10.52C0 2.35 6.27001 0 29.76 0H41.12C65.01 0 71.27 2.35 71.27 10.52V31.07H43.08V11.64C43.08 9.66 42.3 8.92 37.21 8.92H35.64C30.94 8.92 30.16 9.66 30.16 11.64V23.77C30.16 29.22 31.33 31.69 45.43 38.01C65.4 47.17 71.28 50.76 71.28 60.79V77.38C71.28 85.55 65.01 87.9 41.13 87.9H29.77C6.27 87.9 0.0100098 85.55 0.0100098 77.38V52.5H28.2V76.27C28.2 78.25 28.98 78.99 34.07 78.99H35.24C40.33 78.99 41.11 78.25 41.11 76.27V59.56V59.54Z" fill="black" /></g>
          <g transform="translate(310 0)"><path d="M0 0H30.15V39.36C32.11 35.27 32.5 33.54 34.46 30.32L51.69 0H79.49L54.82 40.85L80.27 86.65H48.94L33.28 54.34C32.11 51.99 30.93 48.65 30.15 45.06V86.65H0V0Z" fill="black" /></g>
          <g transform="translate(399 0)"><path d="M30.15 37.13H50.51V46.04H30.15V77.73H56.39V86.64H0V0H56.39V8.91H30.15V37.13Z" fill="black" /></g>
        </svg>
      </div>

    </footer>
  );
}
