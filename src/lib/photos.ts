import manifest from '@/photos.json';
import type { FocalPoint } from '@/content';

/** مدخلة واحدة في src/photos.json كما يولّدها scripts/optimize-photos.mjs */
export interface PhotoAsset {
  slug: string;
  hash: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'landscape' | 'portrait';
  /** المسار الأساسي بلا عرض ولا امتداد — يكمله image-loader */
  base: string;
  variants: Record<string, string>;
  blurDataURL: string;
}

const photos = manifest.photos as unknown as Record<string, PhotoAsset>;

/** يُرجع بيانات الصورة، أو null إذا لم تُشغَّل أداة التحسين بعد */
export function getPhoto(slug: string): PhotoAsset | null {
  return photos[slug] ?? null;
}

/** يحوّل نقطة التركيز إلى قيمة object-position */
export function objectPositionFor(focus: FocalPoint = 'center'): string {
  switch (focus) {
    case 'top':
      return '50% 18%';
    case 'bottom':
      return '50% 82%';
    default:
      return '50% 50%';
  }
}
