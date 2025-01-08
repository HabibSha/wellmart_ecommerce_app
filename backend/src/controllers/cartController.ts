import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

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

    const existingProduct = await Product.findOne({ _id: productId });
    if (!existingProduct) {
      throw createError(404, "Product not found");
    }

    if (existingCart) {
      existingCart.quantity++;
      existingCart.cartTotal =
        (existingCart.cartTotal ?? 0) + existingProduct.price;
      await existingCart.save();
    } else {
      const newCart = {
        user: userId,
        product: productId,
        quantity: 1,
        cartTotal: existingProduct.price,
      };

      await Cart.create(newCart);
    }

    successResponse(res, {
      statusCode: 201,
      message: "Product added to the cart successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleGetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const userId = req.user?.userId;

  try {
    const cart = await Cart.find({ user: userId });
    if (!cart) {
      throw createError(404, "No products available in your cart.");
    }

    const subTotal = cart.reduce((acc, cur) => {
      acc += cur.cartTotal;
      return acc;
    }, 0);

    successResponse(res, {
      statusCode: 201,
      message: "Product added to the cart successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

export { handleAddToCart };
