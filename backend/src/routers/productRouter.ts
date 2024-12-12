import { Router } from "express";

import { handleCreateProduct } from "../controllers/productController";
import { uploadProductImage } from "../middleware/fileUpload";

const productRouter = Router();

productRouter.post(
  "/",
  uploadProductImage.single("image"),
  handleCreateProduct
);

export default productRouter;
