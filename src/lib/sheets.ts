import { Project, CaseStudy, VideoSource, WorkCategory } from './types';

const SHEET_ID = '1y2WQN4RD_olofaibV3kON5hKYcIihu45jQs4wsEjppw';
const REVALIDATE = 1800; // 30 minutes

const PROJECTS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
const CASE_STUDIES_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=682600694`;

// ── Drive share URL → proxied URL (never exposes Drive URLs to clients) ──────
// Converts https://drive.google.com/file/d/FILE_ID/view?... to /api/drive-video?id=FILE_ID
function parseDriveFileUrl(url: string): string {
  if (!url?.trim()) return '';
  // Handle /file/d/FILE_ID/ format
  const fileMatch = url.match(/\/file\/d\/([A-Za-z0-9_-]+)/);
  if (fileMatch) return `/api/drive-video?id=${fileMatch[1]}`;
  // Handle ?id=FILE_ID or &id=FILE_ID format
  const idMatch = url.match(/[?&]id=([A-Za-z0-9_-]+)/);
  if (idMatch) return `/api/drive-video?id=${idMatch[1]}`;
  return url;
}

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
  // Tokenize the full text so quoted fields with embedded newlines are preserved.
  const rows: string[][] = [];
  let cur = '';
  let inQ = false;
  let fields: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQ && text[i + 1] === '"') { cur += '"'; i++; } // escaped quote
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      fields.push(cur);
      cur = '';
    } else if (!inQ && (ch === '\n' || ch === '\r')) {
      // Skip \n that follows \r
      if (ch === '\r' && text[i + 1] === '\n') i++;
      fields.push(cur);
      cur = '';
      rows.push(fields);
      fields = [];
    } else {
      cur += ch;
    }
  }
  // Push trailing content
  fields.push(cur);
  if (fields.some(f => f.trim())) rows.push(fields);

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
      year: 0,
      featured: get(row, 'featured').toLowerCase() === 'true',
      order: parseInt(get(row, 'order')) || i + 1,
      video: parseVideoUrl(get(row, 'video_url')),
      thumbnailStill: '',
      thumbnailShortUrl: get(row, 'thumbnail_short_id') || undefined,
      thumbnailGif: '',
      contributors: parseCredits(get(row, 'credits')),
    }));
}

function parseDriveFolderUrl(url: string): string {
  if (!url?.trim()) return '';
  const match = url.match(/\/folders\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : '';
}

function parseStatsList(raw: string): string[] {
  if (!raw?.trim()) return [];
  return raw.split(/\n|\r\n/).map(s => s.trim()).filter(Boolean);
}

function parseDeliverablesList(raw: string): string[] {
  if (!raw?.trim()) return [];
  const byNewline = raw.split(/\n|\r\n/).map(s => s.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function deriveYtThumbnail(url: string): string {
  const yt = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]+)/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg`;
  return '';
}

export async function getCaseStudiesFromSheet(): Promise<CaseStudy[]> {
  const { rows, get } = await fetchSheet(CASE_STUDIES_URL);
  return rows
    .filter((row) => get(row, 'slug') && get(row, 'status').toLowerCase() !== 'draft')
    .map((row, i) => {
      const mainVideoUrl = get(row, 'video_main_url');
      const highlights = [
        get(row, 'video_higlight_url_1'),
        get(row, 'video_higlight_url_2'),
        get(row, 'video_higlight_url_3'),
      ].filter(Boolean).map(parseVideoUrl);

      const sectionImageRaw = get(row, 'section_image');
      const sectionImageMatch = sectionImageRaw?.match(/\/file\/d\/([A-Za-z0-9_-]+)/);
      const sectionImageId = sectionImageMatch ? sectionImageMatch[1] : (sectionImageRaw?.trim() || undefined);

      const highlightLabelRaw = get(row, 'highlight_labels');
      const highlightLabels = highlightLabelRaw
        ? highlightLabelRaw.split('|').map(s => s.trim()).filter(Boolean)
        : undefined;

      return {
        slug: get(row, 'slug'),
        contentType: 'case-study' as const,
        title: get(row, 'title'),
        client: get(row, 'client'),
        category: normalizeCategory(get(row, 'category')),
        year: 0,
        featured: false,
        order: parseInt(get(row, 'order')) || i + 100,
        heroVideo: parseVideoUrl(mainVideoUrl),
        highlightVideos: highlights.length ? highlights : undefined,
        highlightLabels,
        sectionImageId,
        thumbnailStill: deriveYtThumbnail(mainVideoUrl),
        thumbnailShortUrl: get(row, 'thumbnail_short_id') || undefined,
        thumbnailGif: '',
        overview: get(row, 'overview'),
        stats: parseStatsList(get(row, 'stats')),
        services: parseDeliverablesList(get(row, 'services')) || undefined,
        opportunity: get(row, 'opportunity') || undefined,
        challenge: get(row, 'challenge'),
        approach: get(row, 'approach'),
        production: get(row, 'production') || undefined,
        outcome: get(row, 'outcome') || undefined,
        keyTakeaway: get(row, 'key_takeaway') || undefined,
        deliverables: parseDeliverablesList(get(row, 'deliverables')),
        results: get(row, 'outcome'),
        btsPhotosFolder: parseDriveFolderUrl(get(row, 'bts_photos')) || undefined,
        contributors: parseCredits(get(row, 'credits')),
        cta: get(row, 'cta_href') ? { href: get(row, 'cta_href'), label: get(row, 'cta_label') || 'Learn More' } : undefined,
      };
    });
}
