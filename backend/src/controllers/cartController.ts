import { Request, Response, NextFunction } from "express";

import Cart from "../models/cartModel";
import Product from "../models/productModel";
import { successResponse } from "../controllers/responseController";

const handleAddToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const userId = req.user?.userId;

  try {
    const existingCart = await Cart.findOne({
      user: userId,
      product: productId,
    });
    const existingProduct = await Product.findOne({ productId });

    let cart;

    if (existingCart) {
      existingCart.quantity++;
      existingCart.cartTotal += existingProduct.price;
      existingCart.save();
    } else {
      const newCart = {
        user: userId,
        product: productId,
        quantity: 1,
        cartTotal: existingProduct.price,
      };

      cart = await Cart.create(newCart);
    }

    successResponse(res, {
      statusCode: 201,
      message: "Product added to the cart successfully",
      payload: cart,
    });
  } catch (error) {
    next(error);
  }
};

export { handleAddToCart };
