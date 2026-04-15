import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getAllWork } from '@/lib/work';
import WorkGrid from '@/components/ui/WorkGrid';
import { WorkCategory } from '@/lib/types';

// URL slug → internal filter value
const SLUG_TO_FILTER: Record<string, WorkCategory | 'case-study'> = {
  branded: 'branded',
  documentary: 'documentary',
  'case-studies': 'case-study',
  'music-video': 'music-video',
};

const SLUG_LABELS: Record<string, string> = {
  branded: 'Branded',
  documentary: 'Documentary',
  'case-studies': 'Case Studies',
  'music-video': 'Music Videos',
};

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SLUG_TO_FILTER).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const label = SLUG_LABELS[category];
  if (!label) return {};
  return {
    title: `Work — ${label}`,
    description: `${label} video work from Blaske Studio.`,
  };
}

export default async function WorkVideoCategoryPage({ params }: Props) {
  const { category } = await params;
  const filter = SLUG_TO_FILTER[category];
  if (!filter) notFound();

  const work = await getAllWork();
  return (
    <main className="pt-16 md:pt-24" style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
      <Suspense>
        <WorkGrid items={work} mediaType="video" activeVideoFilter={filter} />
      </Suspense>
    </main>
  );
}
