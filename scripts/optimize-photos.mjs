/**
 * محسِّن الصور — optimize-photos.mjs
 *
 * يقرأ الصور الأصلية من public/photos/ وينتج:
 *   1. نسخ WebP بعروض متعددة في public/photos/opt/
 *   2. صورة ضبابية صغيرة (base64) لكل صورة لمنع القفز في التخطيط
 *   3. ملف src/photos.json يستهلكه التطبيق
 *
 * التشغيل:  npm run photos          (يتخطى الصور غير المتغيّرة)
 *           npm run photos -- --force   (يعيد توليد كل شيء)
 */

import { createHash } from 'node:crypto';
import { readdir, mkdir, stat, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'public', 'photos');
const OUTPUT_DIR = path.join(SOURCE_DIR, 'opt');
const MANIFEST_PATH = path.join(ROOT, 'src', 'photos.json');

/** يجب أن تطابق هذه العروض deviceSizes/imageSizes في next.config.ts */
const WIDTHS = [240, 480, 960, 1600];
const BLUR_WIDTH = 16;
const WEBP_QUALITY = 78;
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

const force = process.argv.includes('--force');

/** EXIF orientations 5-8 تعني أن العرض والارتفاع متبادلان بعد التدوير. */
function orientedSize(metadata) {
  const swap = typeof metadata.orientation === 'number' && metadata.orientation >= 5;
  return {
    width: swap ? metadata.height : metadata.width,
    height: swap ? metadata.width : metadata.height,
  };
}

async function fingerprint(filePath) {
  const info = await stat(filePath);
  return createHash('sha1')
    .update(`${info.size}:${info.mtimeMs}:${WIDTHS.join(',')}:${WEBP_QUALITY}`)
    .digest('hex')
    .slice(0, 16);
}

async function readPreviousManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  } catch {
    return { photos: {} };
  }
}

async function buildPhoto(fileName, previous) {
  const slug = path.basename(fileName, path.extname(fileName));
  const sourcePath = path.join(SOURCE_DIR, fileName);
  const hash = await fingerprint(sourcePath);

  const cached = previous.photos?.[slug];
  if (!force && cached?.hash === hash) {
    return { slug, entry: cached, skipped: true };
  }

  // .rotate() بدون وسائط يطبّق اتجاه EXIF ثم يزيل الوسم
  const pipeline = sharp(sourcePath, { failOn: 'none' }).rotate();
  const metadata = await sharp(sourcePath, { failOn: 'none' }).metadata();
  const { width, height } = orientedSize(metadata);

  if (!width || !height) {
    throw new Error(`تعذّرت قراءة أبعاد الصورة: ${fileName}`);
  }

  const variants = {};
  for (const target of WIDTHS) {
    // لا نكبّر الصور أبدًا؛ نكتفي بالعرض الأصلي كحد أقصى
    const renderWidth = Math.min(target, width);
    const outputName = `${slug}-${target}.webp`;
    await pipeline
      .clone()
      .resize({ width: renderWidth, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(path.join(OUTPUT_DIR, outputName));
    variants[target] = `/photos/opt/${outputName}`;
  }

  const blurBuffer = await pipeline
    .clone()
    .resize({ width: BLUR_WIDTH })
    .blur(1.1)
    .webp({ quality: 42 })
    .toBuffer();

  const entry = {
    slug,
    hash,
    width,
    height,
    aspectRatio: Number((width / height).toFixed(4)),
    orientation: width >= height ? 'landscape' : 'portrait',
    base: `/photos/opt/${slug}`,
    variants,
    blurDataURL: `data:image/webp;base64,${blurBuffer.toString('base64')}`,
  };

  return { slug, entry, skipped: false };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort();

  if (files.length === 0) {
    console.warn('⚠  لا توجد صور في public/photos/ — تم إنشاء ملف تعريف فارغ.');
  }

  const previous = await readPreviousManifest();
  const photos = {};
  let built = 0;
  let skipped = 0;

  for (const fileName of files) {
    const { slug, entry, skipped: wasSkipped } = await buildPhoto(fileName, previous);
    photos[slug] = entry;
    if (wasSkipped) {
      skipped += 1;
    } else {
      built += 1;
      console.log(`✓ ${slug}  ${entry.width}×${entry.height}  (${entry.orientation})`);
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    widths: WIDTHS,
    photos,
  };

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`\nتم: ${built} صورة جديدة، ${skipped} بدون تغيير → src/photos.json`);
}

main().catch((error) => {
  console.error('✗ فشل تحسين الصور:', error.message);
  process.exitCode = 1;
});
