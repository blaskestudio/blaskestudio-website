'use client';

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { WorkItem, WorkCategory, CATEGORY_LABELS } from '@/lib/types';
import { PhotographyPhotosByCategory } from '@/lib/drive';
import WorkCard from './WorkCard';
import VideoLightbox from './VideoLightbox';

// ── Fisher-Yates shuffle ───────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Video filters ──────────────────────────────────────────────
const VIDEO_FILTERS: { label: string; value: WorkCategory | 'all' | 'case-study'; slug: string }[] = [
  { label: 'All',          value: 'all',        slug: '' },
  { label: 'Branded',      value: 'branded',    slug: 'branded' },
  { label: 'Documentary',  value: 'documentary', slug: 'documentary' },
  { label: 'Case Studies', value: 'case-study', slug: 'case-studies' },
];

// ── Photo categories ───────────────────────────────────────────
type PhotoCategory = 'all' | 'commercial' | 'documentary' | 'performance' | 'headshots' | 'portraiture';

const PHOTO_FILTERS: { label: string; value: PhotoCategory }[] = [
  { label: 'All',         value: 'all' },
  { label: 'Commercial',  value: 'commercial' },
  { label: 'Documentary', value: 'documentary' },
  { label: 'Performance', value: 'performance' },
  { label: 'Headshots',   value: 'headshots' },
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

// ── Load More button ───────────────────────────────────────────
function LoadMore({ shown, total, onLoad }: { shown: number; total: number; onLoad: () => void }) {
  const remaining = total - shown;
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <button
        onClick={onLoad}
        className="inline-flex items-center gap-3 px-8 py-3 text-[13px] tracking-[0.08em] uppercase font-semibold text-black border border-black hover:bg-black hover:text-white transition-colors duration-150"
      >
        Load More
        <span className="text-[11px] font-normal opacity-50">
          {shown} of {total}
        </span>
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
interface Props {
  items: WorkItem[];
  drivePhotosByCategory?: PhotographyPhotosByCategory;
  mediaType: MediaType;
  activeVideoFilter?: WorkCategory | 'all' | 'case-study';
  activePhotoFilter?: PhotoCategory;
}

const PAGE_SIZE = 12;
const PHOTO_PAGE_SIZE = 18;

export default function WorkGrid({
  items,
  drivePhotosByCategory,
  mediaType,
  activeVideoFilter = 'all',
  activePhotoFilter = 'all',
}: Props) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(mediaType === 'photo' ? PHOTO_PAGE_SIZE : PAGE_SIZE);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [photoLightboxIndex, setPhotoLightboxIndex] = useState<number | null>(null);
  const [shuffledPhotoEntries, setShuffledPhotoEntries] = useState<{ src: string; key: string }[]>([]);

  const filteredVideo = (() => {
    const filtered = items.filter((item) => {
      if (activeVideoFilter === 'all') return true;
      if (activeVideoFilter === 'case-study') return item.contentType === 'case-study';
      return item.category === activeVideoFilter;
    });
    // In "all" view, case studies appear first
    if (activeVideoFilter === 'all') {
      return [
        ...filtered.filter(i => i.contentType === 'case-study'),
        ...filtered.filter(i => i.contentType !== 'case-study'),
      ];
    }
    return filtered;
  })();

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

  // Reset pagination whenever the filter or media type changes
  useEffect(() => {
    setDisplayCount(mediaType === 'photo' ? PHOTO_PAGE_SIZE : PAGE_SIZE);
  }, [activeVideoFilter, activePhotoFilter, mediaType, viewMode]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!filterOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [filterOpen]);

  // Shuffle photos on mount and when filter changes — useLayoutEffect prevents
  // a visible reorder flash (fires before browser paint, unlike useEffect)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setShuffledPhotoEntries(shuffle(photoEntries));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhotoFilter, drivePhotosByCategory]);

  // Photo lightbox keyboard navigation
  useEffect(() => {
    if (photoLightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhotoLightboxIndex(null);
      if (e.key === 'ArrowLeft') setPhotoLightboxIndex(i => (i !== null && i > 0) ? i - 1 : i);
      if (e.key === 'ArrowRight') setPhotoLightboxIndex(i => (i !== null && i < shuffledPhotoEntries.length - 1) ? i + 1 : i);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [photoLightboxIndex, shuffledPhotoEntries.length]);

  const handleCardClick = useCallback(
    (item: WorkItem) => {
      if (item.contentType === 'case-study') {
        router.push(`/work/${item.slug}`);
      } else {
        const idx = filteredVideo.indexOf(item);
        setLightboxIndex(idx >= 0 ? idx : null);
      }
    },
    [router, filteredVideo]
  );

  const handleVideoFilterClick = (value: WorkCategory | 'all' | 'case-study', slug: string) => {
    router.push(slug ? `/work/video/${slug}` : '/work/video');
  };

  const handlePhotoFilterClick = (value: PhotoCategory) => {
    router.push(value === 'all' ? '/work/photo' : `/work/photo/${value}`);
  };

  const handleMediaTypeClick = (type: MediaType) => {
    router.push(type === 'video' ? '/work/video' : '/work/photo');
  };

  const activeCategoryLabel = mediaType === 'video'
    ? (VIDEO_FILTERS.find(f => f.value === activeVideoFilter)?.label ?? 'All')
    : (PHOTO_FILTERS.find(f => f.value === activePhotoFilter)?.label ?? 'All');
  const categoryIsFiltered = mediaType === 'video' ? activeVideoFilter !== 'all' : activePhotoFilter !== 'all';

  return (
    <>
      {/* ── Controls row ─────────────────────────────────────── */}

      {/* Desktop (lg+): labeled pill groups */}
      <div className="hidden lg:flex flex-wrap items-center gap-6 py-3 mb-10">
        <div className="flex items-center gap-3">
          <span className="text-base font-medium text-black whitespace-nowrap">Medium</span>
          <div className="flex">
            <button onClick={() => handleMediaTypeClick('video')} className={`pill${mediaType === 'video' ? ' pill-active' : ''}`} style={{ borderRight: 'none' }}>Video</button>
            <button onClick={() => handleMediaTypeClick('photo')} className={`pill${mediaType === 'photo' ? ' pill-active' : ''}`}>Photo</button>
          </div>
        </div>
        {mediaType === 'video' && (
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-black whitespace-nowrap">Category</span>
            <div className="flex">
              {VIDEO_FILTERS.map(({ label, value, slug }, i) => (
                <button key={value} onClick={() => handleVideoFilterClick(value, slug)} className={`pill${activeVideoFilter === value ? ' pill-active' : ''}`} style={i < VIDEO_FILTERS.length - 1 ? { borderRight: 'none' } : undefined}>{label}</button>
              ))}
            </div>
          </div>
        )}
        {mediaType === 'photo' && (
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-black whitespace-nowrap">Category</span>
            <div className="flex flex-wrap">
              {PHOTO_FILTERS.map(({ label, value }, i) => (
                <button key={value} onClick={() => handlePhotoFilterClick(value)} className={`pill${activePhotoFilter === value ? ' pill-active' : ''}`} style={i < PHOTO_FILTERS.length - 1 ? { borderRight: 'none' } : undefined}>{label}</button>
              ))}
            </div>
          </div>
        )}
        {mediaType === 'video' && (
          <div className="flex ml-auto">
            <button onClick={() => setViewMode('grid')} aria-label="Grid view" aria-pressed={viewMode === 'grid'} className={`pill${viewMode === 'grid' ? ' pill-active' : ''}`} style={{ borderRight: 'none' }}><GridIcon /></button>
            <button onClick={() => setViewMode('index')} aria-label="Index view" aria-pressed={viewMode === 'index'} className={`pill${viewMode === 'index' ? ' pill-active' : ''}`}><IndexIcon /></button>
          </div>
        )}
      </div>

      {/* Mobile/tablet (<lg): compact toggle + category dropdown */}
      <div className="flex lg:hidden items-center gap-3 py-3 mb-8">
        <div className="flex shrink-0">
          <button onClick={() => handleMediaTypeClick('video')} className={`pill${mediaType === 'video' ? ' pill-active' : ''}`} style={{ borderRight: 'none' }}>Video</button>
          <button onClick={() => handleMediaTypeClick('photo')} className={`pill${mediaType === 'photo' ? ' pill-active' : ''}`}>Photo</button>
        </div>
        <div className="relative shrink-0" ref={filterRef}>
          <button onClick={() => setFilterOpen(v => !v)} className={`pill flex items-center gap-2${categoryIsFiltered ? ' pill-active' : ''}`}>
            <span>{categoryIsFiltered ? activeCategoryLabel : 'Category'}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: filterOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}>
              <path d="M1 1l4 4 4-4" />
            </svg>
          </button>
          {filterOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white border border-black z-20 min-w-[160px]">
              {mediaType === 'video'
                ? VIDEO_FILTERS.map(({ label, value, slug }) => (
                  <button key={value} onClick={() => { handleVideoFilterClick(value, slug); setFilterOpen(false); }} className="flex items-center justify-between w-full text-left px-4 py-2.5 text-[12px] tracking-[0.08em] uppercase font-medium hover:bg-neutral-50 transition-colors duration-100">
                    {label}
                    {activeVideoFilter === value && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 4l3 3 5-6" /></svg>}
                  </button>
                ))
                : PHOTO_FILTERS.map(({ label, value }) => (
                  <button key={value} onClick={() => { handlePhotoFilterClick(value); setFilterOpen(false); }} className="flex items-center justify-between w-full text-left px-4 py-2.5 text-[12px] tracking-[0.08em] uppercase font-medium hover:bg-neutral-50 transition-colors duration-100">
                    {label}
                    {activePhotoFilter === value && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 4l3 3 5-6" /></svg>}
                  </button>
                ))
              }
            </div>
          )}
        </div>
        {mediaType === 'video' && (
          <div className="hidden sm:flex ml-auto">
            <button onClick={() => setViewMode('grid')} aria-label="Grid view" aria-pressed={viewMode === 'grid'} className={`pill${viewMode === 'grid' ? ' pill-active' : ''}`} style={{ borderRight: 'none' }}><GridIcon /></button>
            <button onClick={() => setViewMode('index')} aria-label="Index view" aria-pressed={viewMode === 'index'} className={`pill${viewMode === 'index' ? ' pill-active' : ''}`}><IndexIcon /></button>
          </div>
        )}
      </div>

      {/* ── Video — grid view ────────────────────────────────── */}
      {mediaType === 'video' && viewMode === 'grid' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 -mx-[var(--page-gutter)] sm:mx-0">
            {filteredVideo.slice(0, displayCount).map((item) => (
              <WorkCard key={item.slug} item={item} onClick={() => handleCardClick(item)} />
            ))}
          </div>
          {filteredVideo.length > displayCount && (
            <LoadMore
              shown={displayCount}
              total={filteredVideo.length}
              onLoad={() => setDisplayCount((n) => n + PAGE_SIZE)}
            />
          )}
          {filteredVideo.length <= displayCount && <div className="pb-24" />}
          <VideoLightbox items={filteredVideo} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
        </>
      )}

      {/* ── Video — index view (show all — no videos, just text) ── */}
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
          <VideoLightbox items={filteredVideo} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
        </>
      )}

      {/* ── Photo grid ───────────────────────────────────────── */}
      {mediaType === 'photo' && (
        <>
          {shuffledPhotoEntries.length === 0 && (
            <p className="text-base text-neutral-400 py-16">No photos yet in this category.</p>
          )}

          {/* Mobile / tablet (<lg): Instagram-style square tiles */}
          <div className="lg:hidden grid grid-cols-3 gap-0.5 -mx-[var(--page-gutter)]">
            {shuffledPhotoEntries.slice(0, displayCount).map(({ src, key }, i) => (
              <button
                key={key}
                className="aspect-[4/5] overflow-hidden block w-full p-0 border-0 bg-neutral-100 cursor-pointer"
                onClick={() => setPhotoLightboxIndex(i)}
                aria-label="View photo"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" loading={i < 9 ? 'eager' : 'lazy'} />
              </button>
            ))}
          </div>

          {/* Desktop (lg+): masonry columns */}
          <div className="hidden lg:block columns-3 gap-2">
            {shuffledPhotoEntries.slice(0, displayCount).map(({ src, key }, i) => (
              <button
                key={key}
                className="break-inside-avoid block w-full p-0 border-0 bg-neutral-100 cursor-pointer mb-2"
                onClick={() => setPhotoLightboxIndex(i)}
                aria-label="View photo"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-auto block" loading={i < 9 ? 'eager' : 'lazy'} />
              </button>
            ))}
          </div>
          {shuffledPhotoEntries.length > displayCount && (
            <LoadMore
              shown={displayCount}
              total={shuffledPhotoEntries.length}
              onLoad={() => setDisplayCount((n) => n + PAGE_SIZE)}
            />
          )}
          {shuffledPhotoEntries.length > 0 && shuffledPhotoEntries.length <= displayCount && <div className="pb-24" />}

          {/* ── Photo lightbox ───────────────────────────────── */}
          {photoLightboxIndex !== null && (
            <div
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
              onClick={() => setPhotoLightboxIndex(null)}
            >
              {/* Close */}
              <button
                onClick={() => setPhotoLightboxIndex(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:text-neutral-300 transition-colors duration-150"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 2l14 14M16 2L2 16" />
                </svg>
              </button>

              {/* Counter */}
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-[12px] tracking-[0.08em] uppercase font-medium opacity-50">
                {photoLightboxIndex + 1} / {shuffledPhotoEntries.length}
              </span>

              {/* Prev arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoLightboxIndex(i => (i !== null && i > 0) ? i - 1 : i); }}
                className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white transition-opacity duration-150 ${photoLightboxIndex === 0 ? 'opacity-20 pointer-events-none' : 'opacity-70 hover:opacity-100'}`}
                aria-label="Previous photo"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M13 3l-7 7 7 7" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shuffledPhotoEntries[photoLightboxIndex].src}
                  alt=""
                  className="max-w-full max-h-[85vh] object-contain"
                />
              </div>

              {/* Next arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoLightboxIndex(i => (i !== null && i < shuffledPhotoEntries.length - 1) ? i + 1 : i); }}
                className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white transition-opacity duration-150 ${photoLightboxIndex === shuffledPhotoEntries.length - 1 ? 'opacity-20 pointer-events-none' : 'opacity-70 hover:opacity-100'}`}
                aria-label="Next photo"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 3l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
