// Design System — internal reference page, not linked in nav
// Access at /design-system

export default function DesignSystemPage() {
  return (
    <main
      className="pt-16 md:pt-24 pb-32"
      style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
    >
      {/* Header */}
      <div className="py-12 border-b border-neutral-200 mb-16">
        <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 mb-3">Internal</p>
        <h1 className="text-5xl font-bold tracking-tight">Design System</h1>
        <p className="text-neutral-500 mt-3">Blaske Studio — all tokens, styles, and components in one place.</p>
      </div>

      <div className="flex flex-col gap-24">

        {/* ── Typography ───────────────────────────────────────── */}
        <section>
          <SectionLabel>Typography</SectionLabel>
          <div className="flex flex-col divide-y divide-neutral-100">

            <TypeRow label="Hero / Display" spec="clamp(2.5rem,6vw,5rem) · bold · tight">
              <span style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Full-Service Studio
              </span>
            </TypeRow>

            <TypeRow label="H1 Page title" spec="3xl–5xl · bold · tight">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Photography
              </h1>
            </TypeRow>

            <TypeRow label="H2 Statement" spec="3xl–5xl · bold · tight">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl">
                Award-winning, full-service production company based in South Bend, Indiana.
              </h2>
            </TypeRow>

            <TypeRow label="Nav / Menu links" spec="14–20px · bold · uppercase · tracking-[0.04em]">
              <span className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold">
                Work · Capabilities · About · Inquire
              </span>
            </TypeRow>

            <TypeRow label="Featured card title" spec="14–20px · bold · uppercase · tracking-[0.04em]">
              <span className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold">
                Built to Take a Hit
              </span>
            </TypeRow>

            <TypeRow label="Body" spec="base · normal">
              <p className="text-base text-neutral-700 max-w-prose">
                Blaske Studio is a full-service production company based in South Bend, Indiana. We create branded content, documentaries, and films that connect with audiences.
              </p>
            </TypeRow>

            <TypeRow label="Body small" spec="sm · neutral-700">
              <p className="text-sm text-neutral-700">
                Client name · 2023
              </p>
            </TypeRow>

            <TypeRow label="All-caps label" spec="10px · semibold · uppercase · tracking-[0.12em]">
              <span className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-500">
                Selected Work · Case Study · Documentary
              </span>
            </TypeRow>

            <TypeRow label="Footer label" spec="14–20px · bold · uppercase · tracking-[0.04em]">
              <span className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase text-black font-bold">
                Contact · Location · Hours
              </span>
            </TypeRow>

          </div>
        </section>

        {/* ── Color ────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Color</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Black', hex: '#0a0a0a', bg: 'bg-[#0a0a0a]', light: true },
              { name: 'White', hex: '#ffffff', bg: 'bg-white', border: true },
              { name: 'Neutral 200', hex: '#e5e5e5', bg: 'bg-neutral-200' },
              { name: 'Neutral 400', hex: '#a3a3a3', bg: 'bg-neutral-400' },
              { name: 'Neutral 500', hex: '#737373', bg: 'bg-neutral-500', light: true },
              { name: 'Neutral 700', hex: '#404040', bg: 'bg-neutral-700', light: true },
              { name: 'Accent Blue', hex: '#60A5FA', bg: 'bg-[#60A5FA]' },
              { name: 'Accent Yellow', hex: '#FFD000', bg: 'bg-[#FFD000]' },
            ].map(({ name, hex, bg, light, border }) => (
              <div key={hex}>
                <div className={`${bg} ${border ? 'border border-neutral-200' : ''} h-20 rounded-sm mb-2`} />
                <p className="text-[11px] font-semibold tracking-[0.04em]">{name}</p>
                <p className="text-[11px] text-neutral-400 font-mono">{hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pills ────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Pills</SectionLabel>
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="pill">All</button>
            <button className="pill">Branded</button>
            <button className="pill">Documentary</button>
            <button className="pill">Case Studies</button>
            <button className="pill pill-active">Active</button>
            <a href="#" className="pill">As Link</a>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono bg-neutral-50 rounded p-4 leading-relaxed">
            {`.pill { font-size: 0.625rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.375rem 1rem; border-radius: 9999px; border: 1px solid #d4d4d4; }`}
          </div>
        </section>

        {/* ── Spacing / Layout ─────────────────────────────────── */}
        <section>
          <SectionLabel>Spacing & Layout</SectionLabel>
          <div className="flex flex-col gap-4">
            {[
              { label: '--page-gutter', value: 'clamp(0.625rem, 2.5vw, 2.5rem)', desc: 'Horizontal page padding on all sections' },
              { label: '--nav-height', value: '64px', desc: 'Fixed nav bar height' },
              { label: 'Section top padding', value: 'py-16 md:py-24', desc: 'Inner pages' },
              { label: 'Section gap (featured)', value: 'py-12 per card', desc: 'FeaturedWork row vertical padding' },
              { label: 'Grid gap', value: 'gap-x-5 gap-y-12', desc: 'WorkGrid card grid' },
            ].map(({ label, value, desc }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-3 border-b border-neutral-100">
                <span className="font-mono text-[12px] text-black min-w-[220px]">{label}</span>
                <span className="font-mono text-[12px] text-[#60A5FA]">{value}</span>
                <span className="text-[12px] text-neutral-400">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Transitions ──────────────────────────────────────── */}
        <section>
          <SectionLabel>Motion</SectionLabel>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Nav color (hover in)', value: '150ms ease', desc: 'Fast hover response' },
              { label: 'Nav color (hover out / intro)', value: '500ms ease', desc: 'Slow color transition on scroll/intro' },
              { label: 'Nav slide in (intro)', value: '800ms cubic-bezier(0.4,0,0.2,1)', desc: 'White bar slides down' },
              { label: 'Nav hide/show (scroll)', value: '300ms cubic-bezier(0.4,0,0.2,1)', desc: 'translateY on scroll direction change' },
              { label: 'Pill border/color', value: '150ms', desc: 'Filter pill hover' },
              { label: 'Video fade in', value: '500ms', desc: 'iframe opacity on iframe load' },
              { label: 'Card overlay', value: '500ms', desc: 'bg-black/25 on card hover' },
            ].map(({ label, value, desc }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-3 border-b border-neutral-100">
                <span className="font-mono text-[12px] text-black min-w-[260px]">{label}</span>
                <span className="font-mono text-[12px] text-[#60A5FA]">{value}</span>
                <span className="text-[12px] text-neutral-400">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Reference ────────────────────────────────────────── */}
        <section>
          <SectionLabel>Visual References</SectionLabel>
          <div className="flex flex-col gap-3">
            {[
              { label: 'CHM Collections', url: 'https://www.computerhistory.org/collections/catalog/102776101/', note: 'Bold all-caps nav pills, high contrast' },
            ].map(({ label, url, note }) => (
              <div key={url} className="flex items-baseline gap-4 py-3 border-b border-neutral-100">
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-black hover:text-[#60A5FA] transition-colors">{label}</a>
                <span className="text-[12px] text-neutral-400">{note}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 mb-8">
      {children}
    </p>
  );
}

function TypeRow({ label, spec, children }: { label: string; spec: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 py-8">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.04em] text-black">{label}</p>
        <p className="text-[11px] text-neutral-400 font-mono mt-1 leading-relaxed">{spec}</p>
      </div>
      <div className="flex items-center">
        {children}
      </div>
    </div>
  );
}
