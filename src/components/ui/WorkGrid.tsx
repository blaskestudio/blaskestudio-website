'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { WorkItem, WorkCategory, CATEGORY_LABELS } from '@/lib/types';
import { PhotographyPhotosByCategory } from '@/lib/drive';
import WorkCard from './WorkCard';
import VideoLightbox from './VideoLightbox';

// ── Video filters ──────────────────────────────────────────────
const VIDEO_FILTERS: { label: string; value: WorkCategory | 'all' | 'case-study' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Branded', value: 'branded' },
  { label: 'Documentary', value: 'documentary' },
  { label: 'Case Studies', value: 'case-study' },
];

// ── Photo categories ───────────────────────────────────────────
type PhotoCategory = 'all' | 'commercial' | 'documentary' | 'performance' | 'headshots' | 'portraiture';

const PHOTO_FILTERS: { label: string; value: PhotoCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Documentary', value: 'documentary' },
  { label: 'Performance', value: 'performance' },
  { label: 'Headshots', value: 'headshots' },
  { label: 'Portraiture', value: 'portraiture' },
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
        className="flex items-center gap-6 py-4 border-b border-black cursor-pointer transition-colors duration-100 hover:bg-neutral-50"
        onClick={() => onClick(item)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={onMouseMove}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(item); }}
      >
        <span className="flex-1 text-base text-black font-medium leading-snug">
          {item.title}
        </span>
        <span className="text-base text-black font-medium hidden sm:block shrink-0 w-96 whitespace-nowrap">
          {item.client}
        </span>
        <span className="text-base text-black font-medium hidden md:block shrink-0 w-28">
          {item.contentType === 'case-study' ? 'Case Study' : CATEGORY_LABELS[item.category as WorkCategory]}
        </span>
      </div>

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
  drivePhotosByCategory?: PhotographyPhotosByCategory;
}

export default function WorkGrid({ items, drivePhotosByCategory }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [activeVideoFilter, setActiveVideoFilter] = useState<WorkCategory | 'all' | 'case-study'>('all');
  const [activePhotoFilter, setActivePhotoFilter] = useState<PhotoCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [lightboxItem, setLightboxItem] = useState<WorkItem | null>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'photo') setMediaType('photo');
    const cat = searchParams.get('category');
    if (cat && VIDEO_FILTERS.some(f => f.value === cat)) {
      setActiveVideoFilter(cat as WorkCategory | 'all' | 'case-study');
    }
  }, [searchParams]);

  // Reset to grid view when switching to photo mode
  useEffect(() => {
    if (mediaType === 'photo') setViewMode('grid');
  }, [mediaType]);

  const filteredVideo = items.filter((item) => {
    if (activeVideoFilter === 'all') return true;
    if (activeVideoFilter === 'case-study') return item.contentType === 'case-study';
    return item.category === activeVideoFilter;
  });

  // Resolve photos for the active filter using Drive URLs.
  const photoEntries: { src: string; key: string }[] = (() => {
    if (!drivePhotosByCategory) return [];
    const cats = activePhotoFilter === 'all'
      ? (['commercial', 'documentary', 'performance', 'headshots', 'portraiture'] as Exclude<PhotoCategory, 'all'>[])
      : [activePhotoFilter as Exclude<PhotoCategory, 'all'>];

    return cats.flatMap((cat) => {
      const urls = drivePhotosByCategory[cat] ?? [];
      return urls.map((url, i) => ({ src: url, key: `${cat}-${i}` }));
    });
  })();

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
      <div className="flex flex-wrap items-center gap-6 py-3 mb-10">

        {/* Medium label + Video/Photo toggle */}
        <div className="flex items-center gap-3">
          <span className="text-base font-medium text-black whitespace-nowrap">Medium</span>
          <div className="flex">
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
        </div>

        {/* Video category filters */}
        {mediaType === 'video' && (
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-black whitespace-nowrap">Category</span>
            <div className="flex">
              {VIDEO_FILTERS.map(({ label, value }, i) => (
                <button
                  key={value}
                  onClick={() => setActiveVideoFilter(value)}
                  className={`pill${activeVideoFilter === value ? ' pill-active' : ''}`}
                  style={i < VIDEO_FILTERS.length - 1 ? { borderRight: 'none' } : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Photo category filters */}
        {mediaType === 'photo' && (
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-black whitespace-nowrap">Category</span>
            <div className="flex">
              {PHOTO_FILTERS.map(({ label, value }, i) => (
                <button
                  key={value}
                  onClick={() => setActivePhotoFilter(value)}
                  className={`pill${activePhotoFilter === value ? ' pill-active' : ''}`}
                  style={i < PHOTO_FILTERS.length - 1 ? { borderRight: 'none' } : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
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
              style={{ borderRight: 'none' }}
            >
              <GridIcon />
            </button>
            <button
              onClick={() => setViewMode('index')}
              aria-label="Index view"
              aria-pressed={viewMode === 'index'}
              className={`pill${viewMode === 'index' ? ' pill-active' : ''}`}
            >
              <IndexIcon />
            </button>
          </div>
        )}
      </div>

      {/* ── Video — grid view ────────────────────────────────── */}
      {mediaType === 'video' && viewMode === 'grid' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 pb-24">
            {filteredVideo.map((item) => (
              <WorkCard key={item.slug} item={item} onClick={() => handleCardClick(item)} />
            ))}
          </div>
          <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        </>
      )}

      {/* ── Video — index view ───────────────────────────────── */}
      {mediaType === 'video' && viewMode === 'index' && (
        <>
          <div className="flex items-center gap-6 pb-3 border-b border-black">
            <span className="flex-1 text-base text-black font-medium">Title</span>
            <span className="text-base text-black font-medium hidden sm:block shrink-0 w-96">Client</span>
            <span className="text-base text-black font-medium hidden md:block shrink-0 w-28">Type</span>
          </div>
          <div className="pb-24">
            {filteredVideo.map((item) => (
              <IndexRow key={item.slug} item={item} onClick={handleCardClick} />
            ))}
          </div>
          <VideoLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        </>
      )}

      {/* ── Photo grid ───────────────────────────────────────── */}
      {mediaType === 'photo' && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-1 pb-24">
          {photoEntries.map(({ src, key }) => (
            <div key={key} className="break-inside-avoid mb-1">
              <Image
                src={src}
                alt=""
                width={1200}
                height={800}
                className="w-full h-auto block"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized={src.startsWith('https://')}
              />
            </div>
          ))}
          {photoEntries.length === 0 && (
            <p className="text-base text-neutral-400 col-span-3 py-16">No photos yet in this category.</p>
          )}
        </div>
      )}
    </>
  );
}
