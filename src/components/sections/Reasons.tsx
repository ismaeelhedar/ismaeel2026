import { content } from '@/content';
import { Appear } from '@/components/motion/Appear';
import { SectionHeading } from '@/components/ui/Primitives';

/**
 * أسباب — قائمة مرقّمة هادئة.
 *
 * كل سبب في سطره، ورقمه إلى جانبه بخطٍّ خفيف، وبينهما خطٌّ فاصل رفيع.
 * لا بطاقات ولا صناديق: هنا الفخامة في الفراغ والمحاذاة وحدهما.
 */
export function Reasons() {
  const { eyebrow, heading, note, items } = content.reasons;

  return (
    <section id="reasons" className="bb-section bb-translucent" aria-labelledby="reasons-heading">
      <div className="bb-container flex flex-col items-center gap-14">
        <Appear blur={8} rise={30}>
          <div id="reasons-heading">
            <SectionHeading eyebrow={eyebrow} heading={heading} note={note} />
          </div>
        </Appear>

        <ol className="flex w-full max-w-2xl flex-col">
          {items.map((reason, index) => (
            <Appear
              key={reason}
              as="li"
              delay={index * 90}
              blur={6}
              rise={22}
              className="group flex items-start gap-5 border-t border-[var(--bb-hairline)] py-5 first:border-t-0 sm:gap-7 sm:py-6"
            >
              <span
                aria-hidden="true"
                className="mt-1 font-display text-sm font-bold tabular-nums text-bb-bloom/70"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <p className="flex-1 text-[1.02rem] leading-[2] text-bb-text">{reason}</p>
            </Appear>
          ))}
        </ol>
      </div>
    </section>
  );
}
