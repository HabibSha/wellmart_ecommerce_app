import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import createError from "http-errors";
import mongoose from "mongoose";
import slugify from "slugify";

import Product from "../models/productModel";
import Category from "../models/categoryModel";
import Brand from "../models/brandModel";
import { successResponse } from "./responseController";
import uploadToCloudinary from "../helper/uploadToCloudinary";
import unlinkImageFromLocal from "../helper/unlinkImageFromLocal";

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
    // Find Category by Name if category (taken from req.body) is not an ObjectId
    let categoryId = category;
    if (!mongoose.isValidObjectId(category)) {
      const categoryDoc = await Category.findOne({ title: category });
      if (!categoryDoc) {
        throw createError(404, `Category '${category}' not found!`);
      }
      categoryId = categoryDoc._id;
    }

    // Find Brand by Name if brand (taken from req.body) is not an ObjectId
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
    unlinkImageFromLocal(image.path);

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

// Get all products
const handleGetProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await Product.find();
    if (!products) {
      throw createError(404, "No Products found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Products returned successfully",
      payload: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single product
const handleGetProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      throw createError(404, "Product not found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Product was returned successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a single product
const handleDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { slug } = req.params;
  try {
    const product = await Product.findOneAndDelete({ slug });
    if (!product) {
      throw createError(404, "Product not found!");
    }

    if (product.image && typeof product.image[0] === "string") {
      // Extract public_id from the Cloudinary image URL
      const imageUrlParts = product.image[0].split("/"); // Split the URL into parts
      const publicIdWithExt = imageUrlParts.slice(-2).join("/"); // Get last two parts and join them
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // Remove file extension

      await cloudinary.uploader.destroy(publicId);
    }

    // remove product from category and brand's products array
    await Category.findOneAndUpdate(product.category, {
      $pull: { products: product._id },
    });
    await Brand.findOneAndUpdate(product.brand, {
      $pull: { products: product._id },
    });

    successResponse(res, {
      statusCode: 200,
      message: "Product was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update product
const handleUpdateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      throw createError(404, "Product not found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Product was returned successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

export {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
};
