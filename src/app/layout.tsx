import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import ConditionalShell from '@/components/layout/ConditionalShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://blaskestudio.com'),
  title: {
    default: 'Blaske Studio',
    template: '%s — Blaske Studio',
  },
  description:
    'Blaske Studio is a full-service production studio specializing in cinematic commercial, documentary, music video, and photography work.',
  authors: [{ name: 'CAMZYN Studio', url: 'https://camzyn.com' }],
  openGraph: {
    siteName: 'Blaske Studio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Blaske Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="flex flex-col min-h-screen">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
