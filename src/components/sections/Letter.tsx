import { content } from '@/content';
import { Photo } from '@/components/media/Photo';
import { Appear } from '@/components/motion/Appear';
import { Words } from '@/components/motion/Words';
import { Ornament } from '@/components/ui/Primitives';
import { BerryGlow } from '@/components/chrome/Atmosphere';

/**
 * الرسالة الأخيرة — لا أزرار بعدها ولا شيء يطلب منها فعل شيء.
 * كلها داخل إطارٍ واحد، كأنها ورقةٌ موضوعة على الطاولة. تنتهي الصفحة هنا وتهدأ.
 */
export function Letter() {
  const { eyebrow, heading, paragraphs, signature, photo } = content.letter;

  return (
    <section
      id="letter"
      className="bb-section bb-ground-rise bb-safe-bottom relative"
      aria-labelledby="letter-heading"
    >
      <BerryGlow
        size="38rem"
        opacity={0.12}
        className="bb-breathe start-1/2 top-16 -translate-x-1/2"
      />

      <div className="bb-container relative">
        <Appear blur={9} rise={32}>
          <article className="bb-frame mx-auto max-w-2xl px-6 py-12 sm:px-12 sm:py-16">
            <div className="flex flex-col items-center gap-9 text-center">
              <span className="text-sm font-medium text-bb-bloom">{eyebrow}</span>

              <h2
                id="letter-heading"
                className="bb-gradient-text font-display text-[clamp(1.8rem,6vw,2.75rem)] font-extrabold leading-[1.25]"
              >
                <Words text={heading} />
              </h2>

              <Ornament />

              {/* الرسمة — الصورة الوحيدة المرسومة باليد في الموقع */}
              <div className="relative w-full max-w-[15rem]">
                <BerryGlow
                  size="18rem"
                  opacity={0.22}
                  className="start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
                <Photo
                  photo={photo}
                  ratio={3 / 4}
                  className="bb-hairline relative"
                  sizes="(min-width: 640px) 15rem, 58vw"
                />
              </div>

              <div className="flex flex-col gap-6">
                {paragraphs.map((paragraph, index) =>
                  index === 0 ? (
                    <p key={paragraph} className="font-display text-2xl font-bold text-bb-frost">
                      {paragraph}
                    </p>
                  ) : (
                    <p
                      key={paragraph}
                      className="mx-auto max-w-[44ch] leading-[2.05] text-bb-text-muted"
                    >
                      {paragraph}
                    </p>
                  ),
                )}
              </div>

              <span aria-hidden="true" className="bb-rule w-full max-w-[16rem]" />

              <p className="font-display text-lg font-bold text-bb-frost">{signature}</p>
            </div>
          </article>
        </Appear>
      </div>
    </section>
  );
}
