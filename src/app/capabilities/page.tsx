import Image from 'next/image';

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
    <main style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>

      <div className="py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          End-to-end production, from concept to delivery.
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 pb-24">
        {CAPABILITIES.map(({ title, items }) => (
          <div key={title} className="flex flex-col gap-4">
            <h2 className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black leading-none">
              {title}
            </h2>
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

      <div className="pb-8 md:pb-12">
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src="/api/drive-image?id=1fsCEdPeTYvhev1_pQuVrkJSLsVHxVxCX"
            alt="Blaske Studio workspace"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 95vw"
          />
        </div>
      </div>

    </main>
  );
}
