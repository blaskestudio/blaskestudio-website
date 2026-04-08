'use client';

import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  large?: boolean;
  dark?: boolean;
}

export default function ClientLogo({ src, alt, large, dark }: Props) {
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
      className={`max-w-[50%] max-h-[35%] w-auto h-auto object-contain grayscale opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-200 ${dark ? 'invert' : ''}`}
    />
  );
}
