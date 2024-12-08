import { v2 as cloudinary } from "cloudinary";
import { apiKey, apiSecret, cloudName } from "../secret";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
