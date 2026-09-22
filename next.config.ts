import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* إخراج ثابت بالكامل: npm run build ينتج مجلد out/ جاهز للنشر في أي مكان */
  output: 'export',
  trailingSlash: true,

  images: {
    /**
     * محمّل مخصّص بدل unoptimized: true.
     * السبب: مع unoptimized لا يولّد next/image أي srcset، فتُحمّل صورة 1600px
     * حتى للصور المصغّرة. المحمّل المخصّص يعمل مع output: 'export' تمامًا،
     * لكنه يبقي srcset الحقيقي مشيرًا إلى نسخ WebP التي ينتجها npm run photos.
     */
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    // يجب أن تطابق WIDTHS في scripts/optimize-photos.mjs
    deviceSizes: [480, 960, 1600],
    imageSizes: [240],
  },
};

export default nextConfig;
