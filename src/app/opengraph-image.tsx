import { ImageResponse } from 'next/og';

export const alt = 'Blaske Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: '-3px',
            lineHeight: 1,
          }}
        >
          Blaske Studio
        </div>
        <div
          style={{
            color: '#666666',
            fontSize: 28,
            marginTop: 20,
            letterSpacing: '-0.5px',
          }}
        >
          Full-service production studio — South Bend, Indiana
        </div>
      </div>
    ),
    size
  );
}
