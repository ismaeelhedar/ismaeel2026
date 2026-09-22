'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { content } from '@/content';
import { BlueberryMark } from '@/components/media/PhotoMissing';
import { BerryGlow } from '@/components/chrome/Atmosphere';
import { Appear } from '@/components/motion/Appear';
import { SectionHeading } from '@/components/ui/Primitives';

export interface GameCardAsset {
  slug: string;
  alt: string;
  base: string;
  blurDataURL: string;
}

interface Card {
  /** معرّف فريد للبطاقة الواحدة */
  id: string;
  /** معرّف الزوج — البطاقتان المتطابقتان تتشاركانه */
  pairId: string;
  asset: GameCardAsset;
}

/** بعد هذه المدّة من السكون نلمّح بلطف إلى زوج متطابق */
const IDLE_HINT_MS = 20_000;
const HINT_VISIBLE_MS = 4500;
/** البطاقتان غير المتطابقتين ترجعان بسرعة حتى لا تنتظر */
const FLIP_BACK_MS = 700;

/**
 * بذرة ثابتة للترتيب الأوّل.
 *
 * السبب: الصفحة تُبنى مسبقًا على الخادم، ولو خلطنا بـ Math.random أثناء
 * التصيير لاختلف ترتيب الخادم عن المتصفّح وانكسر الترطيب (hydration).
 * الترتيب الأوّل ثابت إذن، وزرّ «من جديد» يخلط خلطًا عشوائيًا حقيقيًا.
 */
const FIRST_DEAL_SEED = 0x5eed;

