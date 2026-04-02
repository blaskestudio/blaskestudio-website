'use client';

import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  large?: boolean;
}

export default function ClientLogo({ src, alt, large }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-[10px] tracking-[0.12em] uppercase font-semibold text-neutral-400 text-center leading-tight px-2">
        {alt}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`w-auto object-contain grayscale opacity-50 hover:opacity-90 transition-opacity duration-200 ${
        large ? 'h-20 max-w-[200px]' : 'h-14 max-w-[140px]'
      }`}
    />
  );
}
