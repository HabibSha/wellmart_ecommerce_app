import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = async (imageFile: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(imageFile, {
      resource_type: "image",
      visibility: "public",
      // folder: "your-folder",
    });
    return result;
  } catch (error) {
    throw new Error(`Upload failed: ${error}`);
  }
};

export default uploadToCloudinary;
