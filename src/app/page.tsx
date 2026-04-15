export const dynamic = 'force-dynamic';

import HomeSlideDeck from '@/components/ui/HomeSlideDeck';
import { getFeaturedWork } from '@/lib/work';
import { getClientLogos, driveImageUrl, logoDisplayName } from '@/lib/drive';

export default async function Home() {
  const [featured, driveLogos] = await Promise.all([
    getFeaturedWork(),
    getClientLogos(),
  ]);

  const removedClients = new Set(['us army', 'army', 'booking', 'booking.com', 'patrick', 'p']);

  const allLogos = driveLogos
    .filter((f) => !removedClients.has(logoDisplayName(f.name).toLowerCase()) && !removedClients.has(f.name.replace(/\.[^.]+$/, '').toLowerCase()))
    .map((f) => ({ src: driveImageUrl(f.id), alt: logoDisplayName(f.name) }));

  const desktopCols = Math.ceil(allLogos.length / 4);

  return (
    <main className="flex flex-col">

      {/* ── 1+2+3. Hero + Studio statement + Featured Work — unified slide deck ── */}
      <HomeSlideDeck items={featured} />

      {/* ── 4. Selected Clients ───────────────────────────────── */}
      <section
        data-nav-theme="light"
        className="bg-black py-16 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <p className="text-[32px] font-semibold tracking-tight text-white leading-snug mb-10">
          Selected Clients
        </p>
        <style>{`@media (min-width: 1024px) { .logos-grid { grid-template-columns: repeat(${desktopCols}, 1fr); } }`}</style>
        <div className="logos-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-0 gap-x-0">
          {allLogos.map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="flex items-center justify-center h-40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-[50%] max-w-[70%] w-auto object-contain"

                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
