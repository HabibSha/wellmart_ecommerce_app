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
  const productId = req.query.productId;
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
      acc += cur.cartTotal ?? 0; // use 0 if cartTotal is null or undefined
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
  const productId = req.query.productId;
  const userId = req.user?.userId;

  try {
    const existingCart = await Cart.findOne({
      user: userId,
      product: productId,
    }).populate([{ path: "product" }]);
    if (!existingCart) {
      throw createError(404, "Cart not found!");
    }
    if (existingCart.quantity > 1) {
      existingCart.quantity--;
      existingCart.cartTotal =
        existingCart.cartTotal ?? 0 - existingCart.product?.price;
      await existingCart.save();
    } else {
      await Cart.findOneAndDelete({ user: userId, product: productId });
    }

    successResponse(res, {
      statusCode: 200,
      message: "Item removed from cart",
      payload: existingCart,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cartId = req.query.cartId;

  try {
    const deleteCart = await Cart.findByIdAndDelete(cartId);
    if (!deleteCart) {
      throw createError(404, "Cart not found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Cart was deleted successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

export { handleAddToCart, handleGetCart, handleRemoveCart, handleDeleteCart };
