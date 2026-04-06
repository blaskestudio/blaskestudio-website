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
          A studio built on craft, collaboration, and cinematic vision.
        </h1>
      </section>

      {/* ── Studio ──────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 border-t border-neutral-100"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 mb-4">Studio</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Full-service, from concept to screen.
            </h2>
          </div>
          <div className="flex flex-col gap-6 md:w-2/3">
            <p className="text-base md:text-lg leading-relaxed text-neutral-700">
              Blaske Studio is an award-winning production company rooted in South Bend, Indiana. We partner with brands, broadcasters, nonprofits, and storytellers to create work that moves people — commercials, documentaries, music videos, and editorial photography.
            </p>
            <p className="text-base leading-relaxed text-neutral-700">
              What started as a one-person operation has grown into a full-service studio with a dedicated 4,000 sq ft production space in the heart of the Midwest. We believe world-class production doesn&rsquo;t require a coast — just the right team and an uncompromising commitment to craft.
            </p>
            <Link
              href="/studio"
              className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase font-semibold text-black no-underline hover:opacity-60 transition-opacity duration-150 mt-2 self-start"
            >
              See the space
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
                <line x1="0" y1="5" x2="7" y2="5" />
                <polyline points="7,0 12,5 7,10" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Placeholder hero image */}
        <div className="mt-12 w-full aspect-[16/7] bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center">
          <span className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400">Studio photo placeholder</span>
        </div>
      </section>

      {/* ── Team / Collaborators ────────────────────────────────── */}
      <section
        className="py-16 md:py-24 border-t border-neutral-100"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 mb-4">Team</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Collaborators &amp; crew.
            </h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-base leading-relaxed text-neutral-700 mb-10">
              We maintain a core team of directors, producers, and editors — and expand with trusted collaborators for every project. Our network spans cinematographers, colorists, sound designers, and motion artists across the Midwest and beyond.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200">
              {TEAM.map(({ name, role, initials }) => (
                <div key={name} className="bg-white flex flex-col gap-3 p-6">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                    <span className="text-[11px] tracking-[0.08em] font-semibold text-neutral-500">{initials}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-black">{name}</span>
                    <span className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400">{role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Clients ─────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 border-t border-neutral-100"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 mb-10">Selected Clients</p>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-px bg-neutral-100">
          {clients.map((client) => (
            <div
              key={client.name}
              className="bg-white flex items-center justify-center py-10 px-4"
            >
              <ClientLogo src={client.logo} alt={client.name} large={client.large} />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
