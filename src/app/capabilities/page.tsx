import HeroScrollImage from '@/components/ui/HeroScrollImage';

export const metadata = {
  title: 'Capabilities',
  description: 'Commercial production, documentary, music video, and photography — Blaske Studio.',
};

const CAPABILITIES = [
  {
    title: 'Creative Development',
    items: [
      'Concept development',
      'Story and narrative development',
      'Script development and refinement',
    ],
  },
  {
    title: 'Pre Production',
    items: [
      'Storyboarding',
      'Casting and talent coordination',
      'Scheduling, planning, and crew coordination',
    ],
  },
  {
    title: 'Production',
    items: [
      'Commercial, branded, and documentary',
      'Production services and management',
      'Photography production',
      'Domestic and international shoots',
    ],
  },
  {
    title: 'Post Production',
    items: [
      'Story driven editorial and narrative shaping',
      'Color, sound, and finishing',
      'Select visual effects and CG collaboration',
      'Platform specific deliverables',
    ],
  },
  {
    title: 'Studio',
    items: [
      'Downtown South Bend, IN',
      'Dedicated production and creative studio',
      'Flexible shooting and interview space',
      'On site client review and collaboration',
      'High speed fiber internet',
    ],
  },
];

export default function CapabilitiesPage() {
  return (
    <main className="flex flex-col">

      {/* ── Hero image at top ────────────────────────────────────── */}
      <div
        className="pt-16 md:pt-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <HeroScrollImage src="/api/drive-image?id=1fsCEdPeTYvhev1_pQuVrkJSLsVHxVxCX" alt="Blaske Studio workspace" />
      </div>

      {/* ── Page title ──────────────────────────────────────────── */}
      <div
        className="pt-10 pb-12 md:pt-16 md:pb-32"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          End-to-end production, from concept to delivery.
        </h1>
      </div>

      {/* ── Capabilities grid ───────────────────────────────────── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 sm:gap-y-14 pb-16 md:pb-48"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        {CAPABILITIES.map(({ title, items }) => (
          <div key={title} className="flex flex-col gap-4">
            <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black leading-none">
              {title}
            </p>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <li key={item} className="text-editorial text-black">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom image ────────────────────────────────────────── */}
      <div
        className="pb-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/drive-image?id=1H2CWXOFGUkXkZrMU08nSpJRQY3UVEfZt"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

    </main>
  );
}
