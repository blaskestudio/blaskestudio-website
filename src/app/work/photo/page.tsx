import { Suspense } from 'react';
import { getAllWork } from '@/lib/work';
import WorkGrid from '@/components/ui/WorkGrid';
import { getAllPhotographyPhotos, PhotographyPhotosByCategory } from '@/lib/drive';

function shuffleByCategory(data: PhotographyPhotosByCategory): PhotographyPhotosByCategory {
  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  return {
    commercial: shuffle(data.commercial),
    documentary: shuffle(data.documentary),
    headshots: shuffle(data.headshots),
    performance: shuffle(data.performance),
    portraiture: shuffle(data.portraiture),
  };
}

export const revalidate = 3600;

export const metadata = {
  title: 'Work — Photography',
  description: 'Commercial, documentary, performance, and portrait photography from Blaske Studio.',
};

export default async function WorkPhotoPage() {
  const [work, rawPhotos] = await Promise.all([
    getAllWork(),
    getAllPhotographyPhotos(),
  ]);
  const photosByCategory = shuffleByCategory(rawPhotos);
  return (
    <main className="pt-16 md:pt-24" style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
      <Suspense>
        <WorkGrid items={work} drivePhotosByCategory={photosByCategory} mediaType="photo" activePhotoFilter="all" />
      </Suspense>
    </main>
  );
}
