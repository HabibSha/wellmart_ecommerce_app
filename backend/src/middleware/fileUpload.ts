import multer from "multer";
import path from "path";

import { uploadDirectory } from "../secret";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Temporary directory
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
