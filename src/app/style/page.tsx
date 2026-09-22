import type { Metadata } from 'next';
import { content } from '@/content';
import { Photo } from '@/components/media/Photo';
import { BerryGlow } from '@/components/chrome/Atmosphere';
import { BlueberryMark } from '@/components/media/PhotoMissing';
import { Badge, Button, Ornament, SectionHeading } from '@/components/ui/Primitives';

export const metadata: Metadata = {
  title: 'الهوية البصرية — التوت البرّي',
  description: 'لوحة الألوان وسُلّم الخطوط والعناصر الأساسية في شاشة واحدة.',
  robots: { index: false, follow: false },
};

const PALETTE = [
  { token: '--bb-ink', hex: '#0A0918', use: 'خلفية الصفحة، الأعمق' },
  { token: '--bb-midnight', hex: '#12102B', use: 'خلفية الأقسام' },
  { token: '--bb-surface', hex: '#1C1840', use: 'البطاقات واللوحات' },
  { token: '--bb-surface-2', hex: '#272052', use: 'مرتفع / عند المرور' },
  { token: '--bb-berry', hex: '#4B3BA8', use: 'اللون الأساسي' },
  { token: '--bb-berry-lit', hex: '#6A56D4', use: 'الأساسي عند التفاعل' },
  { token: '--bb-bloom', hex: '#A99BF2', use: 'مساعد، روابط، حلقات التركيز' },
  { token: '--bb-frost', hex: '#D6CEFF', use: 'الزَغَب — للحظات النادرة' },
  { token: '--bb-text', hex: '#F2EFFF', use: 'النص الأساسي' },
  { token: '--bb-text-muted', hex: '#A69FCB', use: 'النص الثانوي' },
  { token: '--bb-silver', hex: '#D9DAE4', use: 'مرّة واحدة فقط: لحظة الكشف' },
];

const TYPE_SCALE = [
  {
    label: 'اسم الافتتاح · 800',
    className: 'font-display text-5xl font-extrabold',
    sample: content.opening.displayName,
  },
  {
    label: 'عنوان قسم · 800',
    className: 'font-display text-4xl font-extrabold',
    sample: content.story.heading,
  },
  {
    label: 'عنوان فصل · 700',
    className: 'font-display text-2xl font-bold',
    sample: content.story.chapters[2].title,
  },
  {
    label: 'تأكيد خفيف · 500',
    className: 'text-base font-medium text-bb-bloom',
    sample: content.story.chapters[2].date,
  },
  {
    label: 'نص أساسي · 400',
    className: 'leading-[2] text-bb-text-muted',
    sample: content.story.chapters[2].body,
  },
  {
    label: 'أرقام',
    className: 'font-display text-2xl font-bold tabular-nums',
    sample: '1 2 3 4 5 · 256GB · 2025',
  },
];

