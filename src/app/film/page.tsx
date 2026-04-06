export const metadata = { title: 'Film — Blaske Studio' };

export default function FilmPage() {
  return (
    <main className="pt-16 md:pt-24" style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}>
      <div className="py-12 md:py-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-xl">
          Film
        </h1>
        <p className="mt-6 text-neutral-500 text-lg max-w-lg">
          Coming soon.
        </p>
      </div>
    </main>
  );
}
