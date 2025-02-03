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
import { isLoggedIn, isAdmin } from "../middleware/auth";

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
brandRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteBrand);
brandRouter.put("/:slug", isLoggedIn, isAdmin, handleUpdateBrand);

export default brandRouter;
