import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import createError from "http-errors";

import Category from "../models/categoryModel";
import { successResponse } from "./responseController";
import uploadToCloudinary from "../helper/uploadToCloudinary";
import unlinkImageFromLocal from "../helper/unlinkImageFromLocal";

// Create a category
const handleCreateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title } = req.body;

  let uploadedImageResult = null;
  let imageUrl = "";

  try {
    const existingCategory = await Category.exists({ title });
    if (existingCategory) {
      throw createError(400, "Category already exists");
    }

    // handle upload image
    const image = req.file;
    if (!image) {
      throw createError(400, "Category image is required");
    }

    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "File is too large. It must be less than 2 MB");
    }

    uploadedImageResult = await uploadToCloudinary(image.path);
    imageUrl = uploadedImageResult.secure_url;

    // Delete image from local file storage
    unlinkImageFromLocal(image.path);

    const newCategory = {
      title: title,
      slug: slugify(title, { lower: true }),
      image: imageUrl,
    };

    const category = await Category.create(newCategory);

    successResponse(res, {
      statusCode: 200,
      message: "Category was created successfully",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

// Get all category
const handleGetCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Category.find().select("title slug").lean();
    if (!categories) {
      throw createError(404, "No categories found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Categories were returned successfully",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single category
const handleGetCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { slug } = req.params;

  try {
    const category = await Category.findOne({ slug });
    if (!category) {
      throw createError(404, "No category found with this slug!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Category was returned successfully",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a single category
const handleDeleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { slug } = req.params;

  try {
    const category = await Category.findOneAndDelete({ slug });
    if (!category) {
      throw createError(404, "No category found with this slug!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Category was deleted successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

// Update category
const handleUpdateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { slug } = req.params;
  const { title } = req.body;

  try {
    const filter = { slug };
    const updates = { $set: { title: title, slug: slugify(title) } };
    const option = { new: true };

    const category = await Category.findOneAndUpdate(
      filter,
      updates,
      option
    ).select("-products");
    if (!category) {
      throw createError(404, "No category found with this slug!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Category was updated successfully",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

export {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleDeleteCategory,
  handleUpdateCategory,
};
