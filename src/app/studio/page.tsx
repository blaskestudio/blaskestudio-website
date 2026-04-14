import { getDriveFilesFromFolder } from '@/lib/drive';

export const metadata = {
  title: 'Studio',
  description: 'The Blaske Studio space — 240 E Tutt Street, South Bend, Indiana.',
};

const STUDIO_FOLDER_ID = '1RXrF6SRrvI8yIKfyDDIlvuLRgPpR7qdD';

const HOW_ITEMS = [
  { label: 'Commercial Production', body: 'Brand campaigns, product films, and corporate content. Our space is configured for efficient single day and multi day shoots.' },
  { label: 'Documentary Interviews', body: 'A quiet, controlled environment for sit down interviews, profile pieces, and long form storytelling work.' },
  { label: 'Photography', body: 'Stills shoots for editorial, commercial, and portrait work. Seamless backgrounds and controlled lighting setups available.' },
  { label: 'Studio & Gear Rental', body: 'Available for hire by production companies, photographers, and creative teams. Studio and gear rentals available. Inquire for availability and rates.' },
];

export default async function StudioPage() {
  const studioPhotos = await getDriveFilesFromFolder(STUDIO_FOLDER_ID);

  return (
    <main className="flex flex-col">

      {/* ── Hero images ─────────────────────────────────────────── */}
      {studioPhotos.length > 0 && (
        <div className={`w-full grid gap-px bg-neutral-200 ${studioPhotos.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {studioPhotos.map((f) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={f.id}
              src={`https://lh3.googleusercontent.com/d/${f.id}=w2000`}
              alt=""
              className="w-full h-auto block"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* ── Heading ─────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <p className="text-base tracking-[0.08em] uppercase font-medium text-neutral-600 mb-4">240 E Tutt Street · South Bend, IN</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          A space built for serious work.
        </h1>
      </section>

      {/* ── Space ───────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 border-t border-neutral-100"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-base tracking-[0.08em] uppercase font-medium text-neutral-600 mb-4">Space</p>
          </div>
          <div className="flex flex-col gap-6 md:w-2/3">
            <p className="text-editorial">
              1,100 sq ft of purpose built production space designed to support the full workflow, from capture through final delivery. Everything happens under one roof for faster turnarounds and complete creative control.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {[
                'Full grip and electric package',
                'Dedicated editing and finishing suite',
                'Client viewing space',
                'Easy load in and load out',
                'Multiple paper backdrops',
                'Lounge and meeting space',
                'Crew prep and gear storage',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-editorial">
                  <span className="text-neutral-400 shrink-0 mt-0.5">—</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it's used ───────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 border-t border-neutral-100"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-base tracking-[0.08em] uppercase font-medium text-neutral-600 mb-4">How it&rsquo;s used</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Built for every kind of production.
            </h2>
          </div>
          <div className="md:w-2/3">
            <div className="flex flex-col divide-y divide-neutral-100">
              {HOW_ITEMS.map(({ label, body }) => (
                <div key={label} className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-10">
                  <span className="text-[12px] tracking-[0.08em] uppercase font-normal text-black shrink-0 sm:w-48 pt-0.5">{label}</span>
                  <p className="text-editorial">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
