'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { content } from '@/content';
import { createAmbientBed, type AmbientBed } from '@/lib/ambient-music';

/**
 * مفتاح الموسيقى.
 *
 * صامت افتراضيًا ولا يعمل من تلقاء نفسه أبدًا — التشغيل بلمسة منها فقط.
 * يجرّب أولًا الملف في public/audio/، وإن لم يوجد يشغّل النغمة المولّدة.
 */
export function AudioToggle() {
  const [playing, setPlaying] = useState(false);
  const elementRef = useRef<HTMLAudioElement | null>(null);
  const bedRef = useRef<AmbientBed | null>(null);

  // تنظيف عند مغادرة الصفحة
  useEffect(() => {
    const bed = bedRef;
    const element = elementRef;
    return () => {
      bed.current?.stop();
      element.current?.pause();
    };
  }, []);

  const startGenerated = useCallback(async () => {
    bedRef.current ??= createAmbientBed();
    await bedRef.current.start();
  }, []);

  const toggle = useCallback(async () => {
    if (playing) {
      elementRef.current?.pause();
      bedRef.current?.stop();
      bedRef.current = null;
      setPlaying(false);
      return;
    }

    const element = elementRef.current;

    if (element) {
      try {
        element.volume = 0.45;
        element.loop = true;

        // مهلة قصيرة: لو تعطّل الملف بلا رفض صريح لا نترك الزرّ معلّقًا
        await Promise.race([
          element.play(),
          new Promise((_, reject) => window.setTimeout(reject, 1500)),
        ]);

        setPlaying(true);
        return;
      } catch {
        // الملف غير موجود أو تعذّر تشغيله — ننتقل إلى النغمة المولّدة
        element.pause();
      }
    }

    await startGenerated();
    setPlaying(true);
  }, [playing, startGenerated]);

  const label = playing ? content.audio.disable : content.audio.enable;

  return (
    <>
      {/* preload="none" حتى لا يُطلب الملف إطلاقًا قبل أن تطلبه هي */}
      <audio ref={elementRef} src={content.audio.src} preload="none" />

      <button
        type="button"
        onClick={() => void toggle()}
        aria-label={label}
        title={label}
        aria-pressed={playing}
        className="bb-touch fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-[max(1rem,env(safe-area-inset-right))] z-50 inline-flex items-center justify-center rounded-full border border-[var(--bb-hairline-strong)] bg-bb-surface/80 text-bb-text-muted backdrop-blur-md transition-colors duration-300 hover:text-bb-text"
      >
        <SoundWaves active={playing} />
      </button>
    </>
  );
}

/** أيقونة متماثلة أفقيًا — لا تحتاج إلى عكس في التخطيط العربي */
function SoundWaves({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5">
      {[0, 1, 2, 3].map((index) => {
        const height = [5, 10, 7, 12][index];
        return (
          <rect
            key={index}
            x={3 + index * 4}
            y={10 - height / 2}
            width="2"
            height={height}
            rx="1"
            fill="currentColor"
            opacity={active ? 1 : 0.5}
            className={active ? 'bb-drift' : undefined}
            style={active ? { animationDelay: `${index * 160}ms` } : undefined}
          />
        );
      })}
      {!active ? (
        <path
          d="M2 18 18 2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
      ) : null}
    </svg>
  );
}
