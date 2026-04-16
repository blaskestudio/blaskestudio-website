'use client';

export default function DriveGridImage({ id, loading }: { id: string; loading?: 'eager' | 'lazy' }) {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/drive-image?id=${id}`}
        alt=""
        className="w-full h-auto block"
        loading={loading}
        onError={(e) => {
          (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );
}
