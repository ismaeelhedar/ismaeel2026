import { content } from '@/content';

/**
 * بديل أنيق يظهر مكان أي صورة مفقودة — لا أيقونة مكسورة أبدًا.
 * يحدث هذا إذا أُضيف slug في content.ts قبل تشغيل npm run photos.
 */
export function PhotoMissing({ label }: { label?: string }) {
  return (
    <div
      className="flex size-full flex-col items-center justify-center gap-3 bg-bb-surface text-bb-text-muted"
      role="img"
      aria-label={label ?? content.photoMissing}
    >
      <BlueberryMark className="size-9 opacity-45" />
      <span className="px-4 text-center text-xs">{label ?? content.photoMissing}</span>
    </div>
  );
}

/** حبّة توت مرسومة — تُستخدم أيضًا كزخرفة في ظهر بطاقات اللعبة */
export function BlueberryMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="16" cy="17" r="11" fill="var(--bb-berry)" />
      <circle cx="16" cy="17" r="11" fill="url(#bb-mark-shade)" />
      <path
        d="M16 6.8c1.9 1.5 2.9 3.2 2.9 5.1 0 1.6-1 2.7-2.9 3.4-1.9-.7-2.9-1.8-2.9-3.4 0-1.9 1-3.6 2.9-5.1Z"
        fill="var(--bb-bloom)"
        opacity="0.55"
      />
      <circle cx="12.2" cy="13.4" r="2.1" fill="var(--bb-frost)" opacity="0.28" />
      <defs>
        <radialGradient id="bb-mark-shade" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="var(--bb-bloom)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--bb-ink)" stopOpacity="0.65" />
        </radialGradient>
      </defs>
    </svg>
  );
}
