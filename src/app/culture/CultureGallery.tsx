'use client';

import { useLayoutEffect, useState } from 'react';
import Image from 'next/image';

interface DriveFile {
  id: string;
  name: string;
}

interface Props {
  photos: DriveFile[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CultureGallery({ photos }: Props) {
  const [displayed, setDisplayed] = useState<DriveFile[]>([]);

  useLayoutEffect(() => {
    setDisplayed(shuffle(photos));
  }, [photos]);

  if (displayed.length === 0) return null;

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {displayed.map((photo, i) => (
        <div key={photo.id} className="break-inside-avoid mb-6">
          <Image
            src={`/api/drive-image?id=${photo.id}`}
            alt=""
            width={1200}
            height={800}
            className="w-full h-auto block"
            loading={i < 6 ? 'eager' : 'lazy'}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              const el = e.currentTarget.parentElement;
              if (el) el.style.display = 'none';
            }}
          />
        </div>
      ))}
    </div>
  );
}
