import { getCulturePhotos, driveImageUrl } from '@/lib/drive';

export const revalidate = 3600; // re-fetch Drive folder every hour

export const metadata = {
  title: 'Culture',
  description: 'Life at Blaske Studio — behind the scenes, on set, and in the community.',
};

export default async function CulturePage() {
  const photos = await getCulturePhotos();

  return (
    <main
      className="pt-16 md:pt-24 pb-24"
      style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
    >
      {photos.length === 0 ? (
        <p className="text-base text-neutral-400 py-16">No photos yet.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
          {photos.map((photo, i) => (
            <div key={photo.id} className="break-inside-avoid mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={driveImageUrl(photo.id)}
                alt=""
                className="w-full h-auto block"
                loading={i < 6 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
