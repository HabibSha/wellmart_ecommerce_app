import { Router } from "express";

import { handleCreateCategory } from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.post("/", handleCreateCategory);

export default categoryRouter;
