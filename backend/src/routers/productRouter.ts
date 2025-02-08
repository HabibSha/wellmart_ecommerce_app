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
import { isLoggedIn, isAdmin } from "../middleware/auth";

const productRouter = Router();

productRouter.post(
  "/",
  uploadProductImage.single("image"),
  validateProduct,
  isLoggedIn,
  isAdmin,
  runValidation,
  handleCreateProduct
);
productRouter.get("/", handleGetProducts);
productRouter.get("/:slug", handleGetProduct);
productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct);
productRouter.put("/:slug", isLoggedIn, isAdmin, handleUpdateProduct);

// get products by category & brand router
productRouter.get("/get/category", handleGetProductsByCategory);
productRouter.get("/get/brand", handleGetProductsByBrand);

export default productRouter;
