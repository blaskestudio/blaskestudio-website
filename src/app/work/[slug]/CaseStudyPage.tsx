'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { CaseStudy, CATEGORY_LABELS } from '@/lib/types';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

interface DriveFile { id: string; name: string; }
interface SectionDef { id: string; label: string; }
interface VideoSource { type: string; id: string; }

interface Props {
  item: CaseStudy;
  btsPhotos: DriveFile[];
  heroSrc: string;
  challengePhotos?: DriveFile[];
}

// Section label matches about/capabilities: bold uppercase, same responsive scale
const labelClass = 'text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black';

function SectionBlock({ id, label, children }: { id: string; label: string; children: React.ReactNode; noBorder?: boolean }) {
  return (
    <section id={id} className="mt-16">
      <p className={`${labelClass} mb-8`}>{label}</p>
      {children}
    </section>
  );
}

// Render inline markdown links [text](url) as <a> tags
function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) return <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-60 transition-opacity">{m[1]}</a>;
    return part;
  });
}

// Split text on double or single newlines and render as separate paragraphs
function Paragraphs({ text, className = 'text-editorial' }: { text: string; className?: string }) {
  const paras = text.split(/\n\n+|\n/).map(p => p.trim()).filter(Boolean);
  if (paras.length <= 1) return <p className={className}>{renderInline(text)}</p>;
  return (
    <div className="flex flex-col gap-5">
      {paras.map((p, i) => <p key={i} className={className}>{renderInline(p)}</p>)}
    </div>
  );
}

// Lightbox for individual highlight videos
function HighlightLightbox({ video, onClose }: { video: VideoSource | null; onClose: () => void }) {
  useEffect(() => {
    if (!video) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [video, onClose]);

  if (!video) return null;

  const src =
    video.type === 'youtube' ? `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`
    : video.type === 'vimeo'  ? `https://player.vimeo.com/video/${video.id}?autoplay=1&byline=0&title=0`
    : '';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
      style={{ backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white text-[12px] tracking-[0.08em] uppercase font-normal transition-colors duration-150 cursor-pointer"
      >
        Close ✕
      </button>
      <div
        className="relative w-full mx-6"
        style={{ maxWidth: '1100px', aspectRatio: '16/9' }}
        onClick={e => e.stopPropagation()}
      >
        {src && (
          <iframe
            src={src}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        )}
      </div>
    </div>,
    document.body
  );
}

// Play button overlay used on each thumbnail card
function PlayButton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300">
        <span className="text-white text-xl" style={{ marginLeft: '3px' }}>▶</span>
      </div>
    </div>
  );
}

