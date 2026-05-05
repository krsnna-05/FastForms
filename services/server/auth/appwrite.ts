import { appwriteConfig } from "@/config";
import { storage } from "@/providers/appwrite";
import { ID } from "node-appwrite";

export const storeImageInAppwrite = async ({
  imgBlob,
  fileName,
}: {
  imgBlob: Blob;
  fileName: string;
}): Promise<string> => {
  try {
    const file = new File([imgBlob], fileName, { type: imgBlob.type });
    const fileInfo = await storage.createFile({
      bucketId: appwriteConfig.appwrite_bucket_id,
      fileId: ID.unique(),
      file,
    });

    return fileInfo.$id;
  } catch (error) {
    console.error("Error storing image in Appwrite:", error);
    throw new Error("Failed to store image in Appwrite");
  }
};
