import InquireForm from './InquireForm';

export const metadata = {
  title: 'Inquire',
  description: 'Start a project with Blaske Studio.',
};

export default function InquirePage() {
  return (
    <main style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
      <div className="py-16 md:py-24 max-w-2xl">

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
          Let&rsquo;s make something.
        </h1>
        <p className="text-base text-neutral-600 mb-12 leading-relaxed">
          Tell us about your project and we&rsquo;ll be in touch.
        </p>

        <div className="border border-neutral-200 rounded-2xl p-8 md:p-12">
          <InquireForm />
        </div>

      </div>
    </main>
  );
}
