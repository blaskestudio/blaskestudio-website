import { getAllWork } from '@/lib/work';
import WorkGrid from '@/components/ui/WorkGrid';

export const metadata = {
  title: 'Work',
  description: 'Commercial, documentary, music video, and photography — Blaske Studio.',
};

export default async function WorkPage() {
  const work = await getAllWork();

  return (
    <main className="pt-16 md:pt-24" style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
      <WorkGrid items={work} />
    </main>
  );
}
