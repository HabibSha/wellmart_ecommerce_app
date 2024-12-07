import multer from "multer";
import path from "path";
import createError from "http-errors";

import {
  UPLOAD_USER_FILE_DIRECTORY,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from "../config";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_USER_FILE_DIRECTORY); // Temporary directory
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

const fileFilter = (
  _req: any,
  file: { originalname: string },
  cb: (arg0: any, arg1: undefined | boolean) => void
) => {
  const extname = path.extname(file.originalname);
  if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
    return cb(new Error("File type not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
