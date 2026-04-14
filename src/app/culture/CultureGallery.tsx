'use client';

import { useEffect, useState } from 'react';

interface DriveFile {
  id: string;
  name: string;
}

interface Props {
  photos: DriveFile[];
}

function photoUrl(id: string) {
  return `https://lh3.googleusercontent.com/d/${id}=w2000`;
}

export default function CultureGallery({ photos }: Props) {
  const [displayed, setDisplayed] = useState<DriveFile[]>([]);

  useEffect(() => {
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    setDisplayed(shuffled.slice(0, 20));
  }, [photos]);

  if (displayed.length === 0) return null;

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
      {displayed.map((photo, i) => (
        <div key={photo.id} className="break-inside-avoid mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl(photo.id)}
            alt=""
            className="w-full h-auto block"
            loading={i < 6 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </div>
  );
}
