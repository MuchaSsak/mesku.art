import supabase from "./supabase";
import { SUPABASE_ART_PIECES_BUCKET_ROOT_URL } from "../utils/constants";

async function getArtPieces() {
  try {
    // Fetch the images
    const { data, error } = await supabase.storage.from("art-pieces").list("", {
      limit: 1000,
    });

    if (error) throw error;

    // Manipulate the data to output an array with only the useful information for this use case
    const allImages = data.map((image) => {
      const [filename] = image.name.split("."); // 3_1.jpg -> 3_1
      const folderId = Number(filename.split("_")[0]); // 3_1 -> 3
      const imageName = filename.split("_")[1]; // 3_1 -> 1
      const imageUrl = `${SUPABASE_ART_PIECES_BUCKET_ROOT_URL}/${image.name}`;

      return {
        folderId,
        imageUrl,
        imageName,
      };
    });

    const allSortedImages = allImages.sort((a, b) => a.folderId - b.folderId);

    const totalFolders = allSortedImages.at(-1)!.folderId + 1;
    const structuredImages = new Array(totalFolders);
    for (let i = 0; i < structuredImages.length; i++) {
      structuredImages[i] = [];
    }

    allImages.forEach((image) => {
      structuredImages[image.folderId].push({
        imageUrl: image.imageUrl,
        imageName: image.imageName,
      });
    });

    return structuredImages;
  } catch (err) {
    console.error(err);
  }
}

export default getArtPieces;
