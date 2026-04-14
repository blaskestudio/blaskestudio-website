'use client';

export interface MarqueeLogo {
  src: string;
  alt: string;
  large?: boolean;
}

interface Props {
  rows: MarqueeLogo[][];
}

export default function LogoMarquee({ rows }: Props) {
  return (
    <div className="flex flex-col gap-10 overflow-hidden">
      {rows.map((row, i) => {
        const reversed = i === 1;
        const doubled = [...row, ...row];
        return (
          <div key={i} className="flex overflow-hidden">
            <div
              className="flex items-center gap-16 shrink-0"
              style={{
                width: 'max-content',
                animation: `${reversed ? 'marquee-right' : 'marquee-left'} 50s linear infinite`,
              }}
            >
              {doubled.map((logo, j) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={j}
                  src={logo.src}
                  alt={logo.alt}
                  className="shrink-0 h-8 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-200 select-none"
                  style={{
                    filter: 'invert(1)',
                    mixBlendMode: 'screen',
                    maxWidth: logo.large ? '160px' : '110px',
                  }}
                  draggable={false}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
