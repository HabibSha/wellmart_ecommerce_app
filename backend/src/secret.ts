const port = process.env.PORT || 5001;
const mongodbUri =
  process.env.MongoDB_URI || "mongodb://127.0.0.1:27017/WellMartDB";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/user.jpg";

// jwt token
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "jwtsecretaccesskey";
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "jwtsecretrefreshkey";

// cloudinary cloud
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export {
  port,
  mongodbUri,
  defaultImagePath,
  jwtAccessKey,
  jwtRefreshKey,
  cloudName,
  apiKey,
  apiSecret,
};
