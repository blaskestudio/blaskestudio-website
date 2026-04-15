import { Suspense } from 'react';
import { getAllWork } from '@/lib/work';
import WorkGrid from '@/components/ui/WorkGrid';

export const metadata = {
  title: 'Work — Video',
  description: 'Branded, documentary, and music video work from Blaske Studio.',
};

export default async function WorkVideoPage() {
  const work = await getAllWork();
  return (
    <main className="pt-16 md:pt-24" style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
      <Suspense>
        <WorkGrid items={work} mediaType="video" activeVideoFilter="all" />
      </Suspense>
    </main>
  );
}
