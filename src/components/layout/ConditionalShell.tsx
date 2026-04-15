'use client';

import { usePathname } from 'next/navigation';
import Nav from './Nav';
import Footer from './Footer';

/**
 * Wraps all page content. On project detail pages (/work/[slug]),
 * hides the Nav and Footer and removes the nav-height offset so the
 * video can fill the full viewport — Partizan-style.
 */
export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Match /work/<slug> but NOT /work itself or the filter pages (/work/video, /work/photo, etc.)
  const isProjectPage = /^\/work\/(?!video|photo)[^/]+$/.test(pathname);
  const isHomePage = pathname === '/';

  if (isProjectPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <div className="flex flex-col flex-1">
        {children}
      </div>
      <Footer dark={isHomePage} />
    </>
  );
}
