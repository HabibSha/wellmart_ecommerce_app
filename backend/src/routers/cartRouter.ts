import { Router } from "express";

import {
  handleAddToCart,
  handleGetCart,
  handleRemoveCart,
} from "../controllers/cartController";
import { isLoggedIn } from "../middleware/auth";

const cartRouter = Router();

cartRouter.post("/:productId", isLoggedIn, handleAddToCart);
cartRouter.get("/", isLoggedIn, handleGetCart);
cartRouter.put("/", isLoggedIn, handleRemoveCart);

export default cartRouter;
