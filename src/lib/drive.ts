const CULTURE_FOLDER_ID = '1Pi-9rojcvrsOl8nlK2ooEIOu9N88PxwR';
const LOGOS_FOLDER_ID = '1tOT6nlFNjEE4WNq_yr7_4nrCDj3paT_-';

export interface DriveFile {
  id: string;
  name: string;
}

/**
 * Generic helper — fetches any public Google Drive folder and returns file IDs + names.
 * The folder must be shared as "Anyone with the link can view".
 * Revalidates every hour via Next.js ISR.
 */
async function getDriveFolderFiles(folderId: string, label: string): Promise<DriveFile[]> {
  try {
    const res = await fetch(
      `https://drive.google.com/drive/folders/${folderId}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        // No per-fetch caching — let page-level revalidate control freshness.
        // Per-fetch cache was causing empty results to get locked in for 1hr.
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      console.error(`Drive folder fetch failed (${label}):`, res.status);
      return [];
    }

    const html = await res.text();

    const decoded = html
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    const pattern =
      /\[null,"([A-Za-z0-9_\-]{25,})"\][^\]]*?\][\s\S]{0,1000}?"([^"\\]+\.(?:jpg|jpeg|png|webp|svg|heic|avif|gif|tiff|bmp))"/gi;

    const seenIds = new Set<string>();
    const files: DriveFile[] = [];

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(decoded)) !== null) {
      const [, id, name] = match;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        files.push({ id, name });
      }
    }

    return files.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error(`getDriveFolderFiles error (${label}):`, err);
    return [];
  }
}

export async function getDriveFilesFromFolder(folderId: string): Promise<DriveFile[]> {
  return getDriveFolderFiles(folderId, folderId);
}

export async function getCulturePhotos(): Promise<DriveFile[]> {
  return getDriveFolderFiles(CULTURE_FOLDER_ID, 'culture');
}

const PHOTO_COMMERCIAL_FOLDER_ID = '1lYY90bo6tSnDknpKwrr8_8w3EBasT3nq';
const PHOTO_DOCUMENTARY_FOLDER_ID = '1JkjdM_KY1IwaZWGi6DUCCeOQJv4fJukk';
const PHOTO_HEADSHOTS_FOLDER_ID = '1Y0JSTHBR8TfZLIZEiv7bJFe2J-PVWHBZ';
const PHOTO_PERFORMANCE_FOLDER_ID = '1MPDCfJyxNmo3otf4AvGhsIifhhwtHgDY';
const PORTRAITURE_FOLDER_ID = '1c1ojQjRBzJFwRCixtdrItsBahdabTlem';

export async function getPortraiturePhotos(): Promise<DriveFile[]> {
  return getDriveFolderFiles(PORTRAITURE_FOLDER_ID, 'portraiture');
}

export interface PhotographyPhotosByCategory {
  commercial: string[];
  documentary: string[];
  headshots: string[];
  performance: string[];
  portraiture: string[];
}

export async function getAllPhotographyPhotos(): Promise<PhotographyPhotosByCategory> {
  const [commercial, documentary, headshots, performance, portraiture] = await Promise.all([
    getDriveFolderFiles(PHOTO_COMMERCIAL_FOLDER_ID, 'photo-commercial'),
    getDriveFolderFiles(PHOTO_DOCUMENTARY_FOLDER_ID, 'photo-documentary'),
    getDriveFolderFiles(PHOTO_HEADSHOTS_FOLDER_ID, 'photo-headshots'),
    getDriveFolderFiles(PHOTO_PERFORMANCE_FOLDER_ID, 'photo-performance'),
    getDriveFolderFiles(PORTRAITURE_FOLDER_ID, 'portraiture'),
  ]);
  return {
    commercial: commercial.map((f) => driveImageUrl(f.id)),
    documentary: documentary.map((f) => driveImageUrl(f.id)),
    headshots: headshots.map((f) => driveImageUrl(f.id)),
    performance: performance.map((f) => driveImageUrl(f.id)),
    portraiture: portraiture.map((f) => driveImageUrl(f.id)),
  };
}

/**
 * Returns a displayable image URL for a publicly shared Drive file.
 * sz=w2000 requests up to 2000px wide — Google will serve the best fit.
 */
export function driveImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w2000`;
}

/**
 * Derives a human-readable display name from a logo filename.
 * e.g. "patrick-media.png" → "Patrick Media"
 */
export function logoDisplayName(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')         // strip extension
    .replace(/[-_]/g, ' ')           // dashes/underscores → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // title case
}

export async function getClientLogos(): Promise<DriveFile[]> {
  return getDriveFolderFiles(LOGOS_FOLDER_ID, 'logos');
}
