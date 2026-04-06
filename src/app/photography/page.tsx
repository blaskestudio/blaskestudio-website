import Image from 'next/image';

// All photography images — filenames match /public/work/photography/
const PHOTOS = [
  '20130914-img_0752.jpg',
  '20131017-IMG_4228.jpg',
  '20131017-IMG_4683.jpg',
  '20140416-13922312386.jpg',
  '20140706-IMG_0713.jpg',
  '20141024-IMG_7682.jpg',
  '20170929-DSCF8749.jpg',
  '20190823-DSCF3545.jpg',
  '20190921-DSCF3963.jpg',
  '20191027-DSCF4585.jpg',
  '20200608-77400010.jpg',
  '20200608-77400013.jpg',
  '20200623-85720003.jpg',
  '20200825-22770004.jpg',
  '20200825-22780024.jpg',
  '20220124-28820005.jpg',
  '20220124-28820027.jpg',
  '20220303-33420015.jpg',
  '20220411-06660002.jpg',
  '20220411-06660023.jpg',
  '20220411-06660031.jpg',
  '20220916-24070001.jpg',
  '20220916-24070003.jpg',
  '20220916-24080001.jpg',
  '20220916-24080011.jpg',
  '20220930-26100015.jpg',
  '20221021-IMG_0413.jpg',
  '20221128-06660010.jpg',
  '20221128-06660034.jpg',
  '20221129-30410032.jpg',
  '20230114-000099410005.jpg',
  '20230114-000099410009.jpg',
  '20230114-000099410016.jpg',
  '20230114-000099410025.jpg',
  '20230223-000029090010.jpg',
  '20230223-000029090032.jpg',
  '20230307-DSCF2056.jpg',
  '20230307-DSCF2062-Edit.jpg',
  '20230307-DSCF2067.jpg',
  '20230307-DSCF2068.jpg',
  '20230307-DSCF2071.jpg',
  '20230307-DSCF2076.jpg',
  '20230307-DSCF2098-Edit.jpg',
  '20230307-DSCF2111.jpg',
  '20230307-DSCF2132.jpg',
  '20230307-DSCF2150.jpg',
  '20230307-DSCF2177.jpg',
  '20230307-DSCF2194.jpg',
  '20230307-DSCF2198.jpg',
];

export const metadata = { title: 'Photography — Blaske Studio' };

export default function PhotographyPage() {
  return (
    <main className="pt-16 md:pt-24">

      {/* ── Header ────────────────────────────────────────────── */}
      <div
        className="py-12 md:py-16"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-xl">
          Photography
        </h1>
      </div>

      {/* ── Masonry grid ──────────────────────────────────────── */}
      <div
        className="columns-1 sm:columns-2 lg:columns-3 gap-1"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        {PHOTOS.map((filename) => (
          <div key={filename} className="break-inside-avoid mb-1">
            <Image
              src={`/work/photography/${filename}`}
              alt=""
              width={1200}
              height={800}
              className="w-full h-auto block"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      <div className="pb-24" />
    </main>
  );
}
