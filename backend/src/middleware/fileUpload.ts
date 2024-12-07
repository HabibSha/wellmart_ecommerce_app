import multer from "multer";
import path from "path";
import createError from "http-errors";

const UPLOAD_DIR = process.env.UPLOAD_FILE || "public/images/users";
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 2097152; // bytes = 2 mb = 1024*1024*2
const ALLOWED_FILE_TYPES = process.env.ALLOWED_FILE_TYPES || [
  "jpg",
  "jpeg",
  "png",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Temporary directory
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
  cb: (arg0: any, arg1?: boolean | undefined) => void
) => {
  const extname = path.extname(file.originalname);
  if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
    return cb(createError(400, "File type not allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
