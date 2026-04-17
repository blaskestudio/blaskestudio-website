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
  /**
   * Short looping video URL played on the work card in place of the full video.
   * The full video still opens in the lightbox.
   */
  thumbnailShortUrl?: string;
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
  highlightVideos?: VideoSource[];
  /** Labels for each highlight video, e.g. ["S1 E1", "S1 E2"]. Pipe-separated in sheet. */
  highlightLabels?: string[];
  /** Drive file ID for an image shown between Opportunity and Challenge sections. */
  sectionImageId?: string;
  overview: string;
  stats?: string[];
  services?: string[];
  opportunity?: string;
  challenge: string;
  approach: string;
  production?: string;
  outcome?: string;
  keyTakeaway?: string;
  deliverables: string[];
  results: string;
  btsPhotosFolder?: string;
  contributors?: Contributor[];
  gallery?: GallerySection[];
  cta?: {
    label: string;
    href: string;
  };
}

// ─── Union ───────────────────────────────────────────────────

export type WorkItem = Project | CaseStudy;
