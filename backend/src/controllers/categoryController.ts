import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import createError from "http-errors";

import Category from "../models/categoryModel";
import { successResponse } from "./responseController";

// Create a category
const handleCreateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title } = req.body;
  try {
    const existingCategory = await Category.exists({ title });
    if (existingCategory) {
      throw createError(400, "Category already exists");
    }

    const newCategory = {
      title: title,
      slug: slugify(title, { lower: true }),
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
    const categories = await Category.find().select("name slug").lean();
    if (!categories) {
      throw createError(404, "No categories found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Categories returned successfully",
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
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) {
      throw createError(404, "Category not found!");
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
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndDelete({ slug });
    if (!category) {
      throw createError(404, "Category not found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Category was deleted successfully",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a single category
const handleUpdateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndUpdate({ slug });
    if (!category) {
      throw createError(404, "Category not found!");
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
