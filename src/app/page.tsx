import { content } from '@/content';
import { getPhoto } from '@/lib/photos';
import { Opening } from '@/components/sections/Opening';
import { Story } from '@/components/sections/Story';
import { Gallery } from '@/components/sections/Gallery';
import { Counter } from '@/components/sections/Counter';
import { Reasons } from '@/components/sections/Reasons';
import { Gate } from '@/components/sections/Gate';
import { Letter } from '@/components/sections/Letter';
import type { GameCardAsset } from '@/components/sections/Game';
import type { GiftPhotoAsset } from '@/components/sections/GiftDevice';

/**
 * الصفحة الواحدة.
 *
 * كل شيء هنا مكوّن خادم عدا البوّابة: هي وحدها تحتاج إلى حالة، لأنها
 * تقرّر متى يُركَّب قسم المفاجأة. الرسالة تُمرَّر إليها كـ children وهي
 * مُصيَّرة على الخادم، فلا يتضخّم ما يصل إلى المتصفّح.
 */
export default function Page() {
  const gameAssets: GameCardAsset[] = content.game.pairs.flatMap((pair) => {
    const asset = getPhoto(pair.slug);
    if (!asset) return [];

    return [
      {
        slug: pair.slug,
        alt: pair.alt,
        base: asset.base,
        blurDataURL: asset.blurDataURL,
      },
    ];
  });

  const giftAsset = getPhoto(content.reveal.photo.slug);
  const giftPhoto: GiftPhotoAsset | null = giftAsset
    ? {
        base: giftAsset.base,
        alt: content.reveal.photo.alt,
        blurDataURL: giftAsset.blurDataURL,
        aspectRatio: giftAsset.aspectRatio,
      }
    : null;

  return (
    <main>
      <Opening />
      <Story />
      <Gallery />
      <Counter />
      <Reasons />
      <Gate gameAssets={gameAssets} giftPhoto={giftPhoto} letter={<Letter />} />
    </main>
  );
}
