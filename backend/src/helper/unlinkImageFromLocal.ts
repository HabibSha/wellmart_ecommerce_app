import fs from "fs";

const unlinkImageFromLocal = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log("Local image file deleted successfully");
    } catch (err) {
      console.error("Failed to delete local image file:", err);
    }
  } else {
    console.error("Image file path does not exist:", filePath);
  }
};

export default unlinkImageFromLocal;
