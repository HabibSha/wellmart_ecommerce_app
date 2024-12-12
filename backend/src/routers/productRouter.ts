import { Router } from "express";

import { handleCreateProduct } from "../controllers/productController";

const productRouter = Router();

productRouter.post("/", handleCreateProduct);

export default productRouter;
