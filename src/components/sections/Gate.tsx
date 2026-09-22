'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { Game, type GameCardAsset } from './Game';
import { Reveal } from './Reveal';
import type { GiftPhotoAsset } from './GiftDevice';

/**
 * البوّابة.
 *
 * كل ما بعد اللعبة غير موجود في الصفحة أصلًا حتى تفوز — لا مخفيّ بـ CSS
 * ولا مطويّ، بل غير مُركَّب إطلاقًا. المعنى: لا يمكن أن تمرّر إصبعها إلى
 * أسفل الصفحة فتحرق المفاجأة على نفسها.
 */
export function Gate({
  gameAssets,
  giftPhoto,
  letter,
}: {
  gameAssets: GameCardAsset[];
  giftPhoto: GiftPhotoAsset | null;
  letter: ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!unlocked) return;

    // ننتظر إطارًا واحدًا حتى يُرسم القسم قبل الانتقال إليه
    const frame = window.requestAnimationFrame(() => {
      revealRef.current?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [unlocked, reduceMotion]);

  return (
    <>
      <Game assets={gameAssets} onComplete={() => setUnlocked(true)} />

      {unlocked ? (
        <div ref={revealRef}>
          <Reveal giftPhoto={giftPhoto} />
          {letter}
        </div>
      ) : null}
    </>
  );
}
