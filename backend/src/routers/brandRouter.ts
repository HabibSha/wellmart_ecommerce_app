import { Router } from "express";

import {
  handleCreateBrand,
  handleGetBrands,
  handleGetBrand,
  handleDeleteBrand,
  handleUpdateBrand,
} from "../controllers/brandController";

const brandRouter = Router();

brandRouter.post("/", handleCreateBrand);
brandRouter.get("/", handleGetBrands);
brandRouter.get("/:slug", handleGetBrand);
brandRouter.delete("/:slug", handleDeleteBrand);
brandRouter.put("/:slug", handleUpdateBrand);

export default brandRouter;
