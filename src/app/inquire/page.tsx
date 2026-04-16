import InquireForm from './InquireForm';

export const metadata = {
  title: 'Inquire',
  description: 'Start a project with Blaske Studio.',
};

export default function InquirePage() {
  return (
    <main style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight pt-16 md:pt-24 pb-8">
        Let&rsquo;s make something.
      </h1>

      {/* 50/50 form + image */}
      <div className="flex flex-col lg:flex-row gap-8 pb-16 md:pb-24">

        {/* Form */}
        <div className="w-full lg:w-1/2 shrink-0">
          <div className="border border-black p-8 md:p-12">
            <InquireForm />
          </div>
        </div>

        {/* Photo */}
        <div className="w-full lg:w-1/2">
          <div className="lg:sticky" style={{ top: 'calc(var(--nav-height) + 2rem)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/drive-image?id=1D1MozEzTzVi0ShK3epgPXuMYSztP-3BF"
              alt="Blaske Studio"
              className="w-full object-cover object-bottom"
              style={{ height: 'calc(100vh - var(--nav-height) - 4rem)' }}
            />
          </div>
        </div>

      </div>
    </main>
  );
}
