'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { WorkItem, WorkCategory, CATEGORY_LABELS } from '@/lib/types';
import WorkCard from './WorkCard';
import VideoLightbox from './VideoLightbox';

const VIDEO_FILTERS: { label: string; value: WorkCategory | 'all' | 'case-study' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Branded', value: 'branded' },
  { label: 'Documentary', value: 'documentary' },
  { label: 'Case Studies', value: 'case-study' },
];

const PHOTOS = [
  '20130914-img_0752.jpg','20131017-IMG_4228.jpg','20131017-IMG_4683.jpg','20140416-13922312386.jpg',
  '20140706-IMG_0713.jpg','20141024-IMG_7682.jpg','20170929-DSCF8749.jpg','20190823-DSCF3545.jpg',
  '20190921-DSCF3963.jpg','20191027-DSCF4585.jpg','20200608-77400010.jpg','20200608-77400013.jpg',
  '20200623-85720003.jpg','20200825-22770004.jpg','20200825-22780024.jpg','20220124-28820005.jpg',
  '20220124-28820027.jpg','20220303-33420015.jpg','20220411-06660002.jpg','20220411-06660023.jpg',
  '20220411-06660031.jpg','20220916-24070001.jpg','20220916-24070003.jpg','20220916-24080001.jpg',
  '20220916-24080011.jpg','20220930-26100015.jpg','20221021-IMG_0413.jpg','20221128-06660010.jpg',
  '20221128-06660034.jpg','20221129-30410032.jpg','20230114-000099410005.jpg','20230114-000099410009.jpg',
  '20230114-000099410016.jpg','20230114-000099410025.jpg','20230223-000029090010.jpg',
  '20230223-000029090032.jpg','20230307-DSCF2056.jpg','20230307-DSCF2062-Edit.jpg',
  '20230307-DSCF2067.jpg','20230307-DSCF2068.jpg','20230307-DSCF2071.jpg','20230307-DSCF2076.jpg',
  '20230307-DSCF2098-Edit.jpg','20230307-DSCF2111.jpg','20230307-DSCF2132.jpg',
  '20230307-DSCF2150.jpg','20230307-DSCF2177.jpg','20230307-DSCF2194.jpg','20230307-DSCF2198.jpg',
];

type MediaType = 'video' | 'photo';
type ViewMode = 'grid' | 'index';

