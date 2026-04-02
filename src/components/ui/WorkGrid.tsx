'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WorkItem, WorkCategory } from '@/lib/types';
import WorkCard from './WorkCard';
import VideoLightbox from './VideoLightbox';

const FILTERS: { label: string; value: WorkCategory | 'all' | 'case-study' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Branded', value: 'branded' },
  { label: 'Documentary', value: 'documentary' },
  { label: 'Photography', value: 'photography' },
  { label: 'Case Studies', value: 'case-study' },
];

interface Props {
  items: WorkItem[];
}

export default function WorkGrid({ items }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<WorkCategory | 'all' | 'case-study'>('all');
  const [lightboxItem, setLightboxItem] = useState<WorkItem | null>(null);

  // Read ?category= from URL on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && FILTERS.some(f => f.value === cat)) {
      setActiveFilter(cat as WorkCategory | 'all' | 'case-study');
    }
  }, [searchParams]);

  const filtered = items.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'case-study') return item.contentType === 'case-study';
    return item.category === activeFilter;
  });

  const handleCardClick = useCallback(
    (item: WorkItem) => {
      if (item.contentType === 'case-study') {
        router.push(`/work/${item.slug}`);
      } else {
        setLightboxItem(item);
      }
    },
    [router]
  );

  return (
    <>
      {/* ── Filter pills ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 pb-10">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={`pill${activeFilter === value ? ' pill-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 pb-24">
        {filtered.map((item) => (
          <WorkCard
            key={item.slug}
            item={item}
            onClick={() => handleCardClick(item)}
          />
        ))}
      </div>

      {/* ── Lightbox ────────────────────────────────────── */}
      <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
