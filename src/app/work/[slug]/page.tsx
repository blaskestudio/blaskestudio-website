import { getWorkBySlug, getAllWorkSlugs } from '@/lib/work';
import { CATEGORY_LABELS } from '@/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDriveFilesFromFolder } from '@/lib/drive';

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
            className="text-base tracking-[0.08em] uppercase font-medium text-white/50 hover:text-white transition-colors duration-200 no-underline"
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
                <span className="text-base tracking-[0.08em] uppercase font-medium text-white/30">
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
            <span className="text-base tracking-[0.08em] uppercase font-medium text-white/40 shrink-0">
              {CATEGORY_LABELS[item.category]}{item.year ? ` — ${item.year}` : ''}
            </span>
          </div>

          {item.contributors && item.contributors.length > 0 && (
            <dl className="flex flex-wrap gap-x-10 gap-y-2">
              {item.contributors.map((c) => (
                <div key={`${c.role}-${c.name}`} className="flex gap-3 text-base">
                  <dt className="text-white/40">{c.role}</dt>
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

  const btsPhotos = item.btsPhotosFolder
    ? await getDriveFilesFromFolder(item.btsPhotosFolder)
    : [];

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
        className="pt-10 pb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-black"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.12em] uppercase font-semibold border border-black text-black px-2 py-1 w-fit">
            Case Study
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{item.title}</h1>
          <p className="text-base text-neutral-500 mt-1">{item.client}</p>
        </div>
        <div className="flex flex-col gap-1 sm:text-right shrink-0">
          <p className="text-base tracking-[0.08em] uppercase font-medium text-neutral-500">
            {CATEGORY_LABELS[item.category]}
          </p>
          {item.year > 0 && <p className="text-base text-neutral-500">{item.year}</p>}
        </div>
      </div>

      {/* Stats bar */}
      {item.stats && item.stats.length > 0 && (
        <div
          className="py-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-black border-b border-black"
        >
          {item.stats.map((stat) => (
            <div key={stat} className="bg-white flex items-center justify-center py-6 px-4 text-center">
              <p className="text-base font-semibold text-black leading-tight">{stat}</p>
            </div>
          ))}
        </div>
      )}

      {/* Editorial body */}
      <div
        className="py-16 md:py-24 flex flex-col gap-16"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        {/* Two-column sections */}
        {[
          { label: 'Overview', content: item.overview },
          { label: 'Opportunity', content: item.opportunity },
          { label: 'Challenge', content: item.challenge },
          { label: 'Approach', content: item.approach },
          { label: 'Production', content: item.production },
          { label: 'Outcome', content: item.outcome },
          { label: 'Key Takeaway', content: item.keyTakeaway },
        ].filter(s => s.content).map(({ label, content }) => (
          <div key={label} className="flex flex-col md:flex-row gap-8 md:gap-20 border-t border-neutral-100 pt-8">
            <p className="text-[11px] tracking-[0.12em] uppercase font-semibold text-neutral-400 md:w-40 shrink-0 pt-1">{label}</p>
            <p className="text-editorial flex-1">{content}</p>
          </div>
        ))}

        {/* Deliverables */}
        {item.deliverables && item.deliverables.length > 0 && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 border-t border-neutral-100 pt-8">
            <p className="text-[11px] tracking-[0.12em] uppercase font-semibold text-neutral-400 md:w-40 shrink-0 pt-1">Deliverables</p>
            <ul className="flex flex-col gap-2 flex-1">
              {item.deliverables.map((d) => (
                <li key={d} className="text-editorial flex gap-3">
                  <span className="text-neutral-300 select-none shrink-0">—</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Highlight videos */}
        {item.highlightVideos && item.highlightVideos.length > 0 && (
          <div className="flex flex-col gap-6 border-t border-neutral-100 pt-8">
            <p className="text-[11px] tracking-[0.12em] uppercase font-semibold text-neutral-400">Highlights</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
              {item.highlightVideos.map((v, i) => {
                const src = v.type === 'youtube'
                  ? `https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`
                  : v.type === 'vimeo'
                  ? `https://player.vimeo.com/video/${v.id}?byline=0&title=0`
                  : '';
                return src ? (
                  <div key={i} className="w-full aspect-video bg-neutral-100">
                    <iframe src={src} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen style={{ border: 'none' }} />
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* BTS photos */}
        {btsPhotos.length > 0 && (
          <div className="flex flex-col gap-6 border-t border-neutral-100 pt-8">
            <p className="text-[11px] tracking-[0.12em] uppercase font-semibold text-neutral-400">Behind the Scenes</p>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-1">
              {btsPhotos.map((f) => (
                <div key={f.id} className="break-inside-avoid mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://lh3.googleusercontent.com/d/${f.id}=w1200`} alt="" className="w-full h-auto block" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credits */}
        {item.contributors && item.contributors.length > 0 && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 border-t border-neutral-100 pt-8">
            <p className="text-[11px] tracking-[0.12em] uppercase font-semibold text-neutral-400 md:w-40 shrink-0 pt-1">Credits</p>
            <dl className="flex flex-col gap-2 flex-1">
              {item.contributors.map((c) => (
                <div key={`${c.role}-${c.name}`} className="flex gap-6 text-base">
                  <dt className="text-neutral-400 w-40 shrink-0">{c.role}</dt>
                  <dd className="text-black font-medium">{c.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* CTA */}
        {item.cta && (
          <div className="pt-8 border-t border-neutral-100">
            <Link
              href={item.cta.href}
              className="inline-block text-base tracking-[0.08em] uppercase font-medium text-black border-b border-black pb-0.5 no-underline"
            >
              {item.cta.label} →
            </Link>
          </div>
        )}
      </div>

    </main>
  );
}
