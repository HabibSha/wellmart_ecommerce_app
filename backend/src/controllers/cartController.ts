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

// handle get cart
const handleGetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId;

  try {
    const cart = await Cart.find({ user: userId }).populate([
      { path: "product", select: "title description image price quantity" },
    ]);
    if (!cart) {
      throw createError(404, "Cart not found!");
    }

    const subTotal = cart.reduce((acc, cur) => {
      acc += cur.cartTotal ?? 0; // Use 0 if cartTotal is null or undefined
      return acc;
    }, 0);

    successResponse(res, {
      statusCode: 201,
      message: "Product added to the cart successfully",
      payload: {
        cart: cart,
        subTotal: subTotal,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const handleRemoveCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const userId = req.user?.userId;

  try {
  } catch (error) {
    return next(error);
  }
};

export { handleAddToCart, handleGetCart, handleRemoveCart };
