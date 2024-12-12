import { Router } from "express";

import { handleCreateBrand } from "../controllers/brandController";

const brandRouter = Router();

brandRouter.post("/", handleCreateBrand);

export default brandRouter;
