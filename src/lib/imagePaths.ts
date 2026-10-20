/** Public URL prefix of the optimized art piece images (`public/art`). */
export const ART_IMAGES_BASE_PATH = "/art";

/** Name of the photo of an art piece: "0", "1", ... or "reference". */
export type ArtworkImageName = `${number}` | "reference";

export const REFERENCE_IMAGE_NAME = "reference";

/**
 * Human readable file name (without size, hash and extension) of an art piece
 * photo, e.g. `2pac`, `2pac-2`, `2pac-pierwowzor`.
 */
export function getImageFileBase(slug: string, name: string) {
  if (name === "0") return slug;
  if (name === REFERENCE_IMAGE_NAME) return `${slug}-pierwowzor`;
  return `${slug}-${Number(name) + 1}`;
}

export function getImageFileName(
  slug: string,
  name: string,
  width: number,
  hash: string,
) {
  return `${getImageFileBase(slug, name)}-${width}w.${hash}.webp`;
}

export function getImageUrl(
  slug: string,
  name: string,
  width: number,
  hash: string,
) {
  return `${ART_IMAGES_BASE_PATH}/${slug}/${getImageFileName(slug, name, width, hash)}`;
}

/** Orders photos as "0", "1", ..., with the reference photo last. */
export function compareImageNames(a: string, b: string) {
  if (a === b) return 0;
  if (a === REFERENCE_IMAGE_NAME) return 1;
  if (b === REFERENCE_IMAGE_NAME) return -1;
  return Number(a) - Number(b);
}
