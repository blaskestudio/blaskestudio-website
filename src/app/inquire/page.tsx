import InquireForm from './InquireForm';

export const metadata = {
  title: 'Inquire',
  description: 'Start a project with Blaske Studio.',
};

export default function InquirePage() {
  return (
    <main style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
      <div className="py-16 md:py-24 flex flex-col lg:flex-row gap-12 lg:gap-20">

        {/* Form */}
        <div className="w-full lg:w-1/2 shrink-0">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">
            Let&rsquo;s make something.
          </h1>
          <div className="border border-black p-8 md:p-12">
            <InquireForm />
          </div>
        </div>

        {/* Photo */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-[var(--nav-height)] self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/d/12q5MWMz5e6C5yacvxV8rnRLnr5JZ5o4O=w2000"
            alt="Blaske Studio"
            className="w-full h-auto block object-cover"
          />
        </div>

      </div>
    </main>
  );
}
