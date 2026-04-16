import { NextRequest, NextResponse } from 'next/server';

/**
 * Redirect proxy for Drive short-loop videos.
 *
 * Why a redirect instead of streaming:
 *   Streaming proxies the entire video through our server, adding 3–5s of
 *   double-hop latency before the browser receives a single byte.
 *   A redirect responds in <10ms; the browser then fetches Drive directly so
 *   video data flows Drive → browser with no server in the path.
 *
 * Security: The Drive file ID is validated but never appears in page HTML —
 * it only shows up in the browser's network tab after the redirect is followed,
 * which is the same exposure level as any publicly-shared Drive file.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
    return new NextResponse('Invalid id', { status: 400 });
  }

  return NextResponse.redirect(
    `https://drive.google.com/uc?export=download&confirm=t&id=${id}`,
    {
      status: 302,
      headers: {
        // Don't cache the redirect — the underlying Drive URL can change
        'Cache-Control': 'no-store',
      },
    }
  );
}
