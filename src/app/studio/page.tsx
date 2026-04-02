export const metadata = {
  title: 'Studio',
  description: 'The Blaske Studio space — 240 E Tutt Street, South Bend, Indiana.',
};

const HOW_ITEMS = [
  { label: 'Commercial Production', body: 'Brand campaigns, product films, and corporate content. Our space is configured for efficient single-day and multi-day shoots.' },
  { label: 'Documentary Interviews', body: 'A quiet, controlled environment for sit-down interviews, profile pieces, and long-form storytelling work.' },
  { label: 'Music & Performance', body: 'Live performance capture, music video production, and EPK shoots with flexible lighting rigs and acoustics.' },
  { label: 'Photography', body: 'Stills shoots for editorial, commercial, and portrait work. Seamless backgrounds, strobes, and natural-light configurations available.' },
  { label: 'Podcast & Audio', body: 'A treated recording space for audio-first content, podcast pilots, and branded audio series.' },
  { label: 'Studio Rental', body: 'Available for hire by production companies, photographers, and creative teams. Inquire for availability and rates.' },
];

export default function StudioPage() {
  return (
    <main className="flex flex-col">

      {/* ── Heading ─────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 mb-4">240 E Tutt Street · South Bend, IN</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          A dedicated space for serious work.
        </h1>
      </section>

      {/* ── Story ───────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 border-t border-neutral-100"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 mb-4">Story</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Built from the ground up.
            </h2>
          </div>
          <div className="flex flex-col gap-5 md:w-2/3 text-base leading-relaxed text-neutral-700">
            <p>
              Blaske Studio began the way most do — out of necessity and obsession. Our founder spent years shooting on borrowed gear in rented spaces before deciding the Midwest deserved something better: a production studio built specifically for the kind of work we wanted to make.
            </p>
            <p>
              We found our home at 240 E Tutt Street in downtown South Bend — a converted industrial space with high ceilings, concrete floors, and enough room to build out a proper production suite. What followed was two years of construction, equipment investment, and a slow accumulation of the right tools for the right work.
            </p>
            <p>
              Today the studio serves as home base for Blaske projects and a resource for the broader South Bend creative community.
            </p>
          </div>
        </div>
      </section>

      {/* ── Space ───────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 border-t border-neutral-100"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 mb-12">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 mb-4">Space</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              4,000 sq ft of production infrastructure.
            </h2>
          </div>
          <div className="flex flex-col gap-5 md:w-2/3 text-base leading-relaxed text-neutral-700">
            <p>
              The studio is purpose-built for the full production workflow. Shooting, editing, color grading, and delivery all happen under one roof — which means faster turnarounds and tighter creative control from first frame to final export.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {[
                'Main shooting stage (40×30 ft)',
                'Full grip & electric package',
                'Color-calibrated edit suite',
                'DaVinci Resolve color room',
                'Treated audio recording room',
                'Client viewing lounge',
                'Green room & wardrobe',
                'Loading dock access',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="text-neutral-300 shrink-0 mt-0.5">—</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Photo grid placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-neutral-200">
          {[
            'Stage / main floor',
            'Edit suite',
            'Color room',
            'Loading / prep area',
            'Green room',
            'Exterior',
          ].map((label) => (
            <div
              key={label}
              className="bg-neutral-100 aspect-[4/3] flex items-center justify-center"
            >
              <span className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it's used ───────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 border-t border-neutral-100"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 mb-4">How it&rsquo;s used</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Built for every kind of production.
            </h2>
          </div>
          <div className="md:w-2/3">
            <div className="flex flex-col divide-y divide-neutral-100">
              {HOW_ITEMS.map(({ label, body }) => (
                <div key={label} className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-10">
                  <span className="text-[10px] tracking-[0.12em] uppercase font-semibold text-black shrink-0 sm:w-48 pt-0.5">{label}</span>
                  <p className="text-sm text-neutral-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
