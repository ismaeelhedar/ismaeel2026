import type { Chapter } from '@/content';
import { content } from '@/content';
import { Photo } from '@/components/media/Photo';
import { Appear } from '@/components/motion/Appear';
import { Words } from '@/components/motion/Words';
import { SectionHeading } from '@/components/ui/Primitives';

/**
 * حكايتنا — مسارٌ زمني حول خطٍّ رأسي واحد.
 *
 * كل فصل عقدةٌ على الخطّ وبطاقةٌ بإطار مزدوج. على الشاشات الكبيرة يتناوب
 * الفصلان حول الخطّ في المنتصف، وعلى الجوّال ينزل الخطّ على الحافة وتصطفّ
 * البطاقات كلها إلى جانبه. لا إزاحات ولا تراكب — كل شيء على شبكة واحدة.
 */
export function Story() {
  const { eyebrow, heading, note, chapters } = content.story;

  return (
    <section id="story" className="bb-section bb-translucent scroll-mt-2" aria-labelledby="story-heading">
      <div className="bb-container-wide flex flex-col gap-16 sm:gap-24">
        <Appear blur={8} rise={30}>
          <div id="story-heading">
            <SectionHeading eyebrow={eyebrow} heading={heading} note={note} />
          </div>
        </Appear>

        <div className="relative">
          {/* الخطّ الرأسي: على الحافة في الجوّال، وفي المنتصف على الشاشات الكبيرة */}
          <span aria-hidden="true" className="bb-spine start-4 lg:start-1/2" />

          <ol className="flex flex-col gap-14 sm:gap-20">
            {chapters.map((chapter, index) => (
              <ChapterItem
                key={chapter.id}
                chapter={chapter}
                index={index}
                flipped={index % 2 === 1}
                leadPriority={index === 0}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ChapterItem({
  chapter,
  index,
  flipped,
  leadPriority,
}: {
  chapter: Chapter;
  index: number;
  flipped: boolean;
  leadPriority: boolean;
}) {
  const [lead, ...rest] = chapter.photos;
  const number = String(index + 1).padStart(2, '0');

  return (
    <li className="relative ps-12 lg:ps-0">
      {/* عقدة المسار — معيّن صغير يجلس تمامًا على الخطّ */}
      <span
        aria-hidden="true"
        className="absolute top-9 start-[calc(1rem-5.5px)] block size-[11px] rotate-45 border border-bb-bloom/70 bg-bb-ink lg:start-[calc(50%-5.5px)]"
      />

      <Appear
        blur={7}
        rise={30}
        className={`lg:w-[calc(50%-3.5rem)] ${flipped ? 'lg:ms-auto' : ''}`}
      >
        <article className="bb-frame p-5 sm:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-bb-bloom">{chapter.date}</span>
              <span
                aria-hidden="true"
                className="font-display text-sm font-bold tabular-nums text-bb-text-muted/45"
              >
                {number}
              </span>
            </div>

            <span aria-hidden="true" className="bb-rule" />

            <h3 className="font-display text-[clamp(1.35rem,4.2vw,1.9rem)] font-bold leading-[1.3] text-bb-text">
              <Words text={chapter.title} base={100} />
            </h3>

            <p className="leading-[2] text-bb-text-muted">{chapter.body}</p>

            {/* شبكة الصور: كبيرة فوق، واثنتان متساويتان تحتها */}
            <div className="mt-1 flex flex-col gap-2.5">
              {lead ? (
                <Photo
                  photo={lead}
                  ratio={16 / 11}
                  priority={leadPriority}
                  className="bb-hairline"
                  sizes="(min-width: 1024px) 32vw, calc(100vw - 5.5rem)"
                />
              ) : null}

              {rest.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {rest.map((photo) => (
                    <Photo
                      key={photo.slug}
                      photo={photo}
                      ratio={1}
                      className="bb-hairline"
                      sizes="(min-width: 1024px) 16vw, calc(50vw - 3.25rem)"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </Appear>
    </li>
  );
}
