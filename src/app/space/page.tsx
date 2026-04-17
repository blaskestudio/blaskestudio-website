import Image from 'next/image';
import { getDriveFilesFromFolder, getCulturePhotos } from '@/lib/drive';
import HeroScrollImage from '@/components/ui/HeroScrollImage';
import DriveGridImage from '@/components/ui/DriveGridImage';

export const metadata = {
  title: 'Our Space',
  description: 'The Blaske Studio space — 240 E Tutt Street, South Bend, Indiana.',
};

const STUDIO_FOLDER_ID = '1RXrF6SRrvI8yIKfyDDIlvuLRgPpR7qdD';

const HOW_ITEMS = [
  { label: 'Commercial Production', body: 'Brand campaigns, product films, and corporate content. Our space is configured for efficient single day and multi day shoots.' },
  { label: 'Documentary Interviews', body: 'A quiet, controlled environment for sit down interviews, profile pieces, and long form storytelling work.' },
  { label: 'Photography', body: 'Stills shoots for editorial, commercial, and portrait work. Seamless backgrounds and controlled lighting setups available.' },
  { label: 'Studio & Gear Rental', body: 'Available for hire by production companies, photographers, and creative teams. Studio and gear rentals available.', note: 'Inquire for availability and rates.' },
];

export default async function StudioPage() {
  const STATIC_EXCLUDED_IDS = new Set([
    '1CKKAiuJXJlMa_xg7d5Vv40JazoMQtnfP', // space hero
    '11RqAvVtdf0O9-rDWqhsuLuiyIAG3QZFB',  // about hero
    '19znw-8kMBJPZBU0Gs8q370hMDxoYVVwe',  // about founder photo
    '11V0o89tksAxLVydLNap6l6LQJXciNEbx',  // about bottom image (old)
    '1Q0Iybb9wArwHRbemK4XpuGSwiQtmgzhu',  // about bottom image + capabilities bottom
    '1c7MRiUvhdqSX8RD8pe-CotKR7CQwFEJ5',  // about end image
    '1fsCEdPeTYvhev1_pQuVrkJSLsVHxVxCX',  // capabilities hero
    '1D1MozEzTzVi0ShK3epgPXuMYSztP-3BF',  // inquire
    '1AaP5cMlFNtfFNMfeC_BSsGFTR2P-dxT5',  // home page
    '1OB8MJojetSSHJCJVISM_lEP5k8vIihpb',  // capabilities bottom image 1
    '1ePbGgtv4Q5NLweh7yZcJgFHoINRdGYV6',  // capabilities bottom image 2
    '1H2CWXOFGUkXkZrMU08nSpJRQY3UVEfZt',  // capabilities bottom image (current)
  ]);
  const [allStudioPhotos, culturePhotos] = await Promise.all([
    getDriveFilesFromFolder(STUDIO_FOLDER_ID),
    getCulturePhotos(),
  ]);
  const cultureIds = new Set(culturePhotos.map(f => f.id));
  const studioPhotos = allStudioPhotos.filter(
    f => !STATIC_EXCLUDED_IDS.has(f.id) && !cultureIds.has(f.id)
  );

  return (
    <main className="flex flex-col">

      {/* ── Hero image at top ────────────────────────────────────── */}
      <div
        className="pt-16 md:pt-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <HeroScrollImage src="/api/drive-image?id=1CKKAiuJXJlMa_xg7d5Vv40JazoMQtnfP" alt="Blaske Studio space" />
      </div>

      {/* ── Heading ─────────────────────────────────────────────── */}
      <section
        className="pt-10 pb-6 md:pt-16 md:pb-12"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          A space built for<br className="hidden md:block" /> serious work.
        </h1>
      </section>

      {/* ── Location ────────────────────────────────────────────── */}
      <section
        className="pt-6 pb-0 md:pt-12"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black mb-4">Location</p>
          </div>
          <div className="flex flex-col gap-4 md:w-2/3">
            <p className="text-editorial">240 E Tutt Street · South Bend, IN</p>
            <div className="flex gap-6">
              <a
                href="https://maps.google.com/?q=240+E+Tutt+Street,+South+Bend,+IN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] tracking-[0.04em] uppercase font-bold text-black underline underline-offset-4 hover:opacity-60 transition-opacity duration-150"
              >
                Google Maps
              </a>
              <a
                href="https://maps.apple.com/?address=240+E+Tutt+Street,+South+Bend,+IN+46601"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] tracking-[0.04em] uppercase font-bold text-black underline underline-offset-4 hover:opacity-60 transition-opacity duration-150"
              >
                Apple Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Space ───────────────────────────────────────────────── */}
      <section
        className="py-10 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black mb-4">Features</p>
          </div>
          <div className="flex flex-col gap-6 md:w-2/3">
            <p className="text-editorial">
              1,100 sq ft of purpose built production space designed to support the full workflow, from capture through final delivery. Everything happens under one roof for faster turnarounds and complete creative control.
            </p>
            <ul className="grid grid-cols-2 gap-4 mt-2">
              {[
                'Full grip and electric package',
                'Dedicated editing and finishing suite',
                'Client viewing space',
                'Easy load in and load out',
                'Multiple paper backdrops',
                'Lounge and meeting space',
                'Crew prep and gear storage',
              ].map((item) => (
                <li key={item} className="text-editorial">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Mid image ───────────────────────────────────────────── */}
      <div style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/drive-image?id=1z-aogTQYYgp_VioQlJ2ha4gyLCkKZ1k0"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ── How it's used ───────────────────────────────────────── */}
      <section
        className="py-10 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black mb-4">Utilization</p>
          </div>
          <div className="md:w-2/3">
            <p className="text-editorial font-semibold mb-8">Built for every kind of production.</p>
            <div className="flex flex-col divide-y divide-black">
              {HOW_ITEMS.map(({ label, body, note }) => (
                <div key={label} className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-10">
                  <span className="text-base tracking-[0.08em] uppercase font-medium text-black shrink-0 whitespace-nowrap sm:w-72 pt-0.5">{label}</span>
                  <div className="flex flex-col gap-2">
                    <p className="text-editorial">{body}</p>
                    {note && (
                      <p className="text-editorial">
                        <a
                          href="mailto:hello@blaskestudio.com?subject=Studio%20%26%20Gear%20Rental"
                          className="underline underline-offset-4 hover:opacity-60 transition-opacity duration-150"
                        >
                          Inquire
                        </a>
                        {' '}for availability and rates.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Drive photos grid at bottom ─────────────────────────── */}
      {studioPhotos.length > 0 && (
        <div
          className="pb-24"
          style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
        >
          <div className="columns-2 gap-1">
            {studioPhotos.map((f, i) => (
              <div key={f.id} className="break-inside-avoid mb-1">
                <DriveGridImage id={f.id} loading={i < 3 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}
