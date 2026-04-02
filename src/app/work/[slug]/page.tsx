import { getWorkBySlug, getAllWorkSlugs } from '@/lib/work';
import { CATEGORY_LABELS } from '@/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getWorkBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: `${item.client}${item.year ? ` — ${item.year}` : ''}`,
  };
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const item = await getWorkBySlug(slug);
  if (!item) notFound();

  // ── Standard project — dark, immersive ──────────────────────
  if (item.contentType === 'project') {
    const video = item.video;
    const embedSrc = video && video.type !== 'local'
      ? video.type === 'vimeo'
        ? `https://player.vimeo.com/video/${video.id}?autoplay=1&byline=0&title=0&portrait=0&color=ffffff`
        : `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`
      : '';

    return (
      <div className="min-h-screen bg-black text-white flex flex-col">

        {/* Back button */}
        <div className="fixed top-6 z-50" style={{ left: 'var(--page-gutter)' }}>
          <Link
            href="/work"
            className="text-[11px] tracking-[0.12em] uppercase font-semibold text-white/50 hover:text-white transition-colors duration-200 no-underline"
          >
            ← Work
          </Link>
        </div>

        {/* Full-viewport video */}
        <div className="w-full h-screen bg-black flex items-center justify-center relative">
          {embedSrc ? (
            <iframe
              src={embedSrc}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
              title={item.title}
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 select-none">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
                  <span className="text-white/40 text-xl ml-1">▶</span>
                </div>
                <span className="text-[10px] tracking-[0.12em] uppercase font-semibold text-white/30">
                  {item.client}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div
          className="py-12 flex flex-col gap-8"
          style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
        >
          <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-8">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight">{item.title}</h1>
            <span className="text-[11px] tracking-[0.12em] uppercase font-semibold text-white/40 shrink-0">
              {CATEGORY_LABELS[item.category]}{item.year ? ` — ${item.year}` : ''}
            </span>
          </div>

          {item.contributors && item.contributors.length > 0 && (
            <dl className="flex flex-wrap gap-x-10 gap-y-2">
              {item.contributors.map((c) => (
                <div key={`${c.role}-${c.name}`} className="flex gap-3 text-xs">
                  <dt className="text-white/40 tracking-wide">{c.role}</dt>
                  <dd className="text-white/80">{c.name}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

      </div>
    );
  }

  // ── Case study — editorial ───────────────────────────────────
  const heroVideo = item.heroVideo;
  const heroSrc = heroVideo && heroVideo.type !== 'local'
    ? heroVideo.type === 'vimeo'
      ? `https://player.vimeo.com/video/${heroVideo.id}?autoplay=1&byline=0&title=0&portrait=0&color=ffffff`
      : `https://www.youtube.com/embed/${heroVideo.id}?autoplay=1&rel=0&modestbranding=1`
    : '';

  return (
    <main className="flex flex-col bg-white">

      {/* Back button */}
      <div className="fixed top-6 z-50" style={{ left: 'var(--page-gutter)' }}>
        <Link
          href="/work"
          className="text-[11px] tracking-[0.12em] uppercase font-semibold text-black/40 hover:text-black transition-colors duration-200 no-underline"
        >
          ← Work
        </Link>
      </div>

      {/* Hero video */}
      <div className="w-full aspect-video relative flex items-center justify-center" style={{ background: '#111' }}>
        {heroSrc ? (
          <iframe
            src={heroSrc}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
            title={item.title}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-neutral-400 flex items-center justify-center">
              <span className="text-neutral-400 text-base ml-1">▶</span>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <div
        className="pt-10 pb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-neutral-100"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col gap-2">
          <span className="text-[9px] tracking-[0.12em] uppercase font-semibold border border-black text-black px-2 py-1 w-fit">
            Case Study
          </span>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight">{item.title}</h1>
          <p className="text-sm text-neutral-400 mt-1">{item.client}</p>
        </div>
        <div className="flex flex-col gap-1 sm:text-right shrink-0">
          <p className="text-xs tracking-[0.12em] uppercase font-semibold text-neutral-400">
            {CATEGORY_LABELS[item.category]}
          </p>
          {item.year > 0 && <p className="text-xs text-neutral-400">{item.year}</p>}
        </div>
      </div>

      {/* Editorial body */}
      <div
        className="py-16 md:py-24 flex flex-col gap-16 max-w-3xl"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        {item.overview && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm tracking-[0.12em] uppercase text-black font-semibold">Overview</h2>
            <p className="text-base md:text-lg leading-relaxed text-black">{item.overview}</p>
          </section>
        )}

        {item.challenge && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm tracking-[0.12em] uppercase text-black font-semibold">Challenge</h2>
            <p className="text-base leading-relaxed text-black">{item.challenge}</p>
          </section>
        )}

        {item.approach && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm tracking-[0.12em] uppercase text-black font-semibold">Approach</h2>
            <p className="text-base leading-relaxed text-black">{item.approach}</p>
          </section>
        )}

        {item.deliverables && item.deliverables.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm tracking-[0.12em] uppercase text-black font-semibold">Deliverables</h2>
            <ul className="flex flex-col gap-2">
              {item.deliverables.map((d) => (
                <li key={d} className="text-sm text-neutral-700 flex gap-3">
                  <span className="text-neutral-300 select-none">—</span>
                  {d}
                </li>
              ))}
            </ul>
          </section>
        )}

        {item.results && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm tracking-[0.12em] uppercase text-black font-semibold">Results</h2>
            <p className="text-base leading-relaxed text-black">{item.results}</p>
          </section>
        )}

        {item.contributors && item.contributors.length > 0 && (
          <section className="flex flex-col gap-4 pt-8 border-t border-neutral-100">
            <h2 className="text-sm tracking-[0.12em] uppercase text-black font-semibold">Credits</h2>
            <dl className="flex flex-col gap-2">
              {item.contributors.map((c) => (
                <div key={`${c.role}-${c.name}`} className="flex justify-between text-sm max-w-xs">
                  <dt className="text-neutral-400">{c.role}</dt>
                  <dd className="text-black font-medium">{c.name}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {item.cta && (
          <div className="pt-8 border-t border-neutral-100">
            <Link
              href={item.cta.href}
              className="inline-block text-xs tracking-[0.12em] uppercase font-semibold text-black border-b border-black pb-0.5 no-underline"
            >
              {item.cta.label} →
            </Link>
          </div>
        )}
      </div>

    </main>
  );
}
