'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { content } from '@/content';
import { GiftDevice, type GiftPhotoAsset } from './GiftDevice';

/**
 * لحظة الكشف — الذروة.
 *
 * مسرحيّة لا وميض: الشاشة تعتم، ثم تنفتح أشعّة من الأعلى ويتضخّم التوهّج،
 * ثم تنقلب البطاقة، ثم **صمت لثانية ونصف**، ثم تظهر الهدية.
 * الوقفة قبل الهدية هي الحيلة كلها؛ من دونها يصير الكشف إشعارًا لا مفاجأة.
 */

/** لحظات المسرح بالمللي ثانية */
const STAGE_MARKS = [0, 900, 1800, 3300, 4600, 5600] as const;
const REDUCED_MARKS = [0, 150, 400, 700, 1000, 1250] as const;

const enum Stage {
  Dim = 0,
  Bloom = 1,
  Greeting = 2,
  Silence = 3,
  Device = 4,
  Rest = 5,
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({ giftPhoto }: { giftPhoto: GiftPhotoAsset | null }) {
  const reduceMotion = Boolean(useReducedMotion());
  const [stage, setStage] = useState<number>(Stage.Dim);
  const { building, greeting, product, color, storage, footnote, continue: continueCue } =
    content.reveal;

  useEffect(() => {
    const marks = reduceMotion ? REDUCED_MARKS : STAGE_MARKS;
    const timers = marks.map((delay, index) =>
      window.setTimeout(() => setStage((current) => Math.max(current, index)), delay),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [reduceMotion]);

  const confetti = useMemo(() => buildConfetti(), []);

  return (
    <section
      id="reveal"
      className="bb-ground-ink relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 py-24"
      aria-labelledby="reveal-greeting"
    >
      {/* أشعّة تنفتح من الأعلى — تظهر مرّة واحدة في الموقع كله */}
      {stage >= Stage.Bloom && !reduceMotion ? <div className="bb-rays" aria-hidden="true" /> : null}

      {/* التوهّج التوتيّ يتضخّم من المركز */}
      <motion.div
        aria-hidden="true"
        className="bb-bloom-glow start-1/2 top-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={stage >= Stage.Bloom ? { opacity: 0.42, scale: 1 } : { opacity: 0, scale: 0.4 }}
        transition={{ duration: reduceMotion ? 0.3 : 1.8, ease: EASE }}
      />

      {/* قصاصات بلون الزغب */}
      {stage >= Stage.Bloom && !reduceMotion ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="bb-confetti"
              style={{
                insetInlineStart: `${piece.start}%`,
                opacity: piece.opacity,
                ['--bb-drift-x' as string]: `${piece.drift}px`,
                ['--bb-spin' as string]: `${piece.spin}deg`,
                ['--bb-duration' as string]: `${piece.duration}s`,
                ['--bb-delay' as string]: `${piece.delay}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative flex w-full max-w-lg flex-col items-center gap-9 text-center">
        <motion.p
          className="absolute -top-12 text-sm text-bb-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage < Stage.Greeting ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          aria-live="polite"
        >
          {building}
        </motion.p>

        {/* البطاقة تنفتح */}
        <motion.div
          className="w-full"
          style={{ perspective: '1400px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= Stage.Greeting ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="bb-frame px-7 py-12"
            initial={reduceMotion ? { opacity: 0 } : { rotateY: -96, opacity: 0 }}
            animate={
              stage >= Stage.Greeting
                ? reduceMotion
                  ? { opacity: 1 }
                  : { rotateY: 0, opacity: 1 }
                : undefined
            }
            transition={{ duration: reduceMotion ? 0.4 : 1.2, ease: EASE }}
            style={{ transformOrigin: 'center' }}
          >
            <h2
              id="reveal-greeting"
              className="bb-gradient-text font-display text-[clamp(1.9rem,8vw,2.9rem)] font-extrabold leading-[1.25]"
            >
              {greeting}
            </h2>
          </motion.div>
        </motion.div>

        {/* الهدية — تظهر بعد الصمت */}
        <GiftDevice photo={giftPhoto} drawn={stage >= Stage.Device} reduceMotion={reduceMotion} />

        {/* اسم الهدية ومواصفاتها */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          animate={
            stage >= Stage.Device ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 18 }
          }
          transition={{ duration: reduceMotion ? 0.4 : 1, delay: reduceMotion ? 0 : 0.7, ease: EASE }}
        >
          <p className="font-display text-[clamp(1.35rem,6vw,2rem)] font-bold text-bb-text">
            {product}
          </p>

          <p className="flex items-center gap-3 rounded-full border border-[var(--bb-hairline-strong)] bg-bb-surface/40 px-5 py-2 text-lg font-medium text-bb-silver backdrop-blur-sm">
            <span>{color}</span>
            <span aria-hidden="true" className="size-1 rounded-full bg-bb-text-muted/60" />
            <span className="tabular-nums">{storage}</span>
          </p>
        </motion.div>

        {/* السطر الأخير ثم إشارة هادئة إلى الرسالة */}
        <motion.div
          className="flex flex-col items-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= Stage.Rest ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0.4 : 1.2, ease: EASE }}
        >
          <p className="max-w-[34ch] text-balance text-sm text-bb-text-muted">{footnote}</p>

          <span className="flex flex-col items-center gap-2 text-xs text-bb-bloom/70">
            {continueCue}
            <svg className="bb-drift size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 2v11m0 0 4-4m-4 4-4-4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </motion.div>
      </div>
    </section>
  );
}

interface ConfettiPiece {
  id: number;
  start: number;
  drift: number;
  spin: number;
  duration: number;
  delay: number;
  opacity: number;
}

/** قصاصات قليلة ومتفرّقة — الهدف لمعة لا احتفال صاخب */
function buildConfetti(): ConfettiPiece[] {
  return Array.from({ length: 30 }, (_, id) => ({
    id,
    start: Math.random() * 100,
    drift: (Math.random() - 0.5) * 150,
    spin: 180 + Math.random() * 540,
    duration: 3.6 + Math.random() * 2.6,
    delay: Math.random() * 2,
    opacity: 0.45 + Math.random() * 0.45,
  }));
}
