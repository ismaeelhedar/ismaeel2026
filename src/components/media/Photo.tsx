import Image from 'next/image';
import type { PhotoRef } from '@/content';
import { getPhoto, objectPositionFor } from '@/lib/photos';
import { PhotoMissing } from './PhotoMissing';

interface PhotoProps {
  photo: PhotoRef;
  /** مقاسات مضبوطة على تخطيط يبدأ من 390px */
  sizes: string;
  /** نسبة عرض/ارتفاع للإطار — الافتراضي نسبة الصورة الأصلية (بلا قصّ) */
  ratio?: number;
  /** الصورة الأولى فقط فوق الطيّة */
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  rounded?: boolean;
}

/**
 * مكوّن خادم (Server Component) — لا يُرسل أي JavaScript إلى المتصفّح.
 *
 * يضع الصورة داخل إطار بنسبة ثابتة، فلا يحدث أي قفز في التخطيط (CLS ≈ 0)
 * حتى قبل تحميل الصورة، لأن المساحة محجوزة سلفًا.
 */
export function Photo({
  photo,
  sizes,
  ratio,
  priority = false,
  className = '',
  imageClassName = '',
  rounded = true,
}: PhotoProps) {
  const asset = getPhoto(photo.slug);
  const radius = rounded ? 'rounded-[var(--radius-bb)]' : '';

  if (!asset) {
    return (
      <div
        className={`relative overflow-hidden ${radius} ${className}`}
        style={{ aspectRatio: ratio ?? 3 / 4 }}
      >
        <PhotoMissing label={photo.alt} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-bb-surface ${radius} ${className}`}
      style={{ aspectRatio: ratio ?? asset.aspectRatio }}
    >
      <Image
        src={asset.base}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        placeholder="blur"
        blurDataURL={asset.blurDataURL}
        className={`object-cover ${imageClassName}`}
        style={{ objectPosition: objectPositionFor(photo.focus) }}
      />
    </div>
  );
}
