import { Router } from "express";

import {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleDeleteCategory,
  handleUpdateCategory,
} from "../controllers/categoryController";
import { uploadCategoryImage } from "../middleware/fileUpload";
import validateCategory from "../validation/category";
import runValidation from "../validation";

const categoryRouter = Router();

categoryRouter.post(
  "/",
  uploadCategoryImage.single("image"),
  validateCategory,
  runValidation,
  handleCreateCategory
);
categoryRouter.get("/", handleGetCategories);
categoryRouter.get("/:slug", handleGetCategory);
categoryRouter.delete("/:slug", handleDeleteCategory);
categoryRouter.put("/:slug", handleUpdateCategory);

export default categoryRouter;