function getThumb(item: WorkItem): string {
  if (item.thumbnailStill) return item.thumbnailStill;
  const video = item.contentType === 'project' ? item.video : item.heroVideo;
  if (video.type === 'youtube' && video.id)
    return `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  return '';
}

// ── Icons ──────────────────────────────────────────────────────
const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <rect x="0" y="0" width="6" height="6" />
    <rect x="8" y="0" width="6" height="6" />
    <rect x="0" y="8" width="6" height="6" />
    <rect x="8" y="8" width="6" height="6" />
  </svg>
);

const IndexIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <rect x="0" y="1" width="14" height="2" />
    <rect x="0" y="6" width="14" height="2" />
    <rect x="0" y="11" width="14" height="2" />
  </svg>
);

// ── Index row (with cursor-following thumbnail) ────────────────
function IndexRow({
  item,
  onClick,
}: {
  item: WorkItem;
  onClick: (item: WorkItem) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);
  const thumb = getThumb(item);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!thumbRef.current) return;
    const x = Math.min(e.clientX + 28, window.innerWidth - 360);
    const y = Math.max(e.clientY - 90, 8);
    thumbRef.current.style.left = `${x}px`;
    thumbRef.current.style.top = `${y}px`;
    thumbRef.current.style.opacity = '1';
  }, []);

  return (
    <>
      <div
        className="flex items-center gap-6 py-4 border-b border-neutral-100 cursor-pointer transition-colors duration-100 hover:bg-neutral-50"
        onClick={() => onClick(item)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={onMouseMove}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(item); }}
      >
        {/* Title */}
        <span className="flex-1 text-[13px] text-neutral-400 font-normal leading-snug">
          {item.title}
        </span>

        {/* Client */}
        <span className="text-[13px] text-neutral-400 font-normal hidden sm:block shrink-0 w-64 whitespace-nowrap">
          {item.client}
        </span>

        {/* Type */}
        <span className="text-[13px] text-neutral-400 font-normal hidden md:block shrink-0 w-28">
          {item.contentType === 'case-study' ? 'Case Study' : CATEGORY_LABELS[item.category as WorkCategory]}
        </span>
      </div>

      {/* Cursor-following thumbnail */}
      {hovered && thumb && (
        <div
          ref={thumbRef}
          className="fixed pointer-events-none z-[100]"
          style={{ width: 320, opacity: 0, top: 0, left: 0, transition: 'opacity 120ms ease' }}
        >
          <Image
            src={thumb}
            alt=""
            width={320}
            height={180}
            className="w-full object-cover shadow-[0_8px_40px_rgba(0,0,0,0.18)]"
            unoptimized={thumb.includes('youtube')}
          />
        </div>
      )}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────
interface Props {
  items: WorkItem[];
}

export default function WorkGrid({ items }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [activeFilter, setActiveFilter] = useState<WorkCategory | 'all' | 'case-study'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [lightboxItem, setLightboxItem] = useState<WorkItem | null>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'photo') setMediaType('photo');
    const cat = searchParams.get('category');
    if (cat && VIDEO_FILTERS.some(f => f.value === cat)) {
      setActiveFilter(cat as WorkCategory | 'all' | 'case-study');
    }
  }, [searchParams]);

  // Reset to grid view when switching to photo mode
  useEffect(() => {
    if (mediaType === 'photo') setViewMode('grid');
  }, [mediaType]);

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
      {/* ── Controls row ─────────────────────────────────────── */}
      <div className="pills-gray flex flex-wrap items-center gap-3 pb-4 border-b border-neutral-200">

        {/* Video / Photo toggle */}
        <div className="flex mr-2">
          <button
            onClick={() => setMediaType('video')}
            className={`pill${mediaType === 'video' ? ' pill-active' : ''}`}
            style={{ borderRight: 'none' }}
          >
            Video
          </button>
          <button
            onClick={() => setMediaType('photo')}
            className={`pill${mediaType === 'photo' ? ' pill-active' : ''}`}
          >
            Photo
          </button>
        </div>

        {/* Divider — only when filters are visible */}
        {mediaType === 'video' && <div className="w-px h-4 bg-neutral-200 mx-1" />}

        {/* Video filters — joined block */}
        {mediaType === 'video' && (
          <div className="flex">
            {VIDEO_FILTERS.map(({ label, value }, i) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`pill${activeFilter === value ? ' pill-active' : ''}`}
                style={i < VIDEO_FILTERS.length - 1 ? { borderRight: 'none' } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Grid / Index view toggle — right-aligned, video only */}
        {mediaType === 'video' && (
          <div className="flex ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`pill${viewMode === 'grid' ? ' pill-active' : ''}`}
              style={{ borderRight: 'none', padding: '0.375rem 0.625rem' }}
            >
              <GridIcon />
            </button>
            <button
              onClick={() => setViewMode('index')}
              aria-label="Index view"
              aria-pressed={viewMode === 'index'}
              className={`pill${viewMode === 'index' ? ' pill-active' : ''}`}
              style={{ padding: '0.375rem 0.625rem' }}
            >
              <IndexIcon />
            </button>
          </div>
        )}
      </div>

      {/* ── Video — grid view ────────────────────────────────── */}
      {mediaType === 'video' && viewMode === 'grid' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 pt-10 pb-24">
            {filtered.map((item) => (
              <WorkCard key={item.slug} item={item} onClick={() => handleCardClick(item)} />
            ))}
          </div>
          <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        </>
      )}

      {/* ── Video — index view ───────────────────────────────── */}
      {mediaType === 'video' && viewMode === 'index' && (
        <>
          {/* Column headers */}
          <div className="flex items-center gap-6 pt-10 pb-3 border-b border-neutral-200">
            <span className="flex-1 text-[13px] text-neutral-400 font-normal">Title</span>
            <span className="text-[13px] text-neutral-400 font-normal hidden sm:block shrink-0 w-64">Client</span>
            <span className="text-[13px] text-neutral-400 font-normal hidden md:block shrink-0 w-28">Type</span>
          </div>

          <div className="pb-24">
            {filtered.map((item) => (
              <IndexRow key={item.slug} item={item} onClick={handleCardClick} />
            ))}
          </div>
          <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        </>
      )}

      {/* ── Photo grid ───────────────────────────────────────── */}
      {mediaType === 'photo' && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-1 pt-10 pb-24">
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
