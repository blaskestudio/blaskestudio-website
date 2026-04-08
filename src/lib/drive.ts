const CULTURE_FOLDER_ID = '1Pi-9rojcvrsOl8nlK2ooEIOu9N88PxwR';

export interface DriveFile {
  id: string;
  name: string;
}

/**
 * Fetches the public Google Drive folder page and parses file IDs + names
 * directly from the HTML — no API key required.
 *
 * The folder must be shared as "Anyone with the link can view".
 * Revalidates every hour via Next.js ISR.
 */
export async function getCulturePhotos(): Promise<DriveFile[]> {
  try {
    const res = await fetch(
      `https://drive.google.com/drive/folders/${CULTURE_FOLDER_ID}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        next: { revalidate: 3600 }, // refresh once per hour
      }
    );

    if (!res.ok) {
      console.error('Drive folder fetch failed:', res.status);
      return [];
    }

    const html = await res.text();

    // Decode HTML entities
    const decoded = html
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    // Pattern: [null,"FILE_ID"]...] ... "filename.ext"
    // Drive embeds each file's ID and name in this structure
    const pattern =
      /\[null,"([A-Za-z0-9_\-]{25,})"\][^\]]*?\][\s\S]{0,1000}?"([\w.\-\s()\[\]]+\.(?:jpg|jpeg|png|webp))"/gi;

    const seen = new Set<string>();
    const files: DriveFile[] = [];

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(decoded)) !== null) {
      const [, id, name] = match;
      if (!seen.has(name)) {
        seen.add(name);
        files.push({ id, name });
      }
    }

    // Sort by filename (which starts with date, so chronological order)
    return files.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error('getCulturePhotos error:', err);
    return [];
  }
}

/**
 * Returns a displayable image URL for a publicly shared Drive file.
 * sz=w2000 requests up to 2000px wide — Google will serve the best fit.
 */
export function driveImageUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
}
