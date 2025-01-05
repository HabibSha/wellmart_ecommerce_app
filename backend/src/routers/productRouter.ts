import { Router } from "express";

import {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
  handleGetProductsByCategory,
  handleGetProductsByBrand,
} from "../controllers/productController";
import { uploadProductImage } from "../middleware/fileUpload";
import { validateProduct } from "../validation/product";
import runValidation from "../validation";
import { isLoggedIn } from "../middleware/auth";

const productRouter = Router();

productRouter.post(
  "/",
  uploadProductImage.single("image"),
  validateProduct,
  runValidation,
  handleCreateProduct
);
productRouter.get("/", isLoggedIn, handleGetProducts);
productRouter.get("/:slug", handleGetProduct);
productRouter.delete("/:slug", handleDeleteProduct);
productRouter.put("/:slug", handleUpdateProduct);

// get products by category & brand router
productRouter.get("/get/category", handleGetProductsByCategory);
productRouter.get("/get/brand", handleGetProductsByBrand);

export default productRouter;
