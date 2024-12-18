import { Router } from "express";

import {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
} from "../controllers/productController";
import { uploadProductImage } from "../middleware/fileUpload";
import { validateProduct } from "../validation/product";
import runValidation from "../validation";

const productRouter = Router();

productRouter.post(
  "/",
  uploadProductImage.single("image"),
  validateProduct,
  runValidation,
  handleCreateProduct
);
productRouter.get("/", handleGetProducts);
productRouter.get("/:slug", handleGetProduct);
productRouter.delete("/:slug", handleDeleteProduct);

export default productRouter;
