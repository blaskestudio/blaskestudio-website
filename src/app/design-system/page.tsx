// Design System — internal brand guide, not linked in nav
// Access at /design-system

export default function DesignSystemPage() {
  return (
    <main
      className="pt-16 md:pt-24 pb-32"
      style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
    >
      {/* Header */}
      <div className="py-12 border-b border-black mb-16">
        <p className="text-[12px] tracking-[0.08em] font-medium text-neutral-600 mb-3">Internal · Blaske Studio</p>
        <h1 className="text-5xl font-bold tracking-tight mb-3">Brand Guide</h1>
        <p className="text-base text-neutral-600 max-w-prose">
          All design tokens, type styles, colors, and components. Use this page as the source of truth when building UI.
        </p>
      </div>

      <div className="flex flex-col gap-24">

        {/* ── Accessibility ─────────────────────────────────────── */}
        <section>
          <SectionLabel>Accessibility Standards</SectionLabel>
          <div className="flex flex-col gap-4">
            {[
              { rule: 'Minimum contrast (text on white)', standard: 'WCAG AA 4.5:1', value: 'Use neutral-600 (#525252) or darker. neutral-400 (#a3a3a3) fails at 2.7:1 — never use for body text.' },
              { rule: 'Large text contrast (18px+ bold)', standard: 'WCAG AA 3:1', value: 'neutral-500 (#737373) is acceptable at 4.6:1 for large headings only.' },
              { rule: 'Text on black backgrounds', standard: 'WCAG AA 4.5:1', value: 'neutral-400 on black is ~6.9:1 — passes. Use freely on dark slides/overlays.' },
              { rule: 'Minimum base font size', standard: 'WCAG 1.4.4', value: '16px (1rem). Never use 10px or 11px for readable content. Labels minimum 12px.' },
              { rule: 'Font smoothing', standard: 'Best practice', value: 'antialiased / grayscale. Set globally in body styles.' },
            ].map(({ rule, standard, value }) => (
              <div key={rule} className="grid grid-cols-1 md:grid-cols-[280px_140px_1fr] gap-2 md:gap-6 py-4 border-b border-neutral-100">
                <span className="text-[14px] font-medium text-black">{rule}</span>
                <span className="text-[12px] font-medium text-black tracking-[0.04em]">{standard}</span>
                <span className="text-[13px] text-neutral-600">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Type Scale ───────────────────────────────────────── */}
        <section>
          <SectionLabel>Type Scale</SectionLabel>
          <p className="text-[13px] text-neutral-600 mb-8">Four steps only. Do not introduce new sizes outside this scale.</p>
          <div className="flex flex-col divide-y divide-neutral-100">

            <TypeRow label="Display / Hero" spec="clamp(2.5rem, 6vw, 5rem) · bold · tracking-tight" wcag="✓ AA">
              <span style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Blaske Studio
              </span>
            </TypeRow>

            <TypeRow label="Page Heading (H1/H2)" spec="text-3xl–5xl · bold · tracking-tight" wcag="✓ AA">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Built on craft.
              </h2>
            </TypeRow>

            <TypeRow label="Card Title / Featured" spec="text-xl–[32px] · bold · tracking-tight" wcag="✓ AA">
              <span className="text-xl md:text-[32px] font-bold tracking-tight leading-tight">
                People of Hope
              </span>
            </TypeRow>

            <TypeRow label="Body / UI (base)" spec="16px (1rem) · weight 450 · neutral-700 or black" wcag="✓ AA">
              <p className="text-base text-neutral-700 max-w-prose">
                Full-service production for brands and stories worth telling. South Bend, Indiana.
              </p>
            </TypeRow>

            <TypeRow label="Metadata / Secondary" spec="13px · font-medium · neutral-600" wcag="✓ AA 7:1">
              <span className="text-[13px] font-medium text-neutral-600">
                Indiana University · Branded · 2024
              </span>
            </TypeRow>

            <TypeRow label="Labels / Caps" spec="12px · font-medium · tracking-[0.08em] · neutral-600" wcag="✓ AA 7:1">
              <span className="text-[12px] tracking-[0.08em] font-medium text-neutral-600 uppercase">
                Selected Clients · Medium · Category
              </span>
            </TypeRow>

            <TypeRow label="Nav Links" spec="14–20px · font-medium · uppercase · tracking-[0.04em]" wcag="✓ AA">
              <span className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-medium">
                Work · Capabilities · About · Inquire
              </span>
            </TypeRow>

          </div>
        </section>

        {/* ── Color ────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Color Palette</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { name: 'Black', hex: '#0a0a0a', contrast: '—', bg: 'bg-[#0a0a0a]', light: true, note: 'Primary text, borders, fills' },
              { name: 'White', hex: '#ffffff', contrast: '—', bg: 'bg-white', border: true, note: 'Page background' },
              { name: 'Neutral 600', hex: '#525252', contrast: '7:1 ✓ AA', bg: 'bg-neutral-600', light: true, note: 'Secondary text, labels, metadata' },
              { name: 'Neutral 700', hex: '#404040', contrast: '9.7:1 ✓ AA', bg: 'bg-neutral-700', light: true, note: 'Body text on white' },
              { name: 'Neutral 100', hex: '#f5f5f5', contrast: '—', bg: 'bg-neutral-100', note: 'Subtle backgrounds, dividers' },
              { name: 'Neutral 200', hex: '#e5e5e5', contrast: '—', bg: 'bg-neutral-200', note: 'Borders, grid lines' },
              { name: 'Neutral 400 ✗', hex: '#a3a3a3', contrast: '2.7:1 ✗ FAIL', bg: 'bg-neutral-400', note: 'Do not use for text on white' },
              { name: 'Black (dark bg)', hex: '#0a0a0a', contrast: '—', bg: 'bg-[#0a0a0a]', light: true, note: 'Featured slides, hero sections' },
            ].map(({ name, hex, contrast, bg, light, border, note }) => (
              <div key={name}>
                <div className={`${bg} ${border ? 'border border-neutral-200' : ''} h-16 mb-3`} />
                <p className="text-[13px] font-medium text-black">{name}</p>
                <p className="font-mono text-[12px] text-neutral-600">{hex}</p>
                <p className={`text-[11px] font-medium mt-0.5 ${contrast.includes('FAIL') ? 'text-red-500' : 'text-neutral-600'}`}>{contrast}</p>
                <p className="text-[11px] text-neutral-600 mt-0.5">{note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pills / Filters ──────────────────────────────────── */}
        <section>
          <SectionLabel>Pills &amp; Filters</SectionLabel>
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[12px] font-medium text-neutral-600 mb-4">Default</p>
              <div className="flex flex-wrap gap-3">
                <button className="pill">All</button>
                <button className="pill">Branded</button>
                <button className="pill">Documentary</button>
                <button className="pill">Case Studies</button>
              </div>
            </div>
            <div>
              <p className="text-[12px] font-medium text-neutral-600 mb-4">Active state</p>
              <div className="flex flex-wrap gap-3">
                <button className="pill pill-active">Branded</button>
                <button className="pill">Documentary</button>
              </div>
            </div>
            <div>
              <p className="text-[12px] font-medium text-neutral-600 mb-4">Joined group (Video/Photo toggle)</p>
              <div className="flex">
                <button className="pill pill-active" style={{ borderRight: 'none' }}>Video</button>
                <button className="pill">Photo</button>
              </div>
            </div>
            <div className="font-mono text-[12px] text-neutral-600 bg-neutral-50 p-4 border border-neutral-200 leading-relaxed">
              {`.pill { font-size: 0.75rem (12px); font-weight: 500; letter-spacing: 0.08em; padding: 0.375rem 1rem; border: 1px solid #0a0a0a; border-radius: 0; }`}
            </div>
          </div>
        </section>

        {/* ── Spacing ──────────────────────────────────────────── */}
        <section>
          <SectionLabel>Spacing &amp; Layout</SectionLabel>
          <div className="flex flex-col">
            {[
              { token: '--page-gutter', value: 'clamp(0.625rem, 2.5vw, 2.5rem)', note: 'Horizontal padding on all full-width sections' },
              { token: '--nav-height', value: '64px', note: 'Fixed nav height — used for paddingTop on sticky slide slides' },
              { token: 'Section padding (inner pages)', value: 'py-16 md:py-24', note: 'About, Studio, Work pages' },
              { token: 'Card grid gap', value: 'gap-x-5 gap-y-12', note: 'WorkGrid 3-col layout' },
              { token: 'Slide deck height', value: 'N × 100vh', note: 'Each featured slide = 1 viewport of scroll space' },
            ].map(({ token, value, note }) => (
              <div key={token} className="grid grid-cols-1 md:grid-cols-[260px_180px_1fr] gap-2 md:gap-6 py-4 border-b border-neutral-100">
                <span className="font-mono text-[13px] text-black">{token}</span>
                <span className="font-mono text-[13px] text-neutral-600">{value}</span>
                <span className="text-[13px] text-neutral-600">{note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Motion ───────────────────────────────────────────── */}
        <section>
          <SectionLabel>Motion</SectionLabel>
          <div className="flex flex-col">
            {[
              { token: 'Nav hide/show', value: '300ms cubic-bezier(0.4,0,0.2,1)', note: 'translateY on scroll direction change' },
              { token: 'Nav bg color', value: '300ms ease', note: 'Transparent → white when scrolling past hero' },
              { token: 'Pill hover', value: '150ms', note: 'Border/color/background transitions' },
              { token: 'Video thumbnail fade', value: '500ms', note: 'Opacity when iframe loads' },
              { token: 'Card scale (hover)', value: '300ms ease-out scale(1.02)', note: 'Applied to media container only, not metadata' },
              { token: 'Footer wordmark bounce', value: '0.22s ease-in-out, 45ms stagger per letter', note: 'Fires on every scroll-into-view after first exit' },
            ].map(({ token, value, note }) => (
              <div key={token} className="grid grid-cols-1 md:grid-cols-[240px_280px_1fr] gap-2 md:gap-6 py-4 border-b border-neutral-100">
                <span className="font-mono text-[13px] text-black">{token}</span>
                <span className="font-mono text-[13px] text-neutral-600">{value}</span>
                <span className="text-[13px] text-neutral-600">{note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Do / Don't ───────────────────────────────────────── */}
        <section>
          <SectionLabel>Rules</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200">
            <div className="bg-white p-8">
              <p className="text-[12px] font-medium tracking-[0.08em] text-black mb-6">DO</p>
              <ul className="flex flex-col gap-3 text-[13px] text-neutral-600">
                <li>✓ Use neutral-600 or darker for all text on white</li>
                <li>✓ Use 12px minimum for labels, 16px for body</li>
                <li>✓ Keep type scale to 4 steps</li>
                <li>✓ Use font-medium for labels, font-bold for headings only</li>
                <li>✓ Use tracking-[0.04em] for nav/section labels in uppercase</li>
                <li>✓ Use #0a0a0a (not pure #000000) for black</li>
                <li>✓ Keep antialiased font rendering globally</li>
              </ul>
            </div>
            <div className="bg-white p-8">
              <p className="text-[12px] font-medium tracking-[0.08em] text-black mb-6">DON'T</p>
              <ul className="flex flex-col gap-3 text-[13px] text-neutral-600">
                <li>✗ Use neutral-400 (#a3a3a3) for text on white — fails WCAG</li>
                <li>✗ Use font-bold for anything other than headings</li>
                <li>✗ Use font-semibold — not in the scale</li>
                <li>✗ Introduce new font sizes outside the 4-step scale</li>
                <li>✗ Use tracking-[0.12em] — reduces to 0.08em max</li>
                <li>✗ Use pure black #000000</li>
                <li>✗ Use pill with border-radius (always square)</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] tracking-[0.08em] uppercase font-medium text-neutral-600 mb-8">
      {children}
    </p>
  );
}

function TypeRow({ label, spec, wcag, children }: { label: string; spec: string; wcag?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 py-8">
      <div>
        <p className="text-[13px] font-medium text-black">{label}</p>
        <p className="font-mono text-[11px] text-neutral-600 mt-1 leading-relaxed">{spec}</p>
        {wcag && <p className="text-[11px] font-medium text-neutral-600 mt-1">{wcag}</p>}
      </div>
      <div className="flex items-center">
        {children}
      </div>
    </div>
  );
}
