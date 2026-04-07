import Link from 'next/link';
import HeroVideo from '@/components/ui/HeroVideo';
import FeaturedWork from '@/components/ui/FeaturedWork';
import { getFeaturedWork } from '@/lib/work';
import { clients } from '@/lib/clients';
import ClientLogo from '@/components/ui/ClientLogo';

export default async function Home() {
  const featured = await getFeaturedWork();

  return (
    <main className="flex flex-col">

      {/* ── 1. Hero ───────────────────────────────────────────── */}
      <section
        className="w-full relative overflow-hidden bg-black"
        style={{ height: '75vh' }}
      >
        <HeroVideo />
      </section>

      {/* ── 2. Studio statement ───────────────────────────────── */}
      <section
        className="bg-black flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
        style={{ minHeight: '25vh', paddingTop: 'clamp(1.5rem, 3vw, 3rem)', paddingBottom: 'clamp(1.5rem, 3vw, 3rem)', paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl leading-tight text-white">
          A full-service production studio in South Bend, Indiana.
        </h2>
        <Link
          href="/work"
          className="shrink-0 inline-flex items-center gap-2 border border-white px-6 py-3 text-[16px] tracking-[0.04em] uppercase font-bold text-white bg-transparent hover:bg-white hover:text-black transition-colors duration-150 no-underline"
        >
          View All Work
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M0 5H12M8 1L12 5L8 9" />
          </svg>
        </Link>
      </section>

      {/* ── 3. Featured Work — scroll-locked slide deck ───────── */}
      <FeaturedWork items={featured} />

      {/* ── 4. Selected Clients ───────────────────────────────── */}
      <section>
        <p
          className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase text-black font-bold py-12 md:py-16"
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
              className="flex items-center justify-center py-16 px-4"
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
