import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import 'dialkit/styles.css';
import ConditionalShell from '@/components/layout/ConditionalShell';
import { DialRoot } from 'dialkit';

export const metadata: Metadata = {
  title: {
    default: 'Blaske Studio',
    template: '%s — Blaske Studio',
  },
  description:
    'Blaske Studio is a full-service production studio specializing in cinematic commercial, documentary, music video, and photography work.',
  openGraph: {
    siteName: 'Blaske Studio',
    locale: 'en_US',
    type: 'website',
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
        <DialRoot />
      </body>
    </html>
  );
}
