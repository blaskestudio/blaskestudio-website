'use client';

import { useEffect, useState } from 'react';

const labelClass = 'text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black';

const SECTIONS = [
  { id: 'info-collected',  label: 'Information We Collect' },
  { id: 'newsletter',      label: 'Newsletter' },
  { id: 'how-we-use',     label: 'How We Use It' },
  { id: 'storage',        label: 'Storage' },
  { id: 'cookies',        label: 'Cookies' },
  { id: 'third-party',    label: 'Third-Party Services' },
  { id: 'your-rights',    label: 'Your Rights' },
  { id: 'childrens',      label: "Children's Privacy" },
  { id: 'changes',        label: 'Changes' },
  { id: 'contact',        label: 'Contact' },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('info-collected');

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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-base tracking-[0.08em] uppercase font-medium text-black">Effective Date: April 17, 2026</p>
          <p className="text-editorial mt-8">
            Blaske Studio (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights.
          </p>
        </div>

        <section id="info-collected" className="mb-12">
          <p className={`${labelClass} mb-6`}>1. Information We Collect</p>
          <p className="text-editorial font-semibold mb-3">Information you provide directly</p>
          <p className="text-editorial mb-3">When you fill out a form or sign up, we may collect:</p>
          <ul className="text-editorial flex flex-col gap-1 mb-6 list-disc pl-5">
            {['Name', 'Email address', 'Business name', 'Budget', 'Timeline', 'Project description', 'How you found us'].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial font-semibold mb-3">Automatically collected information</p>
          <p className="text-editorial mb-3">We use analytics tools to understand how people use our site. This may include:</p>
          <ul className="text-editorial flex flex-col gap-1 mb-6 list-disc pl-5">
            {['Pages visited', 'Time spent on site', 'Device/browser type', 'General location (city-level)'].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial">This data is collected via Vercel Analytics and Google Analytics (when enabled).</p>
        </section>

        <section id="newsletter" className="mb-12">
          <p className={`${labelClass} mb-6`}>2. Newsletter</p>
          <p className="text-editorial mb-4">
            If you subscribe to our newsletter, we collect your email address and share it with Substack to manage and deliver communications.
          </p>
          <p className="text-editorial mb-4">
            Substack may collect additional information (such as engagement data and technical information) in accordance with its own privacy policy. We do not control how Substack uses this data.
          </p>
          <p className="text-editorial">
            You can unsubscribe at any time using the link in any email.
          </p>
        </section>

        <section id="how-we-use" className="mb-12">
          <p className={`${labelClass} mb-6`}>3. How We Use Your Information</p>
          <p className="text-editorial mb-3">We use your information to:</p>
          <ul className="text-editorial flex flex-col gap-1 mb-6 list-disc pl-5">
            {['Respond to inquiries', 'Evaluate potential projects', 'Send newsletters (if you opt in)', 'Improve our website and services'].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial">We do not sell your personal information.</p>
        </section>

        <section id="storage" className="mb-12">
          <p className={`${labelClass} mb-6`}>4. How Your Information Is Stored</p>
          <ul className="text-editorial flex flex-col gap-1 mb-6 list-disc pl-5">
            {[
              'Form submissions are sent to our email and stored in a Google Sheet',
              'Newsletter data is managed through Substack',
              'Website data is hosted via Vercel',
            ].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial">We take reasonable steps to protect your information, but no system is 100% secure.</p>
        </section>

        <section id="cookies" className="mb-12">
          <p className={`${labelClass} mb-6`}>5. Cookies</p>
          <p className="text-editorial">Our site may use cookies for analytics and basic functionality. If Google Analytics is active, cookies are being used. You can disable cookies in your browser settings.</p>
        </section>

        <section id="third-party" className="mb-12">
          <p className={`${labelClass} mb-6`}>6. Third-Party Services</p>
          <p className="text-editorial mb-3">We rely on trusted third parties to operate our site:</p>
          <ul className="text-editorial flex flex-col gap-1 mb-6 list-disc pl-5">
            {[
              'Vercel (hosting & analytics)',
              'Google Analytics (website analytics)',
              'Substack (newsletter delivery)',
              'Cloudflare (video delivery & performance)',
            ].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial mb-3">We use Cloudflare to deliver video content and improve site performance. Cloudflare may collect technical information such as IP address, device and browser details, and video playback data to ensure reliable delivery and security.</p>
          <p className="text-editorial">These services may process your data according to their own privacy policies.</p>
        </section>

        <section id="your-rights" className="mb-12">
          <p className={`${labelClass} mb-6`}>7. Your Rights</p>
          <p className="text-editorial mb-3">Depending on your location (including California), you may have the right to:</p>
          <ul className="text-editorial flex flex-col gap-1 mb-6 list-disc pl-5">
            {['Request access to your data', 'Request deletion of your data', 'Opt out of communications'].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-editorial">
            To make a request, contact:{' '}
            <a href="mailto:hello@blaskestudio.com" className="underline underline-offset-2 hover:opacity-60 transition-opacity">
              hello@blaskestudio.com
            </a>
          </p>
        </section>

        <section id="childrens" className="mb-12">
          <p className={`${labelClass} mb-6`}>8. Children&apos;s Privacy</p>
          <p className="text-editorial">
            This website is intended for a general audience and is not directed at children under 13. We do not knowingly collect data from children.
          </p>
        </section>

        <section id="changes" className="mb-12">
          <p className={`${labelClass} mb-6`}>9. Changes to This Policy</p>
          <p className="text-editorial">We may update this policy occasionally. Updates will be posted on this page.</p>
        </section>

        <section id="contact" className="mb-12">
          <p className={`${labelClass} mb-6`}>10. Contact</p>
          <div className="text-editorial flex flex-col gap-1">
            <p>Blaske Studio</p>
            <p>240 E Tutt St</p>
            <p>South Bend, Indiana, USA</p>
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
