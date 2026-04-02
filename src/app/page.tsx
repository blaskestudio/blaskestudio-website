import Link from 'next/link';
import Image from 'next/image';
import HeroVideo from '@/components/ui/HeroVideo';
import FeaturedWork from '@/components/ui/FeaturedWork';
import { getFeaturedWork } from '@/lib/work';
import { CATEGORY_LABELS } from '@/lib/types';
import { clients } from '@/lib/clients';
import ClientLogo from '@/components/ui/ClientLogo';

export default async function Home() {
  const featured = await getFeaturedWork();

  return (
    <main className="flex flex-col">

      {/* ── 1. Hero ───────────────────────────────────────────── */}
      <section
        className="w-full relative overflow-hidden bg-black"
        style={{ height: '100vh' }}
      >
        <HeroVideo />
      </section>

      {/* ── 2. Studio statement ───────────────────────────────── */}
      <section
        className="relative py-16 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        {/* Fine vertical rule — right content edge, top of section → bottom of section */}
        <div
          className="absolute top-0 bottom-0 w-px bg-neutral-200 pointer-events-none"
          style={{ right: 'var(--page-gutter)' }}
          aria-hidden="true"
        />

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl leading-tight">
          An award-winning, full-service production company based in South Bend, Indiana.
        </h2>
      </section>

      {/* ── 3. Selected Work ──────────────────────────────────── */}
      <section className="pt-20 md:pt-28 pb-20 md:pb-28">

        {/* Sticky label row */}
        <div
          className="sticky top-0 z-40 bg-white flex items-baseline justify-between py-4"
          style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
        >
          <h2 className="text-sm tracking-[0.12em] uppercase text-black font-semibold">
            Selected Work
          </h2>
          <Link
            href="/work"
            className="flex items-center gap-2 text-sm tracking-[0.12em] uppercase text-black font-semibold no-underline hover:text-[#60A5FA] transition-colors duration-150"
          >
            View All
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ overflow: 'visible' }}>
              <line x1="0" y1="5" x2="7" y2="5" />
              <polyline points="7,0 12,5 7,10" />
            </svg>
          </Link>
        </div>

        <div
          style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
        >
          <FeaturedWork items={featured} />
        </div>
      </section>

      {/* ── 4. Selected Clients ───────────────────────────────── */}
      <section>
        <p
          className="text-sm tracking-[0.12em] uppercase text-black font-semibold py-8"
          style={{ paddingLeft: 'var(--page-gutter)' }}
        >
          Selected Clients
        </p>

        <div
          className="grid grid-cols-3 md:grid-cols-7"
          style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
        >
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-center py-10 px-4"
            >
              <ClientLogo
                src={client.logo}
                alt={client.name}
                large={client.large}
              />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
