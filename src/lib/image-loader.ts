/**
 * محمّل الصور المخصّص لـ next/image.
 *
 * يستقبل مسارًا بلا امتداد (مثل: /photos/opt/qasioun-night) ويُرجع
 * أقرب نسخة WebP بعرض مناسب. العروض هنا يجب أن تطابق:
 *   - WIDTHS في scripts/optimize-photos.mjs
 *   - deviceSizes / imageSizes في next.config.ts
 */

const WIDTHS = [240, 480, 960, 1600] as const;
const HAS_EXTENSION = /\.(webp|avif|jpe?g|png|gif|svg)$/i;

export default function blueberryImageLoader({ src, width }: { src: string; width: number }): string {
  // مسار بامتداد صريح (أو أصل غير محسَّن) يمرّ كما هو
  if (HAS_EXTENSION.test(src)) return src;

  const chosen = WIDTHS.find((candidate) => candidate >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${src}-${chosen}.webp`;
}
