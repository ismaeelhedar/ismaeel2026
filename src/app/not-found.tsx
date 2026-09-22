import Link from 'next/link';
import { content } from '@/content';
import { BerryGlow } from '@/components/chrome/Atmosphere';
import { BlueberryMark } from '@/components/media/PhotoMissing';

export default function NotFound() {
  const { title, body, back } = content.notFound;

  return (
    <main className="bb-ground-ink bb-safe-x relative flex min-h-[100dvh] flex-col items-center justify-center gap-6 text-center">
      <BerryGlow
        size="26rem"
        opacity={0.2}
        className="start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <BlueberryMark className="relative size-12 opacity-80" />

      <h1 className="relative font-display text-3xl text-bb-text">{title}</h1>
      <p className="relative max-w-[34ch] text-bb-text-muted">{body}</p>

      <Link
        href="/"
        className="bb-touch relative inline-flex items-center justify-center rounded-full bg-bb-berry px-8 py-3 font-display text-bb-text transition-colors hover:bg-bb-berry-lit"
      >
        {back}
      </Link>
    </main>
  );
}
