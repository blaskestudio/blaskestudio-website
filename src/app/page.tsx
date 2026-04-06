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
        style={{ height: '100vh' }}
      >
        <HeroVideo />
      </section>

      {/* ── 2. Studio statement ───────────────────────────────── */}
      <section
        className="py-12 md:py-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
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
          className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase text-black font-bold py-8"
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
