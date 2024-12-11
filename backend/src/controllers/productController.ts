import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import slugify from "slugify";
import fs from "fs";

import Product from "../models/productModel";
import { successResponse } from "./responseController";
import uploadToCloudinary from "../helper/uploadToCloudinary";

// Create a new product
const handleCreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, description, price, quantity, sold, category, brand } =
    req.body;
  try {
    const image = req.file;
    if (!image) {
      throw createError(400, "Product image is required");
    }

    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "File is too large. It must be less than 2 MB");
    }

    const existingProduct = await Product.exists({ title });
    if (existingProduct) {
      throw createError(409, "Product with this name already exists");
    }

    const newProduct = await Product.create({
      title,
      slug: slugify(title),
      description,
      price,
      quantity,
      sold,
      category,
      brand,
    });

    successResponse(res, {
      statusCode: 201,
      message: "Product created successfully",
      payload: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export { handleCreateProduct };