export default function StylePage() {
  return (
    <main className="bb-section min-h-[100dvh]">
      <div className="bb-container-wide flex flex-col gap-20">
        <header className="flex flex-col items-center gap-5 text-center">
          <span className="text-sm font-medium text-bb-bloom">لوحة الهوية</span>
          <Ornament />
          <h1 className="bb-gradient-text font-display text-4xl font-extrabold">التوت البرّي</h1>
          <p className="max-w-[52ch] text-bb-text-muted">
            لبٌّ بنفسجي عميق، وقشرة تقارب السواد، وزَغَب فضّي شاحب على السطح. هذه الصفحة للمعاينة
            فقط وليست جزءًا من الرحلة.
          </p>
        </header>

        {/* الألوان */}
        <section className="flex flex-col gap-8">
          <SectionHeading eyebrow="الألوان" heading="أحد عشر لونًا، لا غير" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {PALETTE.map((entry) => (
              <li key={entry.token} className="overflow-hidden rounded-[var(--radius-bb)] bb-hairline">
                <div className="h-20 w-full" style={{ backgroundColor: entry.hex }} />
                <div className="flex flex-col gap-1 bg-bb-surface px-3 py-3">
                  <code className="text-xs text-bb-text">{entry.token}</code>
                  <code className="text-xs tabular-nums text-bb-bloom">{entry.hex}</code>
                  <span className="text-xs leading-relaxed text-bb-text-muted">{entry.use}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* الخطوط */}
        <section className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="الخطوط"
            heading="تجوّل وحده"
            note="أربعة أوزان: 400 و500 و700 و800. ارتفاع السطر 1.85 للعربية، وبلا أي تباعد بين الأحرف حتى لا ينكسر اتصالها."
          />
          <div className="flex flex-col divide-y divide-[var(--bb-hairline)]">
            {TYPE_SCALE.map((entry) => (
              <div key={entry.label} className="grid gap-3 py-6 sm:grid-cols-[11rem_1fr]">
                <span className="pt-1 text-xs text-bb-bloom">{entry.label}</span>
                <p className={entry.className}>{entry.sample}</p>
              </div>
            ))}
          </div>
        </section>

        {/* العناصر */}
        <section className="flex flex-col gap-8">
          <SectionHeading eyebrow="العناصر" heading="المكوّنات الأساسية" />

          <div className="grid gap-5 sm:grid-cols-2">
            <Panel title="الإطار المزدوج">
              <div className="bb-frame p-6 text-sm text-bb-text-muted">
                حدٌّ خارجي، وحدٌّ داخلي أرفع يبعد عنه سبعة بكسلات. هذا العنصر وحده هو مصدر
                الإحساس بالفخامة في الموقع كله.
              </div>
            </Panel>

            <Panel title="اللوح الزجاجي">
              <div className="bb-glass p-6 text-sm text-bb-text-muted">
                ضبابٌ خلفي وحدٌّ واحد. يُستخدم للبطاقات الصغيرة والشارات.
              </div>
            </Panel>

            <Panel title="الأزرار">
              <div className="flex flex-wrap items-center gap-3">
                <Button>{content.opening.cta}</Button>
                <Button variant="quiet">{content.game.ui.restart}</Button>
              </div>
            </Panel>

            <Panel title="الشارات والفواصل">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-3">
                  <Badge>ربيع 2024</Badge>
                  <Badge>صيف 2025</Badge>
                </div>
                <span aria-hidden="true" className="bb-rule" />
                <Ornament />
              </div>
            </Panel>

            <Panel title="ظهر بطاقة اللعبة">
              <div className="flex gap-3">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className="relative flex aspect-[3/4] w-16 items-center justify-center overflow-hidden rounded-[var(--radius-bb)] bb-hairline bg-bb-surface"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 28% 22%, color-mix(in oklab, var(--bb-berry-lit) 80%, transparent) 0%, transparent 58%), radial-gradient(circle at 78% 84%, color-mix(in oklab, var(--bb-berry) 75%, transparent) 0%, transparent 62%)',
                      }}
                    />
                    <BlueberryMark className="relative size-7 opacity-90" />
                  </span>
                ))}
              </div>
            </Panel>

            <Panel title="التوهّج">
              <div className="relative h-28 overflow-hidden rounded-[var(--radius-bb)] bg-bb-ink">
                <BerryGlow
                  size="16rem"
                  opacity={0.45}
                  className="start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </Panel>

            <Panel title="إطار الصورة">
              <Photo
                photo={content.letter.photo}
                ratio={4 / 3}
                className="bb-hairline"
                sizes="(min-width: 640px) 20rem, 80vw"
              />
            </Panel>

            <Panel title="خانة العدّاد">
              <div className="bb-frame flex items-center justify-around p-5">
                {[
                  { value: '412', label: 'يوم' },
                  { value: '7', label: 'ساعة' },
                ].map((cell) => (
                  <span key={cell.label} className="flex flex-col items-center gap-1.5">
                    <span className="font-display text-3xl font-extrabold tabular-nums text-bb-frost">
                      {cell.value}
                    </span>
                    <span className="text-xs text-bb-text-muted">{cell.label}</span>
                  </span>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        {/* الوصول */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="الوصول"
            heading="حلقة التركيز"
            note="اضغط Tab للتنقّل — كل عنصر تفاعلي يُظهر حلقة بلون ‎--bb-bloom‎ بمساحة لمس لا تقلّ عن 44 بكسل."
          />
          <div className="flex flex-wrap justify-center gap-3">
            <Button>عنصر أول</Button>
            <Button variant="quiet">عنصر ثانٍ</Button>
            <a
              href="#"
              className="bb-touch inline-flex items-center rounded-full px-4 text-bb-bloom underline-offset-4 hover:underline"
            >
              رابط نصّي
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-bb-lg)] bb-hairline bg-bb-midnight/50 p-5">
      <h3 className="font-display text-sm font-bold text-bb-bloom">{title}</h3>
      {children}
    </section>
  );
}
