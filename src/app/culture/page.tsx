import { getCulturePhotos } from '@/lib/drive';
import CultureGallery from './CultureGallery';

export const revalidate = 3600;

export const metadata = {
  title: 'Culture',
  description: 'Life at Blaske Studio — behind the scenes, on set, and in the community.',
};

export default async function CulturePage() {
  const photos = await getCulturePhotos();

  return (
    <main className="flex flex-col">

      {/* ── Page title ──────────────────────────────────────────── */}
      <section
        className="pt-16 md:pt-24 pb-8 md:pb-12"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex items-stretch justify-between">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
            Behind the Scenes
          </h1>
          <div className="w-px bg-black" />
        </div>
      </section>

      <div
        className="pb-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
      {photos.length === 0 ? (
        <p className="text-base text-neutral-400 py-16">No photos yet.</p>
      ) : (
        <CultureGallery photos={photos} />
      )}
      </div>
    </main>
  );
}
