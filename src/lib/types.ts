// ─── Work categories ────────────────────────────────────────

export type WorkCategory =
  | 'branded'
  | 'documentary'
  | 'music-video'
  | 'photography';

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  branded: 'Branded',
  documentary: 'Documentary',
  'music-video': 'Music Videos',
  photography: 'Photography',
};

// ─── Media ──────────────────────────────────────────────────

export type VideoSource =
  | { type: 'vimeo'; id: string }
  | { type: 'youtube'; id: string }
  | { type: 'local'; path: string };

export interface GallerySection {
  type: 'image' | 'video' | 'grid';
  caption?: string;
  assets: string[]; // absolute paths or external URLs
}

// ─── People ─────────────────────────────────────────────────

export interface Contributor {
  role: string;
  name: string;
}

// ─── Shared base ─────────────────────────────────────────────

interface WorkItemBase {
  slug: string;
  title: string;
  category: WorkCategory;
  client: string;
  year: number;
  /**
   * Animated GIF shown on card hover.
   * Use an empty string or placeholder path until real assets are added.
   */
  thumbnailGif: string;
  /**
   * Static still image — used as card default state and og:image.
   */
  thumbnailStill: string;
  /** Surfaces on the Home page featured section. */
  featured: boolean;
  /** Manual sort order within the Work index. Lower = earlier. */
  order: number;
}

// ─── Standard Project ────────────────────────────────────────

export interface Project extends WorkItemBase {
  contentType: 'project';
  video: VideoSource;
  contributors?: Contributor[];
  /** Optional behind-the-scenes or gallery images. */
  btsGallery?: string[];
}

// ─── Case Study ──────────────────────────────────────────────

export interface CaseStudy extends WorkItemBase {
  contentType: 'case-study';
  heroVideo: VideoSource;
  overview: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  results: string;
  contributors?: Contributor[];
  gallery?: GallerySection[];
  cta?: {
    label: string;
    href: string;
  };
}

// ─── Union ───────────────────────────────────────────────────

export type WorkItem = Project | CaseStudy;
