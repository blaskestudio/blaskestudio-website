'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { WorkItem, WorkCategory, CATEGORY_LABELS } from '@/lib/types';
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

// Files live at: public/work/photography/{category}/{filename}
const PHOTOS_BY_CATEGORY: Record<Exclude<PhotoCategory, 'all'>, string[]> = {
  commercial: [
    '20230429-DSCF2796.jpg','20230429-DSCF2803.jpg','20230429-DSCF2808.jpg',
    '20230429-DSCF2810.jpg','20230429-DSCF2816.jpg','20230429-DSCF2824.jpg',
    '20230710-_44A0223.jpg','20230710-_44A0269.jpg','20230710-_44A0273.jpg',
    '20230710-_44A0497.jpg','20230710-_44A0504.jpg','20230710-_44A0549.jpg',
    '20230710-_44A0583.jpg','20230710-_44A0596.jpg','20230710-_44A0792.jpg',
    '20230710-_44A0806.jpg','20230710-_44A1041.jpg','20230710-_44A1402.jpg',
    '20230710-_44A1414.jpg','20230710-_44A1546.jpg','20230710-_44A2627.jpg',
    '20230710-_44A3031.jpg','20250506-_44A8364.jpg','20250506-_44A8374.jpg',
    '20250506-_44A8422.jpg','20250506-_44A8477.jpg','20250506-_44A8493.jpg',
    '20250506-_44A8517.jpg','20250506-_44A8785.jpg','20250506-_44A9008.jpg',
    '20250506-_44A9123.jpg','20250506-_44A9205.jpg','20250904-_44A2619.jpg',
    '20250904-_44A2796.jpg','20250904-_44A2798.jpg','20250904-_44A2891.jpg',
    '20250904-_44A2992.jpg','20250904-_44A3137.jpg','20251117-_44A5165.jpg',
    '20251117-_44A5167.jpg','20251117-_44A5168.jpg','20251117-_44A5170.jpg',
    '20251117-_44A5414.jpg','20251117-_44A5427.jpg','20251117-_44A5446.jpg',
    '20251117-_44A5524.jpg','20251117-_44A5538.jpg',
  ],
  documentary: [
    '20130914-img_0752_9767242844_o.jpg','20131017-IMG_4228.jpg','20131017-IMG_4683.jpg',
    '20140416-13922312386_3026fc3219_o.jpg','20140706-IMG_0713.jpg','20141024-IMG_7682.jpg',
    '20190823-DSCF3545.jpg','20190921-DSCF3963.jpg','20191027-DSCF4585.jpg',
    '20200608-77400010.jpg','20200608-77400013.jpg','20200623-85720003.jpg',
    '20200825-22770004.jpg','20200825-22780024.jpg','20220124-28820005.jpg',
    '20220124-28820027.jpg','20220411-06660002-gigapixel-standard-scale-4_00x.jpg',
    '20220411-06660023-gigapixel-standard-scale-4_00x.jpg',
    '20220411-06660031-gigapixel-standard-scale-4_00x.jpg',
    '20220916-24070001.jpg','20220916-24070003.jpg','20220916-24080001.jpg',
    '20220916-24080011.jpg','20220930-26100015.jpg','20221021-IMG_0413.jpg',
    '20221128-06660010.jpg','20221128-06660034.jpg','20230114-000099410005.jpg',
    '20230114-000099410009.jpg','20230114-000099410016.jpg','20230114-000099410025.jpg',
    '20230223-000029090010.jpg','20230223-000029090032.jpg','20230607-000001150018.jpg',
    '20230607-000001150035.jpg','20230903-DSCF4355.jpg','20240123-DSCF6165.jpg',
    '20240123-DSCF6167.jpg','20240123-DSCF6170.jpg','20240123-DSCF6172.jpg',
    '20240610-000099340013.jpg','20240610-000099340024.jpg','20240717-DSCF8189.jpg',
    '20240719-000077020024.jpg','20240719-000077020036.jpg','20240730-000066890035.jpg',
    '20240730-000066910003.jpg','20240730-000066920016.jpg','20240907-DSCF8887.jpg',
    '20240907-DSCF8925.jpg',
  ],
  performance: [
    '20220303-33420015.jpg','20230519-DSCF3677.jpg','20230519-DSCF3681.jpg',
    '20230519-DSCF3688.jpg','20230519-DSCF3691.jpg','20230519-DSCF3698.jpg',
    '20230630-DSCF4098.jpg','20230630-DSCF4109.jpg','20230630-DSCF4118.jpg',
    '20230630-DSCF4141.jpg','20230630-DSCF4143.jpg','20230630-DSCF4156-Edit.jpg',
    '20230903-DSCF4422-Enhanced-NR.jpg','20230912-DSCF4730.jpg','20230912-DSCF4738.jpg',
    '20230912-DSCF4740.jpg','20240719-000077000018.jpg','20250215-_44A7138.jpg',
    '20250215-_44A7155.jpg','20250215-_44A7169.jpg','20250215-_44A7218.jpg',
    '20250215-_44A7300.jpg','20250215-_44A7326.jpg','20250215-_44A7472.jpg',
    '20250215-_44A7592.jpg','20250215-_44A7730.jpg','20260319-_44A6558.jpg',
    '20260319-_44A6635.jpg','20260319-_44A6664.jpg','20260319-_44A6756.jpg',
    '20260319-_44A6765.jpg','20260319-_44A6790.jpg','20260319-_44A6883.jpg',
    '20260319-_44A6905.jpg','20260319-_44A6936.jpg','20260319-_44A7019.jpg',
    '20260319-_44A7077.jpg','20260319-_44A7080.jpg','20260319-_44A7120.jpg',
    '20260319-_44A7170.jpg','20260319-_44A7269.jpg','20260319-_44A7373.jpg',
    '20260319-_44A7465.jpg','20260319-_44A7468.jpg',
  ],
  headshots: [
    '20250312-_44A8017.jpg','20250312-_44A8097.jpg','20250515-_44A9700.jpg',
    '20250515-_44A9746.jpg','20250515-_44A9749.jpg','20250515-_44A9801.jpg',
    '20250515-_44A9829.jpg','20250515-_44A9867.jpg','20250515-_44A9899.jpg',
    '20250515-_44A9929.jpg','20250515-_44A9961.jpg','20250717-_44A0287.jpg',
    '20260213-Ricky_Headshots_02_13_26-029.jpg','20260213-Ricky_Headshots_02_13_26-054.jpg',
    '20260213-Ricky_Headshots_02_13_26-174.jpg','20260213-Ricky_Headshots_02_13_26-348.jpg',
    '20260213-Ricky_Headshots_02_13_26-391.jpg',
  ],
  portraiture: [
    '20230307-DSCF2056.jpg','20230307-DSCF2062-Edit.jpg','20230307-DSCF2067.jpg',
    '20230307-DSCF2068.jpg','20230307-DSCF2071.jpg','20230307-DSCF2076.jpg',
    '20230307-DSCF2098-Edit.jpg','20230307-DSCF2111.jpg','20230307-DSCF2132.jpg',
    '20230307-DSCF2150.jpg','20230307-DSCF2177.jpg','20230307-DSCF2194.jpg',
    '20230307-DSCF2198.jpg','20230307-DSCF2221.jpg','20230307-DSCF2261.jpg',
    '20230307-DSCF2291.jpg','20230907-DSCF4585.jpg','20240730-000066890025.jpg',
    '20240730-000066900004.jpg','20240730-000066900006.jpg','20240730-000066900007.jpg',
    '20240822-000047240029.jpg','20241216-_44A6379.jpg','20241216-_44A6381.jpg',
    '20241216-_44A6385.jpg','20241216-_44A6406.jpg','20250204-_44A6488.jpg',
    '20250204-_44A6499.jpg','20250204-_44A6584.jpg','20250204-_44A6604.jpg',
    '20250204-_44A6610.jpg','20250204-_44A6612.jpg','20250204-_44A6652-Edit.jpg',
    '20250204-_44A6661.jpg','20250204-_44A6664.jpg',
  ],
};

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
}

export default function WorkGrid({ items }: Props) {
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

  // Resolve photos for the active filter
  const photoEntries: { category: Exclude<PhotoCategory, 'all'>; filename: string }[] =
    activePhotoFilter === 'all'
      ? (Object.keys(PHOTOS_BY_CATEGORY) as Exclude<PhotoCategory, 'all'>[]).flatMap((cat) =>
          PHOTOS_BY_CATEGORY[cat].map((filename) => ({ category: cat, filename }))
        )
      : PHOTOS_BY_CATEGORY[activePhotoFilter].map((filename) => ({
          category: activePhotoFilter as Exclude<PhotoCategory, 'all'>,
          filename,
        }));

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
          {photoEntries.map(({ category, filename }) => (
            <div key={`${category}/${filename}`} className="break-inside-avoid mb-1">
              <Image
                src={`/work/photography/${category}/${filename}`}
                alt=""
                width={1200}
                height={800}
                className="w-full h-auto block"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
