import { Router } from "express";

import { handleAddToCart, handleGetCart } from "../controllers/cartController";
import { isLoggedIn } from "../middleware/auth";

const cartRouter = Router();

cartRouter.post("/:productId", isLoggedIn, handleAddToCart);
cartRouter.get("/:productId", isLoggedIn, handleGetCart);

export default cartRouter;
