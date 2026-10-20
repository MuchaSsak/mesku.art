/**
 * Converts source photos of the art pieces into responsive, compressed WebP
 * images in `public/art/<slug>/` and records them in `src/data/images.json`.
 *
 * Usage: yarn images <source-dir>
 *
 * Source photos are named `{id}_{n}.{ext}` (n = 0, 1, 2, ...) and
 * `{id}_reference.{ext}`, where `id` is an entry of `src/data/artworks.ts`.
 * The run is incremental: only new or changed photos are processed, so the
 * source directory may contain just the photos that were added. Images of art
 * pieces removed from the catalog are deleted.
 */

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { join, resolve } from "node:path";
import { argv, exit } from "node:process";
import sharp from "sharp";

import { artworkEntries } from "../src/data/artworks.ts";
import type { ImageManifest, ManifestImage } from "../src/lib/imageManifest.ts";
import {
  compareImageNames,
  getImageFileBase,
  getImageFileName,
  REFERENCE_IMAGE_NAME,
} from "../src/lib/imagePaths.ts";

const ROOT = resolve(import.meta.dirname, "..");
const OUTPUT_DIR = join(ROOT, "public", "art");
const MANIFEST_PATH = join(ROOT, "src", "data", "images.json");

/** Longest edges of the generated variants. Thumbnails are only needed for cover photos. */
const COVER_LONG_EDGES = [480, 960, 1600];
const PHOTO_LONG_EDGES = [960, 1600];
/** Visually lossless for these photos. Bump `ENCODER_VERSION` after changing it. */
const WEBP_OPTIONS: sharp.WebpOptions = {
  quality: 80,
  effort: 6,
  smartSubsample: true,
};
const ENCODER_VERSION = "webp-q80-v2";

const SOURCE_FILE_PATTERN =
  /^(\d+)_(\d+|reference)\.(jpe?g|png|webp|avif|tiff?)$/i;

const sourceDir = argv[2];

if (!sourceDir) {
  console.error("Usage: yarn images <source-dir>");
  exit(1);
}

const slugById = new Map(artworkEntries.map((entry) => [entry.id, entry.slug]));
const manifest: ImageManifest = existsSync(MANIFEST_PATH)
  ? JSON.parse(await readFile(MANIFEST_PATH, "utf8"))
  : {};

const sourceFiles = (await readdir(sourceDir)).filter((file) => {
  if (SOURCE_FILE_PATTERN.test(file)) return true;
  console.warn(`Skipping "${file}" - expected "{id}_{n}.jpg" or "{id}_reference.jpg"`);
  return false;
});

const fileByImageKey = new Map<string, string>();

for (const file of sourceFiles) {
  const { id, name } = parseSourceFileName(file);

  if (!slugById.has(id)) {
    console.error(`"${file}": no art piece with id ${id} in src/data/artworks.ts`);
    exit(1);
  }

  const duplicate = fileByImageKey.get(`${id}_${name}`);

  if (duplicate) {
    console.error(`"${file}" and "${duplicate}" are the same photo - keep one of them`);
    exit(1);
  }

  fileByImageKey.set(`${id}_${name}`, file);
}

let processedCount = 0;
/** Files of replaced photos, deleted once the new manifest is written. */
const staleImages: { slug: string; image: ManifestImage }[] = [];
const removedSlugs: string[] = [];
const queue = [...sourceFiles];

await Promise.all(
  Array.from({ length: Math.max(1, availableParallelism() - 1) }, async () => {
    for (let file = queue.shift(); file; file = queue.shift()) {
      await processSourceFile(file);
    }
  }),
);

// Drop art pieces which are no longer in the catalog
const catalogSlugs = new Set(slugById.values());

for (const slug of Object.keys(manifest)) {
  if (catalogSlugs.has(slug)) continue;
  delete manifest[slug];
  removedSlugs.push(slug);
}

const sortedManifest: ImageManifest = {};

for (const { slug } of artworkEntries) {
  const images = manifest[slug];

  if (!images?.length) {
    console.warn(`Art piece "${slug}" has no images yet`);
    continue;
  }

  sortedManifest[slug] = images.sort((a, b) => compareImageNames(a.name, b.name));
}

await writeFile(MANIFEST_PATH, `${JSON.stringify(sortedManifest, null, 2)}\n`);

// Old files are removed only now, so a failed run never leaves the manifest
// pointing at deleted images
for (const { slug, image } of staleImages) {
  await removeImageFiles(slug, image);
}

for (const slug of removedSlugs) {
  await rm(join(OUTPUT_DIR, slug), { recursive: true, force: true });
  console.log(`✗ removed art/${slug}`);
}

console.log(`Done - ${processedCount} photo(s) processed.`);

/** Normalizes the photo name, so `1_Reference.JPG` and `1_01.jpg` are accepted. */
function parseSourceFileName(file: string) {
  const [, id, name] = file.match(SOURCE_FILE_PATTERN)!;

  return {
    id: Number(id),
    name:
      name.toLowerCase() === REFERENCE_IMAGE_NAME
        ? REFERENCE_IMAGE_NAME
        : String(Number(name)),
  };
}

async function processSourceFile(file: string) {
  const { id, name } = parseSourceFileName(file);
  const slug = slugById.get(id)!;
  const input = await readFile(join(sourceDir, file));
  const hash = createHash("sha256")
    .update(ENCODER_VERSION)
    .update(input)
    .digest("hex")
    .slice(0, 8);

  const images = (manifest[slug] ??= []);
  const existing = images.find((image) => image.name === name);

  if (existing?.hash === hash) return;

  const image = await createVariants(input, slug, name, hash);

  if (existing) {
    staleImages.push({ slug, image: existing });
    images.splice(images.indexOf(existing), 1);
  }

  images.push(image);
  processedCount++;
  console.log(`✓ ${file} → art/${slug}/${getImageFileBase(slug, name)}`);
}

async function createVariants(
  input: Buffer,
  slug: string,
  name: string,
  hash: string,
): Promise<ManifestImage> {
  const longEdges = name === "0" ? COVER_LONG_EDGES : PHOTO_LONG_EDGES;
  const outputDir = join(OUTPUT_DIR, slug);
  const widths: number[] = [];
  let largest: sharp.OutputInfo | undefined;

  await mkdir(outputDir, { recursive: true });

  for (const longEdge of longEdges) {
    // Every variant is encoded straight from the source, so it's compressed
    // only once. `rotate()` applies the EXIF orientation.
    const variant = await sharp(input)
      .rotate()
      .resize({
        width: longEdge,
        height: longEdge,
        fit: "inside",
        withoutEnlargement: true,
        fastShrinkOnLoad: false,
      })
      .webp(WEBP_OPTIONS)
      .toBuffer({ resolveWithObject: true });

    // Sizes above the original collapse into the original size
    if (widths.includes(variant.info.width)) break;

    await writeFile(
      join(outputDir, getImageFileName(slug, name, variant.info.width, hash)),
      variant.data,
    );
    widths.push(variant.info.width);
    largest = variant.info;
  }

  const { dominant } = await sharp(input).stats();

  return {
    name,
    hash,
    width: largest!.width,
    height: largest!.height,
    widths,
    color: `#${[dominant.r, dominant.g, dominant.b]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")}`,
  };
}

async function removeImageFiles(slug: string, image: ManifestImage) {
  await Promise.all(
    image.widths.map((width) =>
      rm(
        join(OUTPUT_DIR, slug, getImageFileName(slug, image.name, width, image.hash)),
        { force: true },
      ),
    ),
  );
}
