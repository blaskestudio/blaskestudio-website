import { Suspense } from 'react';
import { notFound } from 'next/navigation';
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

type PhotoCategory = 'commercial' | 'documentary' | 'performance' | 'headshots' | 'portraiture';

const VALID_CATEGORIES = new Set<PhotoCategory>([
  'commercial', 'documentary', 'performance', 'headshots', 'portraiture',
]);

const CATEGORY_LABELS: Record<PhotoCategory, string> = {
  commercial: 'Commercial',
  documentary: 'Documentary',
  performance: 'Performance',
  headshots: 'Headshots',
  portraiture: 'Portraiture',
};

interface Props {
  params: Promise<{ category: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return [...VALID_CATEGORIES].map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const label = CATEGORY_LABELS[category as PhotoCategory];
  if (!label) return {};
  return {
    title: `Work — ${label} Photography`,
    description: `${label} photography from Blaske Studio.`,
  };
}

export default async function WorkPhotoCategoryPage({ params }: Props) {
  const { category } = await params;
  if (!VALID_CATEGORIES.has(category as PhotoCategory)) notFound();

  const [work, rawPhotos] = await Promise.all([
    getAllWork(),
    getAllPhotographyPhotos(),
  ]);
  const photosByCategory = shuffleByCategory(rawPhotos);
  return (
    <main className="pt-16 md:pt-24" style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
      <Suspense>
        <WorkGrid
          items={work}
          drivePhotosByCategory={photosByCategory}
          mediaType="photo"
          activePhotoFilter={category as PhotoCategory}
        />
      </Suspense>
    </main>
  );
}
