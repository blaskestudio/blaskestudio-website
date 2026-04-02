import { Project, VideoSource, WorkCategory } from './types';

const SHEET_ID = '1y2WQN4RD_olofaibV3kON5hKYcIihu45jQs4wsEjppw';
const REVALIDATE = 1800; // 30 minutes

const PROJECTS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

// ── Parsers ──────────────────────────────────────────────────

export function parseVideoUrl(url: string): VideoSource {
  const s = url?.trim() ?? '';
  if (!s) return { type: 'vimeo', id: '' };

  const vimeo = s.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: 'vimeo', id: vimeo[1] };

  const yt = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]+)/);
  if (yt) return { type: 'youtube', id: yt[1] };

  return { type: 'vimeo', id: s };
}

function parseCredits(raw: string) {
  if (!raw?.trim()) return [];
  return raw.split('|').flatMap((c) => {
    const i = c.indexOf(':');
    if (i === -1) return [];
    return [{ role: c.slice(0, i).trim(), name: c.slice(i + 1).trim() }];
  });
}

function normalizeCategory(raw: string): WorkCategory {
  const map: Record<string, WorkCategory> = {
    branded: 'branded',
    commercial: 'branded',
    documentary: 'documentary',
    'music-video': 'music-video',
    'music video': 'music-video',
    photography: 'photography',
    'film-tv': 'branded',
    'tv-film': 'branded',
  };
  return map[raw?.toLowerCase()?.trim()] ?? 'branded';
}

// ── CSV parser (handles quoted fields with embedded commas/newlines) ──

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split('\n')) {
    const fields: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        fields.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    fields.push(cur.replace(/\r$/, ''));
    rows.push(fields);
  }
  return rows;
}

async function fetchSheet(url: string) {
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const [header, ...data] = parseCSV(await res.text());
  const headers = header.map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const rows = data.filter((r) => r.some((c) => c.trim()));
  const get = (row: string[], col: string) => (row[headers.indexOf(col)] ?? '').trim();
  return { rows, get };
}

// ── Public fetchers ──────────────────────────────────────────

export async function getProjectsFromSheet(): Promise<Project[]> {
  const { rows, get } = await fetchSheet(PROJECTS_URL);
  return rows
    .filter((row) => get(row, 'slug') && get(row, 'status').toLowerCase() !== 'draft')
    .map((row, i) => ({
      slug: get(row, 'slug'),
      contentType: 'project' as const,
      title: get(row, 'title'),
      client: get(row, 'client'),
      category: normalizeCategory(get(row, 'category')),
      year: parseInt(get(row, 'year')) || 0,
      featured: get(row, 'featured').toLowerCase() === 'true',
      order: parseInt(get(row, 'order')) || i + 1,
      video: parseVideoUrl(get(row, 'video_url')),
      thumbnailStill: get(row, 'thumbnail_still'),
      thumbnailGif: get(row, 'thumbnail_gif'),
      contributors: parseCredits(get(row, 'credits')),
    }));
}
