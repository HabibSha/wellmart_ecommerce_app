import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

import {
  UPLOAD_USER_IMG_DIR,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from "../config";

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

const fileFilter = (
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

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default uploadUserImage;
