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
      className={`max-w-[70%] max-h-[55%] w-auto h-auto object-contain transition-all duration-200 ${dark ? 'opacity-70 hover:opacity-100 hover:scale-105' : 'grayscale opacity-80 hover:opacity-100 hover:scale-105'}`}
      style={dark ? { filter: 'invert(1)', mixBlendMode: 'screen' } : undefined}
    />
  );
}
