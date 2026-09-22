'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

export interface GiftPhotoAsset {
  base: string;
  alt: string;
  blurDataURL: string;
  aspectRatio: number;
}

/**
 * الهدية نفسها.
 *
 * الصورة بخلفية شفّافة، فتطفو مباشرة على العتمة بلا إطار ولا مستطيل أبيض.
 * خلفها هالة بلون الزغب تضيئها من الخلف — وهي أول ظهور للمعدن الفضّي
 * في الموقع كله، بعد أربعة أقسام لم ترَ فيها عينها أي لون محايد.
 */
export function GiftDevice({
  photo,
  drawn,
  reduceMotion,
}: {
  photo: GiftPhotoAsset | null;
  drawn: boolean;
  reduceMotion: boolean;
}) {
  if (!photo) return null;

  return (
    <div className="relative flex w-full justify-center">
      {/* الهالة تسبق الصورة بقليل، فيبدو الضوء كأنه يكشفها */}
      <motion.div
        aria-hidden="true"
        className="bb-bloom-glow start-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--bb-frost) 60%, transparent) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={drawn ? { opacity: 0.32, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ duration: reduceMotion ? 0.35 : 1.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="relative w-[clamp(13rem,58vw,19rem)] overflow-hidden"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 22 }}
        animate={
          drawn
            ? reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
            : reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.86, y: 22 }
        }
        transition={{ duration: reduceMotion ? 0.4 : 1.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative w-full" style={{ aspectRatio: photo.aspectRatio }}>
          <Image
            src={photo.base}
            alt={photo.alt}
            fill
            sizes="(min-width: 640px) 19rem, 58vw"
            placeholder="blur"
            blurDataURL={photo.blurDataURL}
            className="object-contain"
            style={{ filter: 'drop-shadow(0 30px 60px rgba(10, 9, 24, 0.75))' }}
            draggable={false}
          />
        </div>

        {/* لمعة تمرّ مرّة واحدة بعد استقرار الصورة */}
        {drawn && !reduceMotion ? (
          <span
            aria-hidden="true"
            className="bb-sheen pointer-events-none absolute inset-y-0 start-0 w-1/3"
            style={{
              background:
                'linear-gradient(90deg, transparent, color-mix(in oklab, var(--bb-frost) 40%, transparent), transparent)',
              animationDelay: '900ms',
            }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
