import { v2 as cloudinary } from "cloudinary";

cloudinary.uploader.upload(
  "/home/my_image.jpg",
  { upload_preset: "my_preset" },
  (error, result) => {
    console.log(result, error);
  }
);
