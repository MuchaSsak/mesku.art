import supabase from "./supabase";
import { SUPABASE_ART_PIECES_BUCKET_ROOT_URL } from "../utils/constants";

async function getArtPieces() {
  try {
    const { data, error } = await supabase.storage.from("art-pieces").list("", {
      limit: 1000,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    const allImages = data
      .filter((image) => image.name.includes("."))
      .map((image) => {
        const [filename] = image.name.split(".");
        const [folderIdRaw, imageName] = filename.split("_");

        const folderId = Number(folderIdRaw);

        if (Number.isNaN(folderId) || !imageName) {
          return null;
        }

        const imageUrl = `${SUPABASE_ART_PIECES_BUCKET_ROOT_URL}/${image.name}`;

        return {
          folderId,
          imageUrl,
          imageName,
        };
      })
      .filter(
        (
          image,
        ): image is {
          folderId: number;
          imageUrl: string;
          imageName: string;
        } => Boolean(image),
      )
      .sort((a, b) => {
        if (a.folderId !== b.folderId) {
          return a.folderId - b.folderId;
        }

        return Number(a.imageName) - Number(b.imageName);
      });

    if (allImages.length === 0) {
      return [];
    }

    const totalFolders = allImages.at(-1)!.folderId + 1;

    const structuredImages: ArtPieceImage[][] = Array.from(
      { length: totalFolders },
      () => [],
    );

    allImages.forEach((image) => {
      structuredImages[image.folderId].push({
        imageUrl: image.imageUrl,
        imageName: image.imageName,
      });
    });

    return structuredImages.filter((folder) => folder.length > 0);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default getArtPieces;
