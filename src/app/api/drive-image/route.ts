import { NextRequest, NextResponse } from 'next/server';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchImage(url: string): Promise<{ ok: boolean; contentType: string; body: ArrayBuffer } | null> {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) return null;
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) return null;
  const body = await res.arrayBuffer();
  return { ok: true, contentType, body };
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
    return new NextResponse('Invalid id', { status: 400 });
  }

  // Try multiple URL formats — Google Drive image URLs can vary in reliability
  const urls = [
    `https://lh3.googleusercontent.com/d/${id}=w2000`,
    `https://drive.google.com/uc?export=view&id=${id}`,
    `https://lh3.googleusercontent.com/d/${id}`,
  ];

  for (const url of urls) {
    const result = await fetchImage(url);
    if (result) {
      return new NextResponse(result.body, {
        headers: {
          'Content-Type': result.contentType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  }

  return new NextResponse('Image not found', { status: 404 });
}
