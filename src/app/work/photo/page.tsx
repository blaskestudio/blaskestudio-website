import { Suspense } from 'react';
import { getAllWork } from '@/lib/work';
import WorkGrid from '@/components/ui/WorkGrid';
import { getAllPhotographyPhotos } from '@/lib/drive';

export const metadata = {
  title: 'Work — Photography',
  description: 'Commercial, documentary, performance, and portrait photography from Blaske Studio.',
};

export default async function WorkPhotoPage() {
  const [work, photosByCategory] = await Promise.all([
    getAllWork(),
    getAllPhotographyPhotos(),
  ]);
  return (
    <main className="pt-16 md:pt-24" style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
      <Suspense>
        <WorkGrid items={work} drivePhotosByCategory={photosByCategory} mediaType="photo" activePhotoFilter="all" />
      </Suspense>
    </main>
  );
}
