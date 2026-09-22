import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Words } from '@/components/motion/Words';

/**
 * زخرفة فاصلة: معيّنٌ صغير بين خطّين يتلاشيان.
 * تتكرّر تحت كل ترويسة في الموقع، فتصير علامة الإيقاع التي تربط الأقسام.
 */
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="block h-px w-12 bg-gradient-to-l from-transparent to-[var(--bb-hairline-strong)] sm:w-20" />
      <svg viewBox="0 0 24 24" fill="none" className="size-3 shrink-0 text-bb-bloom">
        <path d="M12 1.5 16 12l-4 10.5L8 12z" fill="currentColor" opacity="0.9" />
        <path d="M1.5 12 12 8l10.5 4L12 16z" fill="currentColor" opacity="0.45" />
      </svg>
      <span className="block h-px w-12 bg-gradient-to-r from-transparent to-[var(--bb-hairline-strong)] sm:w-20" />
    </span>
  );
}

/**
 * ترويسة القسم — متناظرة دائمًا ومتطابقة في كل الأقسام.
 * هذا التكرار المتعمّد هو ما يجعل الصفحة تبدو مرتّبة لا مجمّعة.
 */
export function SectionHeading({
  eyebrow,
  heading,
  note,
}: {
  eyebrow: string;
  heading: string;
  note?: string;
}) {
  return (
    <header className="flex flex-col items-center gap-5 text-center">
      <span className="text-sm font-medium text-bb-bloom">{eyebrow}</span>

      <Ornament />

      <h2 className="bb-gradient-text max-w-[16ch] font-display text-[clamp(1.9rem,6vw,3.25rem)] font-extrabold leading-[1.25]">
        <Words text={heading} />
      </h2>

      {note ? (
        <p className="max-w-[46ch] text-[0.95rem] leading-[1.95] text-bb-text-muted">{note}</p>
      ) : null}
    </header>
  );
}

/** زر أساسي — مساحة اللمس لا تقلّ عن 44px، ولمعة تعبره عند المرور */
export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'quiet';
}) {
  const base =
    'bb-touch group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 py-3.5 font-display font-bold transition-all duration-500 ease-[var(--ease-bb)] active:scale-[0.98] disabled:opacity-50';

  const skin =
    variant === 'primary'
      ? 'bg-bb-berry text-bb-text shadow-[0_16px_50px_-18px_var(--bb-berry-lit)] hover:bg-bb-berry-lit'
      : 'border border-[var(--bb-hairline-strong)] bg-bb-surface/40 text-bb-text-muted backdrop-blur-sm hover:bg-bb-surface-2 hover:text-bb-text';

  return (
    <button className={`${base} ${skin} ${className}`} {...rest}>
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
      {variant === 'primary' ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 -start-full w-1/2 skew-x-[-18deg] bg-white/20 transition-all duration-700 ease-[var(--ease-bb)] group-hover:start-full"
        />
      ) : null}
    </button>
  );
}

/** شارة صغيرة — التواريخ وما شابهها */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--bb-hairline)] bg-bb-surface/50 px-4 py-1.5 text-sm font-medium text-bb-bloom backdrop-blur-sm">
      {children}
    </span>
  );
}
