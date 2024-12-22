import { Router } from "express";

import {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleDeleteCategory,
  handleUpdateCategory,
} from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.post("/", handleCreateCategory);
categoryRouter.get("/", handleGetCategories);
categoryRouter.get("/", handleGetCategory);
categoryRouter.delete("/", handleDeleteCategory);
categoryRouter.put("/", handleUpdateCategory);

export default categoryRouter;
