import {
  artworkEntries,
  featuredArtworkEntries,
  type ArtworkEntry,
  type ArtworkMedium,
} from "../data/artworks.ts";
import imageManifest from "../data/images.json";
import type { ImageManifest, ManifestImage } from "./imageManifest.ts";
import { getImageUrl, REFERENCE_IMAGE_NAME } from "./imagePaths.ts";

export interface ImageVariant {
  url: string;
  width: number;
}

export interface ArtworkImage {
  /** Ascending by width */
  variants: ImageVariant[];
  /** Dimensions of the largest variant */
  width: number;
  height: number;
  alt: string;
  /** Dominant color, used as a placeholder */
  color: string;
  isReference: boolean;
}

export interface Artwork extends ArtworkEntry {
  cover: ArtworkImage;
  images: ArtworkImage[];
}

export const MEDIUM_LABELS: Record<ArtworkMedium, string> = {
  airbrush: "obraz malowany aerografem",
  spray: "obraz malowany farbą w sprayu",
  "graffiti-canvas": "graffiti na płótnie",
  "graffiti-wall": "graffiti na murze",
  mural: "mural",
  sketch: "szkic graffiti",
  vehicle: "malunek na ciężarówce",
};

export function getSrcset(variants: ImageVariant[]) {
  return variants.map((variant) => `${variant.url} ${variant.width}w`).join(", ");
}

function getDescription({ title, medium }: ArtworkEntry) {
  // Avoids two dashes in a row when the title already contains one
  const separator = title.includes(" – ") ? ", " : " – ";
  return `${title}${separator}${MEDIUM_LABELS[medium]}`;
}

function getAltText(entry: ArtworkEntry, name: string, photoCount: number) {
  if (name === REFERENCE_IMAGE_NAME) {
    return `${entry.title} – pierwowzór (zdjęcie referencyjne)`;
  }

  return photoCount > 1
    ? `${getDescription(entry)}, zdjęcie ${Number(name) + 1} z ${photoCount}`
    : getDescription(entry);
}

function toArtwork(entry: ArtworkEntry, manifestImages: ManifestImage[]): Artwork {
  const photoCount = manifestImages.filter(
    (image) => image.name !== REFERENCE_IMAGE_NAME,
  ).length;

  const images = manifestImages.map(
    (image): ArtworkImage => ({
      variants: image.widths.map((width) => ({
        url: getImageUrl(entry.slug, image.name, width, image.hash),
        width,
      })),
      width: image.width,
      height: image.height,
      alt: getAltText(entry, image.name, photoCount),
      color: image.color,
      isReference: image.name === REFERENCE_IMAGE_NAME,
    }),
  );

  // The thumbnail represents the whole art piece, not one of its photos
  const cover = { ...images[0], alt: getDescription(entry) };

  return { ...entry, cover, images };
}

/** All art pieces which have images, in gallery order. */
export const artworks: Artwork[] = artworkEntries.flatMap((entry) => {
  const manifestImages = (imageManifest as ImageManifest)[entry.slug];
  return manifestImages?.length ? [toArtwork(entry, manifestImages)] : [];
});

export function getFeaturedArtworks() {
  return featuredArtworkEntries.map(({ slug, brighten }) => {
    const artwork = artworks.find((item) => item.slug === slug);
    if (!artwork) throw new Error(`Featured art piece "${slug}" does not exist`);
    return { artwork, brighten };
  });
}

/** Finds an art piece by its slug or by a legacy `{id}_{n}` photo name. */
export function findArtwork(key: string) {
  const legacyId = /^(\d+)_/.exec(key)?.[1];

  return artworks.find((artwork) =>
    legacyId ? artwork.id === Number(legacyId) : artwork.slug === key,
  );
}
