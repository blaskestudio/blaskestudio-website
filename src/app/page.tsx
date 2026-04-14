import HomeSlideDeck from '@/components/ui/HomeSlideDeck';
import { getFeaturedWork } from '@/lib/work';
import { clients } from '@/lib/clients';
import { getClientLogos, driveImageUrl, logoDisplayName } from '@/lib/drive';
import Image from 'next/image';

export default async function Home() {
  const [featured, driveLogos] = await Promise.all([
    getFeaturedWork(),
    getClientLogos(),
  ]);

  const allLogos = [
    ...clients.map((c) => ({ src: c.logo, alt: c.name, large: c.large, drive: false })),
    ...driveLogos.map((f) => ({ src: driveImageUrl(f.id), alt: logoDisplayName(f.name), drive: true })),
  ];
  const perRow = Math.ceil(allLogos.length / 3);

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
        {/* Single grid — every cell identical, spans full width in 3 rows */}
        <div
          className="grid gap-y-10"
          style={{ gridTemplateColumns: `repeat(${perRow}, 1fr)`, columnGap: '1.5rem' }}
        >
          {allLogos.map((logo) => (
            <div key={logo.alt} className="flex items-center justify-center h-14">
              {logo.drive ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  loading="lazy"
                />
              ) : (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={56}
                  className="max-h-full w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
