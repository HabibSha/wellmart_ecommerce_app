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
import { isLoggedIn, isAdmin } from "../middleware/auth";

const categoryRouter = Router();

categoryRouter.post(
  "/",
  uploadCategoryImage.single("image"),
  validateCategory,
  runValidation,
  handleCreateCategory
);
categoryRouter.get("/", isLoggedIn, isAdmin, handleGetCategories);
categoryRouter.get("/:slug", isLoggedIn, handleGetCategory);
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategory);
categoryRouter.put("/:slug", isLoggedIn, isAdmin, handleUpdateCategory);

export default categoryRouter;
