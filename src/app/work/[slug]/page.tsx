import { getWorkBySlug, getAllWorkSlugs } from '@/lib/work';
import { CATEGORY_LABELS } from '@/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDriveFilesFromFolder } from '@/lib/drive';
import CaseStudyPage from './CaseStudyPage';

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
            href="/work/video"
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

  // ── Case study — editorial with sidebar ─────────────────────
  const heroVideo = item.heroVideo;
  const heroSrc = heroVideo && heroVideo.type !== 'local'
    ? heroVideo.type === 'vimeo'
      ? `https://player.vimeo.com/video/${heroVideo.id}?byline=0&title=0&portrait=0`
      : `https://www.youtube.com/embed/${heroVideo.id}?rel=0&modestbranding=1`
    : '';

  const btsPhotos = item.btsPhotosFolder
    ? await getDriveFilesFromFolder(item.btsPhotosFolder)
    : [];

  const challengePhotos = slug === 'the-journey'
    ? [{ id: '1pksmxpjsCj9hm8W4SXsKoJk4glppyYfk', name: 'challenge' }]
    : [];

  return <CaseStudyPage item={item} btsPhotos={btsPhotos} heroSrc={heroSrc} challengePhotos={challengePhotos} />;
}
