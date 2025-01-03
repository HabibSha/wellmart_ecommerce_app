import { Router } from "express";

import {
  handleCreateBrand,
  handleGetBrands,
  handleGetBrand,
  handleDeleteBrand,
  handleUpdateBrand,
} from "../controllers/brandController";
import { uploadCategoryImage } from "../middleware/fileUpload";
import validateBrand from "../validation/brand";
import runValidation from "../validation";

const brandRouter = Router();

brandRouter.post(
  "/",
  uploadCategoryImage.single("image"),
  validateBrand,
  runValidation,
  handleCreateBrand
);
brandRouter.get("/", handleGetBrands);
brandRouter.get("/:slug", handleGetBrand);
brandRouter.delete("/:slug", handleDeleteBrand);
brandRouter.put("/:slug", handleUpdateBrand);

export default brandRouter;
