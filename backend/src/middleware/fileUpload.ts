import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

import {
  UPLOAD_USER_IMG_DIR,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  UPLOAD_PRODUCT_IMG_DIR,
  UPLOAD_REVIEW_IMG_DIR,
  UPLOAD_CATEGORY_IMG_DIR,
  UPLOAD_BRAND_IMG_DIR,
} from "../config";

// user storage
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_USER_IMG_DIR); // Temporary directory
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(fileExt, "") + fileExt
    );
  },
});

const fileFilterUser = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const extname = path.extname(file.originalname).toString();
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    const error = new Error(`File type not allowed: ${extname}`);
    cb(error as unknown as null, false);
  }
  cb(null, true);
};

// product storage
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PRODUCT_IMG_DIR); // Temporary directory
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(fileExt, "") + fileExt
    );
  },
});

const fileFilterProduct = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const extname = path.extname(file.originalname).toString();
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    const error = new Error(`File type not allowed: ${extname}`);
    cb(error as unknown as null, false);
  }
  cb(null, true);
};

// category storage
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_CATEGORY_IMG_DIR); // Temporary directory
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(fileExt, "") + fileExt
    );
  },
});

const fileFilterCategory = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const extname = path.extname(file.originalname).toString();
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    const error = new Error(`File type not allowed: ${extname}`);
    cb(error as unknown as null, false);
  }
  cb(null, true);
};

// brand storage
const brandStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_BRAND_IMG_DIR); // Temporary directory
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(fileExt, "") + fileExt
    );
  },
});

const fileFilterBrand = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const extname = path.extname(file.originalname).toString();
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    const error = new Error(`File type not allowed: ${extname}`);
    cb(error as unknown as null, false);
  }
  cb(null, true);
};

// review storage
const reviewStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_REVIEW_IMG_DIR); // Temporary directory
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(fileExt, "") + fileExt
    );
  },
});

const fileFilterReview = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const extname = path.extname(file.originalname).toString();
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    const error = new Error(`File type not allowed: ${extname}`);
    cb(error as unknown as null, false);
  }
  cb(null, true);
};

// for user
const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilterUser,
});

// for product
const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilterProduct,
});

// for category
const uploadCategoryImage = multer({
  storage: categoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilterCategory,
});

// for brand
const uploadBrandImage = multer({
  storage: brandStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilterBrand,
});

// for brand
const uploadReviewImage = multer({
  storage: reviewStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilterReview,
});

export {
  uploadUserImage,
  uploadProductImage,
  uploadCategoryImage,
  uploadBrandImage,
  uploadReviewImage,
};
