import { Router } from "express";

import { handleAddToCart } from "../controllers/cartController";
import { isLoggedIn } from "../middleware/auth";

const cartRouter = Router();

cartRouter.post("/:productId", isLoggedIn, handleAddToCart);

export default cartRouter;
