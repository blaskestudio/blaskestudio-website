import Link from 'next/link';
import { getAllWorkSlugs } from '@/lib/work';

export const metadata = {
  title: 'Sitemap',
  description: 'All pages on blaskestudio.com.',
};

const STATIC_SECTIONS = [
  {
    label: 'Main',
    links: [
      { href: '/', label: 'Home' },
      { href: '/work', label: 'Work' },
      { href: '/capabilities', label: 'Capabilities' },
      { href: '/inquire', label: 'Inquire' },
    ],
  },
  {
    label: 'About',
    links: [
      { href: '/about', label: 'Who We Are' },
      { href: '/studio', label: 'Our Space' },
      { href: '/culture', label: 'Culture' },
    ],
  },
  {
    label: 'Legal',
    links: [
      { href: '/terms', label: 'Terms' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];

export default async function SitemapPage() {
  const slugs = await getAllWorkSlugs();

  return (
    <main
      className="py-16 md:py-24 flex flex-col gap-16"
      style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
    >
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sitemap</h1>

      <div className="flex flex-col gap-12">
        {STATIC_SECTIONS.map(({ label, links }) => (
          <div key={label} className="flex flex-col md:flex-row gap-6 md:gap-20 border-t border-neutral-100 pt-8">
            <p className="text-[11px] tracking-[0.12em] uppercase font-semibold text-neutral-400 md:w-40 shrink-0 pt-1">
              {label}
            </p>
            <ul className="flex flex-col gap-3">
              {links.map(({ href, label: name }) => (
                <li key={href}>
                  <Link href={href} className="text-editorial hover:opacity-60 transition-opacity duration-150 no-underline">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {slugs.length > 0 && (
          <div className="flex flex-col md:flex-row gap-6 md:gap-20 border-t border-neutral-100 pt-8">
            <p className="text-[11px] tracking-[0.12em] uppercase font-semibold text-neutral-400 md:w-40 shrink-0 pt-1">
              Work
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/work" className="text-editorial hover:opacity-60 transition-opacity duration-150 no-underline">
                  All Work
                </Link>
              </li>
              {slugs.map((slug) => (
                <li key={slug}>
                  <Link href={`/work/${slug}`} className="text-editorial hover:opacity-60 transition-opacity duration-150 no-underline">
                    /work/{slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
