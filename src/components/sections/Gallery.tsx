import { content } from '@/content';
import { getPhoto } from '@/lib/photos';
import { Photo } from '@/components/media/Photo';
import { Appear } from '@/components/motion/Appear';
import { SectionHeading } from '@/components/ui/Primitives';
import { LightboxProvider, LightboxTrigger, type LightboxItem } from '@/components/media/Lightbox';

/**
 * الألبوم — شبكة مربّعات متساوية تمامًا.
 *
 * تركنا الشبكة المتداخلة (masonry) عن قصد: الأطوال المتفاوتة تبدو حيّة لكنها
 * تبدو أيضًا غير مرتّبة. المربّع الواحد المتكرّر يعطي هدوءًا وانضباطًا،
 * والصور تُقصّ حول نقطة تركيزها فلا يضيع أحد من الإطار.
 */
export function Gallery() {
  const { eyebrow, heading, note, photos } = content.gallery;

  const available = photos.filter((photo) => getPhoto(photo.slug) !== null);

  const items: LightboxItem[] = available.map((photo) => {
    const asset = getPhoto(photo.slug)!;
    return {
      slug: photo.slug,
      alt: photo.alt,
      base: asset.base,
      blurDataURL: asset.blurDataURL,
      aspectRatio: asset.aspectRatio,
    };
  });

  return (
    <section id="gallery" className="bb-section bb-translucent" aria-labelledby="gallery-heading">
      <div className="bb-container-wide flex flex-col gap-14">
        <Appear blur={8} rise={30}>
          <div id="gallery-heading">
            <SectionHeading eyebrow={eyebrow} heading={heading} note={note} />
          </div>
        </Appear>

        <LightboxProvider items={items}>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {available.map((photo, index) => (
              <li key={photo.slug}>
                <Appear delay={Math.min(index, 8) * 50} scale={0.95} blur={7} rise={22}>
                  <LightboxTrigger index={index}>
                    <Photo
                      photo={photo}
                      ratio={1}
                      className="bb-hairline"
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw"
                      imageClassName="transition-transform duration-[900ms] ease-[var(--ease-bb)] group-hover:scale-[1.08]"
                    />
                  </LightboxTrigger>
                </Appear>
              </li>
            ))}
          </ul>
        </LightboxProvider>
      </div>
    </section>
  );
}
