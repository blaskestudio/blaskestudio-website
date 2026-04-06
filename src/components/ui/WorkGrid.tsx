'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { WorkItem, WorkCategory } from '@/lib/types';
import WorkCard from './WorkCard';
import VideoLightbox from './VideoLightbox';

const VIDEO_FILTERS: { label: string; value: WorkCategory | 'all' | 'case-study' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Branded', value: 'branded' },
  { label: 'Documentary', value: 'documentary' },
  { label: 'Case Studies', value: 'case-study' },
];

const PHOTOS = [
  '20130914-img_0752.jpg',
  '20131017-IMG_4228.jpg',
  '20131017-IMG_4683.jpg',
  '20140416-13922312386.jpg',
  '20140706-IMG_0713.jpg',
  '20141024-IMG_7682.jpg',
  '20170929-DSCF8749.jpg',
  '20190823-DSCF3545.jpg',
  '20190921-DSCF3963.jpg',
  '20191027-DSCF4585.jpg',
  '20200608-77400010.jpg',
  '20200608-77400013.jpg',
  '20200623-85720003.jpg',
  '20200825-22770004.jpg',
  '20200825-22780024.jpg',
  '20220124-28820005.jpg',
  '20220124-28820027.jpg',
  '20220303-33420015.jpg',
  '20220411-06660002.jpg',
  '20220411-06660023.jpg',
  '20220411-06660031.jpg',
  '20220916-24070001.jpg',
  '20220916-24070003.jpg',
  '20220916-24080001.jpg',
  '20220916-24080011.jpg',
  '20220930-26100015.jpg',
  '20221021-IMG_0413.jpg',
  '20221128-06660010.jpg',
  '20221128-06660034.jpg',
  '20221129-30410032.jpg',
  '20230114-000099410005.jpg',
  '20230114-000099410009.jpg',
  '20230114-000099410016.jpg',
  '20230114-000099410025.jpg',
  '20230223-000029090010.jpg',
  '20230223-000029090032.jpg',
  '20230307-DSCF2056.jpg',
  '20230307-DSCF2062-Edit.jpg',
  '20230307-DSCF2067.jpg',
  '20230307-DSCF2068.jpg',
  '20230307-DSCF2071.jpg',
  '20230307-DSCF2076.jpg',
  '20230307-DSCF2098-Edit.jpg',
  '20230307-DSCF2111.jpg',
  '20230307-DSCF2132.jpg',
  '20230307-DSCF2150.jpg',
  '20230307-DSCF2177.jpg',
  '20230307-DSCF2194.jpg',
  '20230307-DSCF2198.jpg',
];

type MediaType = 'video' | 'photo';

interface Props {
  items: WorkItem[];
}

export default function WorkGrid({ items }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [activeFilter, setActiveFilter] = useState<WorkCategory | 'all' | 'case-study'>('all');
  const [lightboxItem, setLightboxItem] = useState<WorkItem | null>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'photo') setMediaType('photo');
    const cat = searchParams.get('category');
    if (cat && VIDEO_FILTERS.some(f => f.value === cat)) {
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
      {/* ── Toggle + filters row ─────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 pb-10">

        {/* Video / Photo toggle */}
        <div className="flex mr-2">
          <button
            onClick={() => setMediaType('video')}
            className={`pill${mediaType === 'video' ? ' pill-active' : ''}`}
            style={{ borderRadius: '9999px 0 0 9999px', borderRight: 'none' }}
          >
            Video
          </button>
          <button
            onClick={() => setMediaType('photo')}
            className={`pill${mediaType === 'photo' ? ' pill-active' : ''}`}
            style={{ borderRadius: '0 9999px 9999px 0' }}
          >
            Photo
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-neutral-200 mx-1" />

        {/* Video filters — only shown in video mode */}
        {mediaType === 'video' && VIDEO_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={`pill${activeFilter === value ? ' pill-active' : ''}`}
          >
            {label}
          </button>
        ))}

      </div>

      {/* ── Video grid ───────────────────────────────────── */}
      {mediaType === 'video' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 pb-24">
            {filtered.map((item) => (
              <WorkCard
                key={item.slug}
                item={item}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
          <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        </>
      )}

      {/* ── Photo grid ───────────────────────────────────── */}
      {mediaType === 'photo' && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-1 pb-24">
          {PHOTOS.map((filename) => (
            <div key={filename} className="break-inside-avoid mb-1">
              <Image
                src={`/work/photography/${filename}`}
                alt=""
                width={1200}
                height={800}
                className="w-full h-auto block"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
