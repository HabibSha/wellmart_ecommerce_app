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
import extractPublicId from "../helper/extractPublicId";

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
      images: imageUrl,
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.page as string) || 5;

    const products = await Product.find()
      .populate([
        { path: "category", select: "-__v -products" },
        { path: "brand", select: "-__v -products" },
      ])
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // recent created products will be shown on the first page

    if (!products) {
      throw createError(404, "No Products found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Products returned successfully",
      payload: {
        products: products,
        pagination: {
          // totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1,
          nextPage: page + 1,
          totalNumberOfProducts: products.length,
        },
      },
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
    const product = await Product.findOne({ slug }).populate([
      { path: "category", select: "-__v -products" },
      { path: "brand", select: "-__v -products" },
      {
        path: "review",
        select: "-__v -product",
        populate: {
          path: "user",
          select: "name",
        },
      },
    ]);
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

    if (product.image && product.image.length > 0) {
      // Iterate over each image URL in the array and delete it from Cloudinary
      for (const imageUrl of product.image) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image: ${publicId}`);
        }
      }
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
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates: { [key: string]: any } = {};

    const allowedFields = [
      "title",
      "description",
      "price",
      "sold",
      "quantity",
      "category",
      "brand",
    ];

    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
        if (key === "title") {
          updates.slug = slugify(req.body[key]);
        }
      }
    }

    console.log(req.body);
    console.log(allowedFields);

    const existingProduct = await Product.findOne({ slug });
    if (!existingProduct) {
      throw createError(404, "Product not found!");
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      { $set: updates },
      updateOptions
    );
    if (!updatedProduct) {
      throw createError(400, "Product was not updated successfully");
    }

    console.log(updatedProduct);
    console.log(updates);

    // handle category changes
    if (
      req.body.category &&
      req.body.category !== existingProduct.category.toString()
    ) {
      // remove from previous category
      await Category.findByIdAndUpdate(existingProduct.category, {
        $pull: { products: existingProduct._id },
      });

      // add to the updated category
      await Category.findByIdAndUpdate(req.body.category, {
        $push: { products: updatedProduct._id },
      });
    }

    // handle brand changes
    if (req.body.brand && req.body.brand !== existingProduct.brand.toString()) {
      await Brand.findByIdAndUpdate(existingProduct.brand, {
        $pull: { products: existingProduct._id },
      });

      await Brand.findByIdAndUpdate(req.body.brand, {
        $push: { products: updatedProduct._id },
      });
    }

    successResponse(res, {
      statusCode: 200,
      message: "Product was updated successfully",
      payload: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// TODO: Get products by Category & Brand

const handleGetProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const category = req.query.category;
  try {
    const products = await Product.find({ category }).populate([
      { path: "category", select: "-__v -products" },
      { path: "brand", select: "-__v -products" },
    ]);

    if (!products) throw createError(404, "No products found!");

    successResponse(res, {
      statusCode: 200,
      message: "Products were returned successfully",
      payload: products,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetProductsByBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const brand = req.query.category;
  try {
    const products = await Product.find({ brand }).populate([
      { path: "category", select: "-__v -products" },
      { path: "brand", select: "-__v -products" },
    ]);

    if (!products) throw createError(404, "No products found!");

    successResponse(res, {
      statusCode: 200,
      message: "Products were returned successfully",
      payload: products,
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
  handleGetProductsByCategory,
  handleGetProductsByBrand,
};
