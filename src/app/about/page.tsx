import Link from 'next/link';
import Image from 'next/image';
import ClientLogo from '@/components/ui/ClientLogo';
import { clients } from '@/lib/clients';

export const metadata = {
  title: 'About',
  description: 'About Blaske Studio — a full-service production company based in the Midwest.',
};

const TEAM = [
  { name: 'Jonathan Blaske', role: 'Director / Founder', initials: 'JB' },
  { name: 'Placeholder Name', role: 'Director of Photography', initials: 'DP' },
  { name: 'Placeholder Name', role: 'Producer', initials: 'PR' },
  { name: 'Placeholder Name', role: 'Editor', initials: 'ED' },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col">

      {/* ── Hero heading ────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Who We Are
        </h1>
      </section>

      {/* ── Studio ──────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 "
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-base tracking-[0.08em] uppercase font-medium text-black mb-4">Studio</p>
          </div>
          <div className="flex flex-col gap-6 md:w-2/3">
            <p className="text-base md:text-lg leading-relaxed text-neutral-700">
              Blaske Studio is a creative production studio based in South Bend, Indiana.
            </p>
            <p className="text-base leading-relaxed text-neutral-700">
              Our work spans award-winning documentaries and commercial projects that have supported teams both regionally and nationally.
            </p>
            <p className="text-base leading-relaxed text-neutral-700">
              With over a decade of experience, we focus on storytelling and deliver the level of quality each project deserves.
            </p>
            <Link
              href="/studio"
              className="self-start inline-flex items-center gap-2 border border-black px-6 py-3 text-[16px] tracking-[0.04em] uppercase font-bold text-black bg-transparent hover:bg-black hover:text-white transition-colors duration-150 no-underline mt-2"
            >
              See the space
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M0 5H12M8 1L12 5L8 9" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Placeholder hero image */}
        <div className="mt-12 w-full aspect-[16/7] bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center">
          <span className="text-base tracking-[0.08em] uppercase font-medium text-neutral-600">Studio photo placeholder</span>
        </div>
      </section>

      {/* ── Team / Collaborators ────────────────────────────────── */}
      <section
        className="py-16 md:py-24 "
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-base tracking-[0.08em] uppercase font-medium text-black mb-4">Team</p>
          </div>
          <div className="md:w-2/3">
            <p className="text-base leading-relaxed text-neutral-700 mb-10">
              We maintain a core team of directors, producers, and editors — and expand with trusted collaborators for every project. Our network spans cinematographers, colorists, sound designers, and motion artists across the Midwest and beyond.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200">
              {TEAM.map(({ name, role, initials }, i) => (
                <div key={`${name}-${i}`} className="bg-white flex flex-col gap-3 p-6">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                    <span className="text-base font-medium text-neutral-600">{initials}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-base font-medium text-black">{name}</span>
                    <span className="text-base tracking-[0.08em] uppercase font-medium text-neutral-600">{role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Clients ─────────────────────────────────────────────── */}
      <section
        data-nav-theme="light"
        className="py-16 md:py-24 "
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <p className="text-base tracking-[0.08em] uppercase font-medium text-black mb-10">Selected Clients</p>
        <div className="grid grid-cols-3 md:grid-cols-7">
          {clients.map((client) => (
            <div key={client.name} className="aspect-square flex items-center justify-center">
              <ClientLogo src={client.logo} alt={client.name} large={client.large} />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
