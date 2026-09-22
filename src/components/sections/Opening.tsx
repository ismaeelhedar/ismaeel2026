import { content } from '@/content';
import { BerryGlow, Motes } from '@/components/chrome/Atmosphere';
import { Words } from '@/components/motion/Words';
import { Ornament } from '@/components/ui/Primitives';

/**
 * الافتتاح — بطاقة دعوة.
 *
 * إطارٌ مزدوج رفيع يحيط بالشاشة كلها، وكل شيء بداخله متمركز ومتناظر.
 * هذا الإطار وحده يرفع الإحساس من «صفحة ويب» إلى «بطاقة»، وهو أرخص
 * عنصر فخامة ممكن: خطّان وبعض الفراغ.
 *
 * مكوّن خادم بالكامل — كل الحركة CSS، وزرّ البدء رابط عادي.
 */
export function Opening() {
  const { whisper, displayName, lines, cta, scrollHint } = content.opening;
  const lastLine = 2400 + (lines.length - 1) * 420;

  return (
    <section
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-5 py-16"
      aria-labelledby="opening-name"
    >
      <Motes count={18} />

      <BerryGlow
        size="40rem"
        opacity={0.26}
        className="bb-breathe start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* الإطار المزدوج */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[var(--radius-bb-xl)] border border-[var(--bb-hairline-strong)] sm:inset-8"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1.45rem] rounded-[calc(var(--radius-bb-xl)-0.45rem)] border border-[var(--bb-hairline)] sm:inset-[2.45rem]"
      />

      <div className="relative flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <p className="bb-enter text-sm font-medium text-bb-bloom" style={{ animationDelay: '150ms' }}>
          {whisper}
        </p>

        {/* الاسم، وخلفه نسخة مضبّبة تشتعل كهالة بعد اكتمال الكشف */}
        <div className="relative px-2">
          <span
            aria-hidden="true"
            className="bb-name-ghost absolute inset-0 select-none font-display text-[clamp(2.75rem,14vw,5.75rem)] font-extrabold leading-[1.2] blur-[28px]"
          >
            {displayName}
          </span>

          <h1
            id="opening-name"
            className="bb-name relative font-display text-[clamp(2.75rem,14vw,5.75rem)] font-extrabold leading-[1.2]"
          >
            {displayName}
          </h1>
        </div>

        <div className="bb-enter" style={{ animationDelay: '2150ms' }}>
          <Ornament />
        </div>

        <div className="flex max-w-[36ch] flex-col gap-3">
          {lines.map((text, index) => (
            <p key={text} className="text-balance leading-[1.95] text-bb-text-muted">
              <Words text={text} base={2400 + index * 420} />
            </p>
          ))}
        </div>

        <a
          href="#story"
          className="bb-enter bb-touch group relative mt-4 inline-flex items-center justify-center overflow-hidden rounded-full bg-bb-berry px-12 py-4 font-display text-lg font-bold text-bb-text shadow-[0_18px_60px_-18px_var(--bb-berry-lit)] transition-all duration-500 ease-[var(--ease-bb)] hover:bg-bb-berry-lit"
          style={{ animationDelay: `${lastLine + 1400}ms` }}
        >
          <span className="relative z-10">{cta}</span>
          <span
            aria-hidden="true"
            className="absolute inset-y-0 -start-full w-1/2 skew-x-[-18deg] bg-white/20 transition-all duration-700 ease-[var(--ease-bb)] group-hover:start-full"
          />
        </a>
      </div>

      <div
        className="bb-enter bb-safe-bottom absolute inset-x-0 bottom-12 flex flex-col items-center gap-2"
        style={{ animationDelay: `${lastLine + 1900}ms` }}
      >
        <span className="text-xs text-bb-text-muted/70">{scrollHint}</span>
        <svg className="bb-drift size-4 text-bb-bloom/60" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2v11m0 0 4-4m-4 4-4-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
