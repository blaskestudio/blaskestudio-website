import HomeSlideDeck from '@/components/ui/HomeSlideDeck';
import { getFeaturedWork } from '@/lib/work';
import { clients } from '@/lib/clients';
import ClientLogo from '@/components/ui/ClientLogo';

export default async function Home() {
  const featured = await getFeaturedWork();

  return (
    <main className="flex flex-col">

      {/* ── 1+2+3. Hero + Studio statement + Featured Work — unified slide deck ── */}
      <HomeSlideDeck items={featured} />

      {/* ── 4. Selected Clients ───────────────────────────────── */}
      <section
        data-nav-theme="light"
        className="py-16 md:py-24 border-t border-neutral-100"
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
