'use client';

import { useEffect, useState } from 'react';

const labelClass = 'text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black';

const SECTIONS = [
  { id: 'use',           label: 'Use of This Website' },
  { id: 'ip',            label: 'Intellectual Property' },
  { id: 'guarantees',   label: 'No Guarantees' },
  { id: 'inquiries',    label: 'Inquiries & Submissions' },
  { id: 'third-party',  label: 'Third-Party Links' },
  { id: 'liability',    label: 'Limitation of Liability' },
  { id: 'changes',      label: 'Changes' },
  { id: 'governing',    label: 'Governing Law' },
  { id: 'contact',      label: 'Contact' },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('use');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const onScroll = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50) {
        setActiveSection('contact');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="hidden lg:block">
        <nav
          className="fixed w-[220px] flex flex-col gap-4 pt-20 pr-6 overflow-visible"
          style={{ top: 'var(--nav-height)', left: 0, paddingLeft: 'var(--page-gutter)' }}
        >
          {SECTIONS.map(({ id, label }) => {
            const active = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`relative flex items-center text-xs font-normal uppercase tracking-[0.08em] no-underline transition-colors duration-150 ${
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
              </a>
            );
          })}
        </nav>
      </aside>

      {/* ── Content ───────────────────────────────────────────── */}
      <main className="mx-auto" style={{ maxWidth: '720px', paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>

        <div className="pt-14 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-base tracking-[0.08em] uppercase font-medium text-black">Effective Date: April 17, 2026</p>
          <p className="text-editorial mt-8">
            By using this website, you agree to the following terms.
          </p>
        </div>

        <section id="use" className="mb-12">
          <p className={`${labelClass} mb-6`}>1. Use of This Website</p>
          <p className="text-editorial mb-3">This site is intended to:</p>
          <ul className="text-editorial list-disc pl-5 flex flex-col gap-1 mb-6">
            {['Showcase our work', 'Provide information about our services', 'Allow potential clients to contact us'].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial">You agree to use this site responsibly and not misuse it.</p>
        </section>

        <section id="ip" className="mb-12">
          <p className={`${labelClass} mb-6`}>2. Intellectual Property</p>
          <p className="text-editorial mb-3">All content on this site — including:</p>
          <ul className="text-editorial list-disc pl-5 flex flex-col gap-1 mb-6">
            {['Videos', 'Case studies', 'Images', 'Branding and design'].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial mb-3">— is owned by Blaske Studio or used with permission.</p>
          <p className="text-editorial">You may not copy, reproduce, or reuse any content without written permission.</p>
        </section>

        <section id="guarantees" className="mb-12">
          <p className={`${labelClass} mb-6`}>3. No Guarantees</p>
          <p className="text-editorial mb-3">Content on this site is provided for informational purposes only. We do not guarantee:</p>
          <ul className="text-editorial list-disc pl-5 flex flex-col gap-1 mb-6">
            {['Project outcomes', 'Business results', 'Availability of services'].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial">All work is subject to separate agreements.</p>
        </section>

        <section id="inquiries" className="mb-12">
          <p className={`${labelClass} mb-6`}>4. Inquiries and Submissions</p>
          <p className="text-editorial mb-3">Submitting a form does not:</p>
          <ul className="text-editorial list-disc pl-5 flex flex-col gap-1 mb-6">
            {['Create a client relationship', 'Guarantee a response or engagement'].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial">We reserve the right to decline projects at our discretion.</p>
        </section>

        <section id="third-party" className="mb-12">
          <p className={`${labelClass} mb-6`}>5. Third-Party Links</p>
          <p className="text-editorial mb-3">This site may link to third-party platforms (e.g., Substack).</p>
          <p className="text-editorial">We are not responsible for their content or practices.</p>
        </section>

        <section id="liability" className="mb-12">
          <p className={`${labelClass} mb-6`}>6. Limitation of Liability</p>
          <p className="text-editorial mb-3">To the fullest extent permitted by law, Blaske Studio is not liable for:</p>
          <ul className="text-editorial list-disc pl-5 flex flex-col gap-1">
            {[
              'Any damages arising from use of this website',
              'Errors or omissions in content',
              'Temporary unavailability of the site',
            ].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="changes" className="mb-12">
          <p className={`${labelClass} mb-6`}>7. Changes to These Terms</p>
          <p className="text-editorial">We may update these Terms from time to time. Continued use of the site means you accept any changes.</p>
        </section>

        <section id="governing" className="mb-12">
          <p className={`${labelClass} mb-6`}>8. Governing Law</p>
          <p className="text-editorial">These Terms are governed by the laws of the United States and the State of Indiana.</p>
        </section>

        <section id="contact" className="mb-12">
          <p className={`${labelClass} mb-6`}>9. Contact</p>
          <div className="text-editorial flex flex-col gap-1">
            <p>Blaske Studio</p>
            <p className="mt-2">
              <a href="mailto:hello@blaskestudio.com" className="underline underline-offset-2 hover:opacity-60 transition-opacity">
                hello@blaskestudio.com
              </a>
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
