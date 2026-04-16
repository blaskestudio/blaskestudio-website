import Link from 'next/link';
import Image from 'next/image';
import HeroScrollImage from '@/components/ui/HeroScrollImage';

export const metadata = {
  title: 'About',
  description: 'About Blaske Studio — an award-winning production company based in South Bend, Indiana.',
};

export default function AboutPage() {
  return (
    <main className="flex flex-col">

      {/* ── Hero image at top ────────────────────────────────────── */}
      <div
        className="pt-16 md:pt-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <HeroScrollImage src="/api/drive-image?id=11RqAvVtdf0O9-rDWqhsuLuiyIAG3QZFB" alt="Blaske Studio" visibleVh={0.38} />
      </div>

      {/* ── Hero heading ────────────────────────────────────────── */}
      <section
        className="pt-16 pb-8 md:pb-12"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Who We Are
        </h1>
      </section>

      {/* ── Studio description ──────────────────────────────────── */}
      <section
        className="py-16 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black mb-4">Blaske Studio</p>
          </div>
          <div className="flex flex-col gap-6 md:w-2/3">
            <p className="text-editorial">
              Blaske Studio is an award winning production company based in South Bend, Indiana, specializing in both commercial and documentary filmmaking. We are passionate storytellers, dedicated to crafting high quality, impactful content that elevates brands and connects with audiences.
            </p>
            <p className="text-editorial">
              Our work is rooted in story first thinking, supported by a strong foundation in cinematography, editing, and production. We collaborate closely with our clients to ensure every piece not only looks great, but resonates with the audience it is meant to reach.
            </p>
            <p className="text-editorial">
              With a reputation for excellence and a commitment to innovation, Blaske Studio is trusted by clients who value authenticity, artistry, and work that delivers real impact.
            </p>
            <p className="text-editorial font-semibold mt-2">
              Let&apos;s make something powerful together.
            </p>
          </div>
        </div>
      </section>

      {/* ── Founder Bio ─────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <div className="flex items-center gap-3">
              <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black shrink-0">Founder</p>
              <div className="flex-1 border-t border-black" />
              <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black shrink-0">Ryan Blaske</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:w-2/3">
            <div className="relative w-1/3 aspect-[3/4] overflow-hidden">
              <Image
                src="/api/drive-image?id=19znw-8kMBJPZBU0Gs8q370hMDxoYVVwe"
                alt="Ryan Blaske"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            </div>
            <p className="text-editorial">
              Ryan Blaske is a South Bend native and filmmaker with over 15 years of experience in professional video production. He founded Blaske Studio with a vision to bring high quality, story driven filmmaking to the community he has always called home.
            </p>
            <p className="text-editorial">
              Before starting the studio, Ryan led video production efforts at the University of Notre Dame and Lippert, where he developed a strong foundation in both creative direction and production execution across a wide range of projects. His background in the independent music scene shaped a do it yourself mindset that continues to influence his work today. It is a mentality rooted in curiosity, problem solving, and a willingness to do whatever it takes to tell the story the right way.
            </p>
            <p className="text-editorial">
              Ryan&apos;s work focuses on creating meaningful, visually compelling stories that connect with people on a deeper level. Through Blaske Studio, he continues to push for a balance of high production value and authentic storytelling in every project.
            </p>
          </div>
        </div>
      </section>

      {/* ── Our Approach ────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black mb-4">Approach</p>
          </div>
          <div className="flex flex-col gap-6 md:w-2/3">
            <p className="text-editorial">
              From concept to final cut, our team brings creativity, technical expertise, and a collaborative spirit to every project. Whether you are looking to promote your business, tell a meaningful story, or capture a moment that matters, we approach every project with intention and care.
            </p>
            <div className="flex items-center">
              {['Creative Development', 'Pre Production', 'Production', 'Post Production', 'Studio'].flatMap((title, i, arr) => [
                <span key={title} className="text-[11px] md:text-[13px] tracking-[0.05em] uppercase font-bold text-black shrink-0 whitespace-nowrap">{title}</span>,
                ...(i < arr.length - 1 ? [<div key={`line-${i}`} className="flex-1 border-t border-black mx-2 md:mx-3" />] : [])
              ])}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ────────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24"
        style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
      >
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-1/3 shrink-0">
            <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase font-bold text-black mb-4">Team</p>
          </div>
          <div className="flex flex-col gap-6 md:w-2/3">
            <p className="text-editorial">
              Our commitment to quality extends beyond the final frame. We are thoughtful about the teams we build, bringing together the right collaborators for each project. Through a trusted network of industry professionals, Blaske Studio is able to scale with intention and deliver at the highest level, no matter the scope.
            </p>
            <Link
              href="/culture"
              className="self-start inline-flex items-center gap-2 border border-black px-6 py-3 text-[16px] tracking-[0.04em] uppercase font-bold text-black bg-transparent hover:bg-black hover:text-white transition-colors duration-150 no-underline mt-2"
            >
              Culture
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M0 5H12M8 1L12 5L8 9" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom image ────────────────────────────────────────── */}
      <div className="pb-8 md:pb-12" style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src="/api/drive-image?id=11V0o89tksAxLVydLNap6l6LQJXciNEbx"
            alt="Blaske Studio"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 95vw"
          />
        </div>
      </div>

    </main>
  );
}
