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
    // Find Category by Name if category is not an ObjectId
    let categoryId = category;
    if (!mongoose.isValidObjectId(category)) {
      const categoryDoc = await Category.findOne({ category });
      if (!categoryDoc) {
        throw createError(404, `Category '${category}' not found!`);
      }
      categoryId = categoryDoc._id;
    }

    // Find Brand by Name if brand is not an ObjectId
    let brandId = brand;
    if (!mongoose.isValidObjectId(brand)) {
      const brandDoc = await Brand.findOne({ brand });
      if (!brandDoc) {
        throw createError(404, `Brand '${brand}' not found!`);
      }
      brandId = brandDoc._id;
    }

    if (!mongoose.isValidObjectId(brand)) {
      throw createError(400, "Invalid brand ID");
    }

    // handle upload image
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

    // Update the category's products array
    await Category.findByIdAndUpdate(
      categoryId,
      { $push: { products: newProduct._id } },
      { new: true }
    );

    // Update the brand's products array
    await Brand.findByIdAndUpdate(
      brandId,
      { $push: { products: newProduct._id } },
      { new: true }
    );

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
