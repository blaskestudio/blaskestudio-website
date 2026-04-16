'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CaseStudy, CATEGORY_LABELS } from '@/lib/types';
import Nav from '@/components/layout/Nav';

interface DriveFile { id: string; name: string; }
interface SectionDef { id: string; label: string; }

interface Props {
  item: CaseStudy;
  btsPhotos: DriveFile[];
  heroSrc: string;
}

// Section label matches about/capabilities: bold uppercase, same responsive scale
const labelClass = 'text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black';

function SectionBlock({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="pt-16 border-t border-black">
      <p className={`${labelClass} mb-6`}>{label}</p>
      {children}
    </section>
  );
}

export default function CaseStudyPage({ item, btsPhotos, heroSrc }: Props) {
  const [activeSection, setActiveSection] = useState('overview');

  const sections: SectionDef[] = ([
    { id: 'overview',     label: 'Overview' },
    item.opportunity      ? { id: 'opportunity',  label: 'Opportunity' }       : null,
    item.challenge        ? { id: 'challenge',    label: 'Challenge' }         : null,
    item.approach         ? { id: 'approach',     label: 'Approach' }          : null,
    item.production       ? { id: 'production',   label: 'Production' }        : null,
    item.outcome          ? { id: 'outcome',      label: 'Outcome' }           : null,
    item.keyTakeaway      ? { id: 'key-takeaway', label: 'Key Takeaway' }      : null,
    item.deliverables?.length    ? { id: 'deliverables', label: 'Deliverables' }       : null,
    item.highlightVideos?.length ? { id: 'highlights',   label: 'Highlights' }         : null,
    btsPhotos.length      ? { id: 'bts',          label: 'Behind the Scenes' } : null,
    item.contributors?.length    ? { id: 'credits',      label: 'Credits' }             : null,
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
          {/* overflow-visible so the active line can bleed left past padding */}
          <nav
            className="fixed w-[220px] flex flex-col gap-4 pt-14 pr-6 overflow-visible"
            style={{ top: 'var(--nav-height)', left: 0, paddingLeft: 'var(--page-gutter)' }}
          >
            {sections.map(({ id, label }) => {
              const active = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`relative flex items-center text-[13px] tracking-[0.08em] uppercase font-medium no-underline transition-colors duration-150 ${
                    active ? 'text-black' : 'text-black/30 hover:text-black/60'
                  }`}
                >
                  {/* Active indicator: black line from viewport left edge to text */}
                  {active && (
                    <span
                      className="absolute h-px bg-black"
                      style={{ left: 'calc(-1 * var(--page-gutter))', width: 'var(--page-gutter)', top: '50%', transform: 'translateY(-50%)' }}
                    />
                  )}
                  {label}
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
            <p className="text-editorial text-black/40 mb-10">
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
                      {label && <span className="text-body-sm">{label}</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {item.overview && <p className="text-editorial">{item.overview}</p>}
          </section>

          {/* Text sections */}
          {([
            { id: 'opportunity',  label: 'Opportunity',  content: item.opportunity },
            { id: 'challenge',    label: 'Challenge',    content: item.challenge },
            { id: 'approach',     label: 'Approach',     content: item.approach },
            { id: 'production',   label: 'Production',   content: item.production },
            { id: 'outcome',      label: 'Outcome',      content: item.outcome },
            { id: 'key-takeaway', label: 'Key Takeaway', content: item.keyTakeaway },
          ] as { id: string; label: string; content?: string }[])
            .filter(s => s.content)
            .map(({ id, label, content }) => (
              <SectionBlock key={id} id={id} label={label}>
                <p className="text-editorial">{content}</p>
              </SectionBlock>
            ))
          }

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

          {/* Highlight videos */}
          {item.highlightVideos && item.highlightVideos.length > 0 && (
            <SectionBlock id="highlights" label="Highlights">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black">
                {item.highlightVideos.map((v, i) => {
                  const src =
                    v.type === 'youtube' ? `https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`
                    : v.type === 'vimeo' ? `https://player.vimeo.com/video/${v.id}?byline=0&title=0`
                    : '';
                  return src ? (
                    <div key={i} className="w-full aspect-video bg-white">
                      <iframe src={src} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen style={{ border: 'none' }} />
                    </div>
                  ) : null;
                })}
              </div>
            </SectionBlock>
          )}

          {/* BTS photos */}
          {btsPhotos.length > 0 && (
            <SectionBlock id="bts" label="Behind the Scenes">
              <div className="columns-1 sm:columns-2 gap-1">
                {btsPhotos.map((f) => (
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
            </SectionBlock>
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
            <div className="pt-16 border-t border-black">
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
    </div>
  );
}
