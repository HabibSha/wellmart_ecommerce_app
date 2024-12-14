import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
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

  let uploadedImageResult = null;
  let imageUrl = "";

  try {
    // Find Category by Name if category is not an ObjectId
    let categoryId = category;
    if (!mongoose.isValidObjectId(category)) {
      const categoryDoc = await Category.findOne({ title: category });
      if (!categoryDoc) {
        throw createError(404, `Category '${category}' not found!`);
      }
      categoryId = categoryDoc._id;
    }

    // Find Brand by Name if brand is not an ObjectId
    let brandId = brand;
    if (!mongoose.isValidObjectId(brand)) {
      const brandDoc = await Brand.findOne({ title: brand });
      if (!brandDoc) {
        throw createError(404, `Brand '${brand}' not found!`);
      }
      brandId = brandDoc._id;
    }

    const existingProduct = await Product.exists({ title });
    if (existingProduct) {
      throw createError(409, "Product with this name already exists");
    }

    // handle upload image
    const image = req.file;
    if (!image) {
      throw createError(400, "Product image is required");
    }

    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "File is too large. It must be less than 2 MB");
    }

    uploadedImageResult = await uploadToCloudinary(image.path);
    imageUrl = uploadedImageResult.secure_url;

    // Delete image from local file storage
    fs.unlinkSync(image.path);

    const slug = slugify(title, { lower: true, strict: true });

    const newProduct = await Product.create({
      title,
      slug,
      description,
      price,
      quantity,
      sold: sold || 0,
      image: imageUrl,
      category: categoryId,
      brand: brandId,
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
    // Cleanup: delete the uploaded image from Cloudinary if an error occurred
    if (uploadedImageResult?.public_id) {
      await cloudinary.uploader.destroy(uploadedImageResult.public_id);
    }
    next(error);
  }
};

export { handleCreateProduct };
