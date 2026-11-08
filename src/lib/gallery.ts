import prisma from './prisma';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ALL' | 'FADES' | 'BEARDS' | 'HAIRCUTS' | 'STYLING';
  tag: string;
  description: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string; // Image URL / base64 or Video URL (YouTube / Vimeo / MP4)
  thumbnailUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Precision Mid Skin Fade',
    category: 'FADES',
    tag: 'Fade & Taper',
    description: 'Zero foil blend seamlessly transitioning into a textured matte scissor crop.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
    sortOrder: 1,
    isActive: true,
    createdAt: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'g-2',
    title: 'Sculpted Beard & Razor Contour',
    category: 'BEARDS',
    tag: 'Beard Art',
    description: 'Crisp cheek lines with tapered sideburns, botanical oil treatment, and hot towel finish.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    sortOrder: 2,
    isActive: true,
    createdAt: '2026-11-02T10:00:00.000Z',
  },
  {
    id: 'g-3',
    title: 'Classic Side Part & Scissor Finish',
    category: 'HAIRCUTS',
    tag: 'Classic Cut',
    description: 'Timeless scissor taper cut with natural flow, refined parting, and soft natural neckline.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
    sortOrder: 3,
    isActive: true,
    createdAt: '2026-11-03T10:00:00.000Z',
  },
  {
    id: 'g-4',
    title: 'Low Drop Fade with Textured Crop',
    category: 'FADES',
    tag: 'Modern Fade',
    description: 'Subtle low curvature around the ears highlighting dense top texture and sharp hairline contour.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1517832606589-7629c3395909?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517832606589-7629c3395909?w=600&auto=format&fit=crop&q=80',
    sortOrder: 4,
    isActive: true,
    createdAt: '2026-11-04T10:00:00.000Z',
  },
  {
    id: 'g-5',
    title: 'Full Beard Shaping & Conditioning',
    category: 'BEARDS',
    tag: 'Beard Care',
    description: 'Volume reduction with organic jojoba oil conditioning, symmetry sculpting, and mustache detailing.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
    sortOrder: 5,
    isActive: true,
    createdAt: '2026-11-05T10:00:00.000Z',
  },
  {
    id: 'g-6',
    title: 'Executive Pompadour & Taper',
    category: 'HAIRCUTS',
    tag: 'Signature Styling',
    description: 'High-volume blowout finished with water-based matte pomade and razor-sculpted temple lineup.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
    sortOrder: 6,
    isActive: true,
    createdAt: '2026-11-06T10:00:00.000Z',
  },
];

/**
 * Extracts YouTube Video ID from any standard or shorts YouTube URL
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Extracts Vimeo Video ID
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  return match ? match[1] : null;
}

/**
 * Generates an embeddable URL for a video link
 */
export function getEmbedVideoUrl(url: string): string {
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
  }
  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  }
  return url;
}

/**
 * Generates a thumbnail for a video link (if YouTube)
 */
export function getVideoThumbnail(url: string, customThumbnail?: string): string {
  if (customThumbnail && customThumbnail.trim() !== '') {
    return customThumbnail;
  }
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return '/images/products/matte-clay-model.jpg';
}

/**
 * Loads Gallery items from database or returns defaults
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const setting = await prisma.businessSetting.findUnique({
      where: { key: 'gallery_items' },
    });

    if (setting && setting.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      }
    }
  } catch (error) {
    console.warn('Failed to load gallery items from database; falling back to default curated items.');
  }

  return DEFAULT_GALLERY_ITEMS;
}

/**
 * Persists Gallery items to the database
 */
export async function saveGalleryItems(items: GalleryItem[]): Promise<boolean> {
  try {
    await prisma.businessSetting.upsert({
      where: { key: 'gallery_items' },
      update: { value: JSON.stringify(items) },
      create: { key: 'gallery_items', value: JSON.stringify(items) },
    });
    return true;
  } catch (error) {
    console.error('Failed to save gallery items to database:', error);
    return false;
  }
}
