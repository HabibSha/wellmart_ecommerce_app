import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import mongoose from "mongoose";
import slugify from "slugify";
import fs from "fs";

import Product from "../models/productModel";
import Category from "../models/categoryModel";
import Brand from "../models/brandModel";
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
    // Check if category and brand are valid ObjectId
    if (!mongoose.isValidObjectId(category)) {
      throw createError(400, "Invalid category ID");
    }
    if (!mongoose.isValidObjectId(brand)) {
      throw createError(400, "Invalid brand ID");
    }

    // Check if category and brand exist
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      throw createError(404, "Category not found");
    }

    const existingBrand = await Brand.findById(brand);
    if (!existingBrand) {
      throw createError(404, "Brand not found");
    }

    const image = req.file;
    let imageUrl = "";
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "File is too large. It must be less than 2 MB");
      }

      const result = await uploadToCloudinary(image.path);
      imageUrl = result.secure_url;

      // delete image from local file
      fs.unlinkSync(image.path);
    }

    const existingProduct = await Product.exists({ title });
    if (existingProduct) {
      throw createError(409, "Product with this name already exists");
    }

    const slug = slugify(title, { lower: true, strict: true });

    const newProduct = await Product.create({
      title,
      slug,
      description,
      price,
      quantity,
      sold,
      image: imageUrl,
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
