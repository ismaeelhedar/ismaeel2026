'use client';

import { useEffect, useState } from 'react';
import { content } from '@/content';
import { Appear } from '@/components/motion/Appear';
import { SectionHeading } from '@/components/ui/Primitives';
import { BerryGlow } from '@/components/chrome/Atmosphere';

interface Elapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function elapsedSince(startMs: number, nowMs: number): Elapsed {
  const total = Math.max(0, Math.floor((nowMs - startMs) / 1000));

  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/**
 * عدّاد حيّ يعدّ منذ تاريخٍ واحد.
 *
 * لماذا يبدأ فارغًا؟ لأن الصفحة تُبنى مسبقًا، والوقت على الخادم ليس وقتها.
 * لو عرضنا رقمًا محسوبًا وقت البناء لظهر رقمٌ خاطئ للحظة ثم قفز — لذلك
 * تُحجز المساحة بالأصفار وتُملأ فور فتح الصفحة، فلا قفزة ولا رقم كاذب.
 */
export function Counter() {
  const { eyebrow, heading, note, since, sinceLabel, units } = content.counter;
  const [elapsed, setElapsed] = useState<Elapsed | null>(null);

  useEffect(() => {
    const startMs = new Date(since).getTime();
    if (Number.isNaN(startMs)) return;

    const tick = () => setElapsed(elapsedSince(startMs, Date.now()));
    tick();

    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [since]);

  const cells = [
    { label: units.days, value: elapsed?.days },
    { label: units.hours, value: elapsed?.hours },
    { label: units.minutes, value: elapsed?.minutes },
    { label: units.seconds, value: elapsed?.seconds },
  ];

  return (
    <section id="counter" className="bb-section relative" aria-labelledby="counter-heading">
      <BerryGlow
        size="34rem"
        opacity={0.16}
        className="bb-breathe start-1/2 top-1/3 -translate-x-1/2"
      />

      <div className="bb-container relative flex flex-col items-center gap-12">
        <Appear blur={8} rise={30}>
          <div id="counter-heading">
            <SectionHeading eyebrow={eyebrow} heading={heading} note={note} />
          </div>
        </Appear>

        <Appear delay={120} blur={8} rise={26} className="w-full">
          <div className="bb-frame mx-auto flex max-w-2xl flex-col gap-6 p-6 sm:gap-8 sm:p-9">
            <ul className="grid grid-cols-4 gap-2 sm:gap-5" aria-live="off">
              {cells.map((cell, index) => (
                <li key={cell.label} className="relative flex flex-col items-center gap-2">
                  {/* فاصل رفيع بين الخانات، بلا فاصل بعد الأخيرة */}
                  {index < cells.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-1 -start-1 w-px bg-[var(--bb-hairline)] sm:-start-2.5"
                    />
                  ) : null}

                  <span className="font-display text-[clamp(1.5rem,7vw,3rem)] font-extrabold tabular-nums leading-none text-bb-frost">
                    {cell.value === undefined ? '—' : cell.value.toLocaleString('en-US')}
                  </span>
                  <span className="text-[0.7rem] text-bb-text-muted sm:text-sm">{cell.label}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-3">
              <span aria-hidden="true" className="bb-rule w-full max-w-[14rem]" />
              <p className="text-sm text-bb-text-muted">
                منذ <span className="font-medium text-bb-bloom">{sinceLabel}</span>
              </p>
            </div>
          </div>
        </Appear>
      </div>
    </section>
  );
}
