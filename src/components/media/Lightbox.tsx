'use client';

import Image from 'next/image';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { content } from '@/content';
import { useScrollLock } from '@/lib/use-scroll-lock';

export interface LightboxItem {
  slug: string;
  alt: string;
  base: string;
  blurDataURL: string;
  aspectRatio: number;
}

const LightboxContext = createContext<((index: number) => void) | null>(null);

/** مسافة السحب بالبكسل التي تُعدّ تنقّلًا مقصودًا */
const SWIPE_THRESHOLD = 55;

/**
 * يستقبل بطاقات المعرض كـ children وهي مُصيَّرة على الخادم بالكامل،
 * فلا يصل المتصفّح إلا منطق العارض نفسه.
 */
export function LightboxProvider({
  items,
  children,
}: {
  items: LightboxItem[];
  children: ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const isOpen = index !== null;

  const open = useCallback((next: number) => {
    lastTrigger.current = document.activeElement as HTMLElement | null;
    setIndex(next);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    // إعادة التركيز إلى الصورة التي فُتحت منها النافذة
    lastTrigger.current?.focus();
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setIndex((current) => {
        if (current === null) return current;
        return (current + direction + items.length) % items.length;
      });
    },
    [items.length],
  );

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {isOpen ? (
          <LightboxDialog
            items={items}
            index={index}
            onClose={close}
            onStep={step}
          />
        ) : null}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}

/** زرّ رفيع يلفّ كل بطاقة صورة في الشبكة */
export function LightboxTrigger({ index, children }: { index: number; children: ReactNode }) {
  const open = useContext(LightboxContext);

  return (
    <button
      type="button"
      onClick={() => open?.(index)}
      aria-label={content.gallery.ui.open}
      className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-bb)] transition-shadow duration-700 ease-[var(--ease-bb)] hover:shadow-[0_26px_70px_-30px_var(--bb-berry-lit)]"
    >
      {children}

      {/* تعتيم متدرّج من الأسفل + أيقونة تكبير تطلع مع المرور */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-bb)] bg-gradient-to-t from-bb-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 end-3 flex size-8 translate-y-2 items-center justify-center rounded-full border border-[var(--bb-hairline-strong)] bg-bb-ink/70 text-bb-frost opacity-0 backdrop-blur-sm transition-all duration-500 ease-[var(--ease-bb)] group-hover:translate-y-0 group-hover:opacity-100"
      >
        <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
          <path
            d="M6 2H2v4M10 14h4v-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

function LightboxDialog({
  items,
  index,
  onClose,
  onStep,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
}) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragStart = useRef<number | null>(null);
  const item = items[index];
  const ui = content.gallery.ui;

  useScrollLock(true);

  // التركيز يبدأ من زر الإغلاق
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      // اتجاه معكوس لأن القراءة من اليمين إلى اليسار:
      // التالي يقع على اليسار، والسابق على اليمين.
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onStep(1);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onStep(-1);
        return;
      }

      // حبس التركيز داخل النافذة
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, onStep]);

  const counter = useMemo(() => ui.counter(index + 1, items.length), [ui, index, items.length]);

  if (!item) return null;

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={ui.dialogLabel}
      className="fixed inset-0 z-[70] flex flex-col overscroll-contain bg-bb-ink/92 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.28 }}
      onPointerDown={(event) => {
        dragStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (dragStart.current === null) return;
        const delta = event.clientX - dragStart.current;
        dragStart.current = null;

        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        // السحب نحو اليمين يقدّم الشريط في اتجاه القراءة العربية
        onStep(delta > 0 ? 1 : -1);
      }}
    >
      <header className="bb-safe-top bb-safe-x flex items-center justify-between gap-4 py-4">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={ui.close}
          className="bb-touch inline-flex items-center justify-center rounded-full border border-[var(--bb-hairline-strong)] bg-bb-surface/70 px-4 text-sm text-bb-text transition-colors hover:bg-bb-surface-2"
        >
          {ui.close}
        </button>
        <span className="text-sm tabular-nums text-bb-text-muted" aria-live="polite">
          {counter}
        </span>
      </header>

      <div className="relative flex flex-1 items-center justify-center px-3 pb-3">
        <AnimatePresence mode="wait">
          <motion.figure
            key={item.slug}
            className="relative flex max-h-full w-full max-w-4xl items-center justify-center"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative max-h-[72vh] w-full overflow-hidden rounded-[var(--radius-bb-lg)]"
              style={{ aspectRatio: item.aspectRatio }}
            >
              <Image
                src={item.base}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                placeholder="blur"
                blurDataURL={item.blurDataURL}
                className="object-contain"
                draggable={false}
              />
            </div>
          </motion.figure>
        </AnimatePresence>
      </div>

      <nav
        className="bb-safe-bottom bb-safe-x flex items-center justify-center gap-4 pb-5"
        aria-label={ui.dialogLabel}
      >
        {/* السهم المتّجه يمينًا يعود إلى الخلف في التخطيط العربي */}
        <ArrowButton label={ui.previous} onClick={() => onStep(-1)} direction="previous" />
        <p className="max-w-[34ch] px-2 text-center text-sm text-bb-text-muted">{item.alt}</p>
        <ArrowButton label={ui.next} onClick={() => onStep(1)} direction="next" />
      </nav>

    </motion.div>
  );
}

function ArrowButton({
  label,
  onClick,
  direction,
}: {
  label: string;
  onClick: () => void;
  direction: 'next' | 'previous';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="bb-touch inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--bb-hairline-strong)] bg-bb-surface/70 text-bb-text transition-colors hover:bg-bb-surface-2"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-5">
        <path
          d={direction === 'next' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