// Horizontal scroll section — sticks in viewport while user scrolls sideways through videos
function HighlightScroll({ videos, onPlay, onSlideChange }: {
  videos: VideoSource[];
  onPlay: (v: VideoSource) => void;
  onSlideChange?: (index: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);
  const n = videos.length;

  useEffect(() => {
    if (n <= 1) return;
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      setTx(-progress * (n - 1) * el.offsetWidth);
      onSlideChange?.(Math.round(progress * (n - 1)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [n, onSlideChange]);

  if (n === 0) return null;

  // Single video — plain card, no scroll behaviour
  if (n === 1) {
    const v = videos[0];
    const thumb = v.type === 'youtube' ? `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg` : '';
    return (
      <button
        onClick={() => onPlay(v)}
        className="relative w-full aspect-video block overflow-hidden group cursor-pointer bg-black"
      >
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        <PlayButton />
      </button>
    );
  }

  return (
    // Outer div creates the vertical scroll space; its width is the content column width
    <div ref={scrollRef} style={{ height: `${n * 100}vh` }}>
      {/* Sticky viewport — pins in place while the outer div scrolls past */}
      <div
        style={{
          position: 'sticky',
          top: 'var(--nav-height)',
          height: `calc(100vh - var(--nav-height))`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Sliding track — translates based on scroll progress */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            transform: `translateX(${tx}px)`,
            willChange: 'transform',
          }}
        >
          {videos.map((v, i) => {
            const thumb = v.type === 'youtube' ? `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg` : '';
            return (
              <button
                key={i}
                onClick={() => onPlay(v)}
                className="relative aspect-video block overflow-hidden group cursor-pointer bg-black"
                style={{ width: '100%', flexShrink: 0 }}
              >
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <PlayButton />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyPage({ item, btsPhotos, heroSrc, challengePhotos = [] }: Props) {
  const [activeSection, setActiveSection] = useState('overview');
  const [lightboxVideo, setLightboxVideo] = useState<VideoSource | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Exclude images already displayed inline throughout the case study
  const usedIds = new Set<string>([
    ...(item.sectionImageId ? [item.sectionImageId] : []),
    ...challengePhotos.map(f => f.id),
    ...(item.slug === 'the-journey' ? [
      '1Epi15i4e2xoyQR7uG5nVVxCSxGF8A5ng',
      '1RvKChusghTWq5FH9O2HMaAwpjyMmspVg',
      '1uu7QIF21srmx6tK-TcYlVZpV3OilpSeq',
      '1ENcWCcjhLsmEHi2Df1cDPSqbi1dFE2Xt',
      '1qB7L3DT-yDSkCyENo38DK7_rVMV7cvSL',
    ] : []),
  ]);
  const filteredBts = btsPhotos.filter(f => !usedIds.has(f.id));

  const sections: SectionDef[] = ([
    { id: 'overview',     label: 'Overview' },
    (item.services?.length || (item.overview?.split(/\n|\r\n/).filter(Boolean).length ?? 0) > 1) ? { id: 'services', label: 'Services' } : null,
    item.highlightVideos?.length ? { id: 'highlights',   label: 'Highlights' }        : null,
    item.opportunity      ? { id: 'opportunity',  label: 'Opportunity' }       : null,
    item.challenge        ? { id: 'challenge',    label: 'Challenge' }         : null,
    item.approach         ? { id: 'approach',     label: 'Approach' }          : null,
    item.production       ? { id: 'production',   label: 'Production' }        : null,
    item.outcome          ? { id: 'outcome',      label: 'Outcome' }           : null,
    item.keyTakeaway      ? { id: 'key-takeaway', label: 'Key Takeaway' }      : null,
    item.deliverables?.length    ? { id: 'deliverables', label: 'Deliverables' }      : null,
    filteredBts.length    ? { id: 'bts',          label: 'Behind the Scenes' } : null,
    item.contributors?.length    ? { id: 'credits',      label: 'Credits' }            : null,
  ] as (SectionDef | null)[]).filter((s): s is SectionDef => s !== null);

  useEffect(() => {
    const ids = sections.map(s => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white">

      <Nav />

      <div style={{ paddingTop: 'var(--nav-height)' }}>

        {/* ── Sidebar — fixed, independent of content flow ── */}
        <aside className="hidden lg:block">
          <nav
            className="fixed w-[220px] flex flex-col gap-4 pt-20 pr-6 overflow-visible"
            style={{ top: 'var(--nav-height)', left: 0, paddingLeft: 'var(--page-gutter)' }}
          >
            {sections.map(({ id, label }) => {
              const active = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`relative flex items-center justify-between text-xs font-normal uppercase tracking-[0.08em] no-underline transition-colors duration-150 ${
                    active ? 'text-black' : 'text-black/40 hover:text-black/60'
                  }`}
                >
                  {active && (
                    <span
                      className="absolute h-px bg-black"
                      style={{ left: 'calc(-1 * var(--page-gutter))', width: 'var(--page-gutter)', top: '50%', transform: 'translateY(-50%)' }}
                    />
                  )}
                  {label}
                  {id === 'highlights' && item.highlightLabels?.[currentSlide] && (
                    <span className="text-black/40 font-normal normal-case tracking-normal">
                      {item.highlightLabels[currentSlide]}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* ── Content — centered in full viewport ─────────── */}
        <main
          className="mx-auto pb-32"
          style={{ maxWidth: '720px', paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
        >

          {/* Overview */}
          <section id="overview" className="pt-14">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-3">
              {item.title}
            </h1>
            <p className="text-base tracking-[0.08em] uppercase font-medium text-black mb-10">
              {item.client}{item.category ? ` · ${CATEGORY_LABELS[item.category]}` : ''}
            </p>

            {/* Hero — short thumbnail loops silently; falls back to full embed */}
            <div className="w-full aspect-video overflow-hidden mb-10">
              {item.thumbnailShortUrl ? (
                <iframe
                  src={`https://iframe.videodelivery.net/${item.thumbnailShortUrl}?autoplay=true&muted=true&loop=true&controls=false&preload=true`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  style={{ border: 'none', display: 'block' }}
                  title={item.title}
                />
              ) : heroSrc ? (
                <iframe
                  src={heroSrc}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none', display: 'block' }}
                  title={item.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 border border-black flex items-center justify-center">
                    <span className="text-black text-sm" style={{ marginLeft: '2px' }}>▶</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            {item.stats && item.stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black mb-10">
                {item.stats.map((stat) => {
                  const match = stat.match(/^([\d,+\-–\/]+(?:\s*[\d,+\-–\/]+)*)\s+(.+)$/);
                  const number = match ? match[1] : stat;
                  const label  = match ? match[2] : null;
                  return (
                    <div key={stat} className="bg-white px-5 py-6 text-center flex flex-col items-center gap-1">
                      <span className="text-3xl font-bold tracking-tight leading-none">{number}</span>
                      {label && (
                        <span className="text-editorial whitespace-pre-line text-center leading-snug">
                          {label.replace(' (', '\n(')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </section>

          {/* Services — from overview field (multi-line) or services field */}
          {(() => {
            const overviewItems = item.overview
              ? item.overview.split(/\n|\r\n/).map(s => s.trim()).filter(Boolean)
              : [];
            const isOverviewServices = overviewItems.length > 1;
            const serviceItems = isOverviewServices ? overviewItems : (item.services ?? []);
            if (!serviceItems.length) return null;
            return (
              <SectionBlock id="services" label="Services">
                <ul className="flex flex-col gap-2">
                  {serviceItems.map((s) => (
                    <li key={s} className="text-editorial flex gap-3">
                      <span className="text-black/30 select-none shrink-0">—</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            );
          })()}

          {/* Highlight videos — horizontal scroll */}
          {item.highlightVideos && item.highlightVideos.length > 0 && (
            <section id="highlights" className="mt-16">
              <HighlightScroll
                videos={item.highlightVideos as VideoSource[]}
                onPlay={setLightboxVideo}
                onSlideChange={setCurrentSlide}
              />
            </section>
          )}

          {/* Text sections */}
          {item.opportunity && (
            <SectionBlock id="opportunity" label="Opportunity">
              <Paragraphs text={item.opportunity} />
            </SectionBlock>
          )}

          {/* Optional image between Opportunity and Challenge */}
          {(item.sectionImageId || item.slug === 'the-journey') && (
            <div className="mt-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://lh3.googleusercontent.com/d/${item.sectionImageId ?? '1Epi15i4e2xoyQR7uG5nVVxCSxGF8A5ng'}=w1200`}
                alt=""
                className="w-full h-auto block"
              />
            </div>
          )}

          {item.challenge && (
            <SectionBlock id="challenge" label="Challenge">
              <Paragraphs text={item.challenge} />
            </SectionBlock>
          )}
          {challengePhotos.length > 0 && (
            <div className="mt-16 flex flex-col gap-1">
              {challengePhotos.map((f) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={f.id}
                  src={`https://lh3.googleusercontent.com/d/${f.id}=w1200`}
                  alt=""
                  className="w-full h-auto block"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {item.approach && (
            <SectionBlock id="approach" label="Approach">
              <Paragraphs text={item.approach} />
            </SectionBlock>
          )}
          {item.slug === 'the-journey' && (
            <div className="mt-16 grid grid-cols-2 gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://lh3.googleusercontent.com/d/1RvKChusghTWq5FH9O2HMaAwpjyMmspVg=w1200" alt="" className="w-full h-auto block" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://lh3.googleusercontent.com/d/1uu7QIF21srmx6tK-TcYlVZpV3OilpSeq=w1200" alt="" className="w-full h-auto block" loading="lazy" />
            </div>
          )}
          {item.production && (
            <SectionBlock id="production" label="Production">
              <Paragraphs text={item.production} />
            </SectionBlock>
          )}
          {item.slug === 'the-journey' && (
            <div className="mt-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://lh3.googleusercontent.com/d/1ENcWCcjhLsmEHi2Df1cDPSqbi1dFE2Xt=w1200" alt="" className="w-full h-auto block" loading="lazy" />
            </div>
          )}
          {item.outcome && (
            <SectionBlock id="outcome" label="Outcome">
              <Paragraphs text={item.outcome} />
            </SectionBlock>
          )}
          {item.slug === 'the-journey' && (
            <div className="mt-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://lh3.googleusercontent.com/d/1qB7L3DT-yDSkCyENo38DK7_rVMV7cvSL=w1200" alt="" className="w-full h-auto block" loading="lazy" />
            </div>
          )}
          {item.keyTakeaway && (
            <SectionBlock id="key-takeaway" label="Key Takeaway">
              <Paragraphs text={item.keyTakeaway} />
            </SectionBlock>
          )}

          {/* Deliverables */}
          {item.deliverables && item.deliverables.length > 0 && (
            <SectionBlock id="deliverables" label="Deliverables">
              <ul className="flex flex-col gap-2">
                {item.deliverables.map((d) => (
                  <li key={d} className="text-editorial flex gap-3">
                    <span className="text-black/30 select-none shrink-0">—</span>
                    {d}
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          {/* BTS photos — 3-col grid that breaks out to the right viewport edge */}
          {filteredBts.length > 0 && (
            <section id="bts" className="mt-16">
              <p className={`${labelClass} mb-8`}>Behind the Scenes</p>
              <div
                className="columns-3 gap-1"
                style={{
                  width: 'calc(100% + var(--page-gutter) + max(0px, (100vw - 720px) / 2))',
                  marginRight: 'calc(-1 * (var(--page-gutter) + max(0px, (100vw - 720px) / 2)))',
                }}
              >
                {filteredBts.map((f) => (
                  <div key={f.id} className="break-inside-avoid mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://lh3.googleusercontent.com/d/${f.id}=w1200`}
                      alt=""
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Credits */}
          {item.contributors && item.contributors.length > 0 && (
            <SectionBlock id="credits" label="Credits">
              <dl className="flex flex-col gap-2">
                {item.contributors.map((c) => (
                  <div key={`${c.role}-${c.name}`} className="flex gap-6">
                    <dt className="text-black/40 w-36 shrink-0 text-editorial">{c.role}</dt>
                    <dd className="text-black font-medium text-editorial">{c.name}</dd>
                  </div>
                ))}
              </dl>
            </SectionBlock>
          )}

          {/* CTA */}
          {item.cta && (
            <div className="mt-16">
              <Link
                href={item.cta.href}
                className="self-start inline-flex items-center gap-2 border border-black px-6 py-3 text-[16px] tracking-[0.04em] uppercase font-bold text-black bg-transparent hover:bg-black hover:text-white transition-colors duration-150 no-underline"
              >
                {item.cta.label}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M0 5H12M8 1L12 5L8 9" />
                </svg>
              </Link>
            </div>
          )}

        </main>
      </div>

      <Footer />

      <HighlightLightbox video={lightboxVideo} onClose={() => setLightboxVideo(null)} />
    </div>
  );
}
