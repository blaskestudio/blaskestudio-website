import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
    return new NextResponse('Invalid id', { status: 400 });
  }

  const res = await fetch(`https://lh3.googleusercontent.com/d/${id}=w2000`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!res.ok) {
    return new NextResponse('Image not found', { status: 404 });
  }

  const contentType = res.headers.get('content-type') ?? 'image/png';
  const body = await res.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