/** مولّد أرقام شبه عشوائي صغير وثابت النتيجة لنفس البذرة */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDeck(assets: GameCardAsset[], seed?: number): Card[] {
  const random = seed === undefined ? Math.random : seededRandom(seed);

  const deck = assets.flatMap((asset, index) => [
    { id: `${asset.slug}-a`, pairId: `pair-${index}`, asset },
    { id: `${asset.slug}-b`, pairId: `pair-${index}`, asset },
  ]);

  // خلط فيشر-ييتس
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

/**
 * لعبة مطابقة من صورنا — قصيرة وسهلة عن قصد.
 *
 * لا مؤقّت إطلاقًا ولا حدّ للمحاولات ولا حالة خسارة: أي بطاقة تصيبها
 * تبقى مكشوفة إلى آخر اللعبة، فالتقدّم لا يرجع إلى الوراء أبدًا.
 * وإذا توقّفت قليلًا يومض زوج متطابق بهدوء ليساعدها من دون أن يحلّها عنها.
 */
export function Game({ assets, onComplete }: { assets: GameCardAsset[]; onComplete: () => void }) {
  const reduceMotion = useReducedMotion();
  const { eyebrow, heading, intro, ui } = content.game;

  const [deck, setDeck] = useState<Card[]>(() => buildDeck(assets, FIRST_DEAL_SEED));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [hintPair, setHintPair] = useState<string | null>(null);
  const [settling, setSettling] = useState(false);

  const lastActionAt = useRef(0);
  const pending = useRef<number[]>([]);
  const completed = matched.length === assets.length;

  /** تنظيف أي مؤقّتات معلّقة عند تفكيك المكوّن */
  useEffect(() => {
    const timers = pending;
    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, []);

  const defer = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    pending.current.push(id);
  }, []);

  const reset = useCallback(() => {
    pending.current.forEach(window.clearTimeout);
    pending.current = [];
    setDeck(buildDeck(assets));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setHintPair(null);
    setSettling(false);
    lastActionAt.current = Date.now();
  }, [assets]);

  /** تلميح لطيف عند السكون الطويل */
  useEffect(() => {
    if (completed) return;

    const timer = window.setInterval(() => {
      if (lastActionAt.current === 0) return;
      if (Date.now() - lastActionAt.current < IDLE_HINT_MS) return;

      const candidate = deck.find((card) => !matched.includes(card.pairId));
      if (!candidate) return;

      lastActionAt.current = Date.now();
      setHintPair(candidate.pairId);
      window.setTimeout(() => setHintPair(null), HINT_VISIBLE_MS);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [completed, deck, matched]);

  /**
   * كل منطق اللعبة داخل معالج الضغط — لا تأثيرات جانبية تراقب الحالة،
   * فالمقارنة تحدث في اللحظة التي نملك فيها كل المعلومات.
   */
  const handleFlip = useCallback(
    (card: Card) => {
      if (matched.includes(card.pairId)) return;
      if (flipped.includes(card.id)) return;
      if (flipped.length >= 2) return;

      lastActionAt.current = Date.now();
      setHintPair(null);

      const next = [...flipped, card.id];
      setFlipped(next);

      if (next.length < 2) return;

      setMoves((value) => value + 1);

      const [first, second] = next.map((id) => deck.find((entry) => entry.id === id));
      if (!first || !second) return;

      if (first.pairId !== second.pairId) {
        defer(() => setFlipped([]), FLIP_BACK_MS);
        return;
      }

      const nextMatched = [...matched, first.pairId];
      setMatched(nextMatched);
      setFlipped([]);

      if (nextMatched.length === assets.length) {
        setSettling(true);
        defer(onComplete, reduceMotion ? 600 : 1400);
      }
    },
    [assets.length, deck, defer, flipped, matched, onComplete, reduceMotion],
  );

  /** عدّاد المحاولات وحده — لا وقت ولا ضغط */
  const progress = useMemo(
    () => `${matched.length} / ${assets.length}`,
    [matched.length, assets.length],
  );

  return (
    <section id="game" className="bb-section bb-translucent" aria-labelledby="game-heading">
      <BerryGlow size="34rem" opacity={0.16} className="start-1/2 top-1/3 -translate-x-1/2" />

      <div className="bb-container relative flex flex-col items-center gap-11">
        <Appear blur={8} rise={30}>
          <div id="game-heading">
            <SectionHeading eyebrow={eyebrow} heading={heading} note={intro} />
          </div>
        </Appear>

        <div className="flex items-center gap-3">
          <span className="bb-glass inline-flex items-baseline gap-2 rounded-full px-5 py-2 text-sm text-bb-text-muted">
            {ui.matched}
            <span className="font-display font-bold tabular-nums text-bb-frost">{progress}</span>
          </span>
          <span className="bb-glass inline-flex items-baseline gap-2 rounded-full px-5 py-2 text-sm text-bb-text-muted">
            {ui.moves}
            <span className="font-display font-bold tabular-nums text-bb-text">{moves}</span>
          </span>
        </div>

        <ul className="grid w-full max-w-sm grid-cols-3 gap-3 sm:max-w-md sm:gap-4">
          {deck.map((card) => {
            const isMatched = matched.includes(card.pairId);
            return (
              <li key={card.id} className="aspect-[3/4]">
                <MemoryCard
                  card={card}
                  faceUp={isMatched || flipped.includes(card.id)}
                  matched={isMatched}
                  hinted={hintPair === card.pairId}
                  reduceMotion={Boolean(reduceMotion)}
                  onFlip={() => handleFlip(card)}
                />
              </li>
            );
          })}
        </ul>

        <div className="flex h-11 items-center">
          {settling ? (
            <p className="text-sm text-bb-frost" aria-live="polite">
              {ui.finishing}
            </p>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="bb-touch rounded-full px-5 text-sm text-bb-text-muted underline-offset-4 transition-colors hover:text-bb-text hover:underline"
            >
              {ui.restart}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function MemoryCard({
  card,
  faceUp,
  matched,
  hinted,
  reduceMotion,
  onFlip,
}: {
  card: Card;
  faceUp: boolean;
  matched: boolean;
  hinted: boolean;
  reduceMotion: boolean;
  onFlip: () => void;
}) {
  const { ui } = content.game;
  const label = faceUp ? `${card.asset.alt}${matched ? ` — ${ui.matched}` : ''}` : ui.cardBack;

  return (
    <button
      type="button"
      onClick={onFlip}
      disabled={matched}
      aria-label={label}
      aria-pressed={faceUp}
      className={`group relative block size-full rounded-[var(--radius-bb)] transition-transform duration-500 ease-[var(--ease-bb)] enabled:hover:-translate-y-1 disabled:cursor-default ${
        hinted ? 'bb-hint' : ''
      }`}
      style={{ perspective: '1000px' }}
    >
      <span
        className="relative block size-full transition-transform duration-500 ease-[var(--ease-bb)]"
        style={
          reduceMotion
            ? undefined
            : {
                transformStyle: 'preserve-3d',
                transform: faceUp ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }
        }
      >
        {/* ظهر البطاقة — نقش التوت */}
        <span
          className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-[var(--radius-bb)] border border-[var(--bb-hairline)] bg-bb-surface transition-opacity duration-300 ${
            reduceMotion && faceUp ? 'opacity-0' : 'opacity-100'
          }`}
          style={reduceMotion ? undefined : { backfaceVisibility: 'hidden' }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 28% 22%, color-mix(in oklab, var(--bb-berry-lit) 80%, transparent) 0%, transparent 58%), radial-gradient(circle at 78% 84%, color-mix(in oklab, var(--bb-berry) 75%, transparent) 0%, transparent 62%), radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--bb-surface-2) 95%, transparent) 0%, transparent 70%)',
            }}
          />
          {/* شبكة نقاط خفيفة تعطي ظهر البطاقة ملمسًا */}
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'radial-gradient(circle, var(--bb-frost) 0.5px, transparent 0.5px)',
              backgroundSize: '9px 9px',
            }}
          />
          <BlueberryMark className="relative size-9 opacity-90 drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[var(--ease-bb)] group-hover:scale-110" />
        </span>

        {/* وجه البطاقة — الصورة */}
        <span
          className={`absolute inset-0 overflow-hidden rounded-[var(--radius-bb)] border transition-all duration-500 ${
            matched
              ? 'border-bb-bloom/70 shadow-[0_0_0_1px_var(--bb-bloom),0_0_30px_-4px_var(--bb-berry-lit)]'
              : 'border-[var(--bb-hairline)]'
          } ${reduceMotion && !faceUp ? 'opacity-0' : 'opacity-100'}`}
          style={
            reduceMotion ? undefined : { backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }
          }
        >
          <Image
            src={card.asset.base}
            alt=""
            fill
            sizes="(min-width: 640px) 150px, 31vw"
            placeholder="blur"
            blurDataURL={card.asset.blurDataURL}
            className="object-cover"
            draggable={false}
          />
          <span
            aria-hidden="true"
            className={`absolute inset-0 transition-colors duration-500 ${
              matched ? 'bg-bb-berry/20' : 'bg-transparent'
            }`}
          />
          {/* علامة صحّ صغيرة على البطاقات المكتملة */}
          {matched ? (
            <span
              aria-hidden="true"
              className="absolute bottom-2 end-2 flex size-6 items-center justify-center rounded-full bg-bb-ink/75 text-bb-frost backdrop-blur-sm"
            >
              <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                <path
                  d="m3.5 8.5 3 3 6-7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}
