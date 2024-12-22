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
brandRouter.get("/", handleGetBrand);
brandRouter.delete("/", handleDeleteBrand);
brandRouter.put("/", handleUpdateBrand);

export default brandRouter;
