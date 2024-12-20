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

// Get all brand
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

export { handleCreateCategory, handleGetCategories };
