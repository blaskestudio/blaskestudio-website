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
        className="py-16 md:py-24 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl leading-tight">
          Award-winning, full-service production company based in South Bend, Indiana.
        </h2>
        <Link
          href="/work"
          className="shrink-0 inline-flex items-center gap-2 border border-black px-6 py-3 text-[10px] tracking-[0.12em] uppercase font-semibold text-black bg-transparent hover:bg-black hover:text-white transition-colors duration-150 no-underline"
        >
          View All Work
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ overflow: 'visible' }}>
            <line x1="0" y1="5" x2="7" y2="5" />
            <polyline points="7,0 12,5 7,10" />
          </svg>
        </Link>
      </section>

      {/* ── 3. Selected Work ──────────────────────────────────── */}
      <section className="pt-20 md:pt-28 pb-20 md:pb-28">

        {/* Sticky label row */}
        <div
          className="sticky top-0 z-40 bg-white flex items-baseline py-4"
          style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
        >
          <h2 className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase text-black font-bold">
            Selected Work
          </h2>
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
