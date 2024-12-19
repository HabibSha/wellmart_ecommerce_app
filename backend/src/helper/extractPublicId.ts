const extractPublicId = (imageUrl: string): string | null => {
  try {
    // Split the URL and extract the public_id
    const parts = imageUrl.split("/");
    const publicIdWithExt = parts.slice(-2).join("/"); // e.g., "folder/image.jpg"
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // Remove the file extension
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

export default extractPublicId;
