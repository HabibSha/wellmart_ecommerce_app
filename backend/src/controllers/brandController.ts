import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import createError from "http-errors";

import Brand from "../models/brandModel";
import { successResponse } from "./responseController";

// Create a brand
const handleCreateBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title } = req.body;
  try {
    const existingBrand = await Brand.exists({ title });
    if (existingBrand) {
      throw createError(400, "Brand title is already exists");
    }

    const newBrand = {
      title: title,
      slug: slugify(title, { lower: true }),
    };

    const brand = await Brand.create(newBrand);

    successResponse(res, {
      statusCode: 200,
      message: "Brand was created successfully",
      payload: brand,
    });
  } catch (error) {
    next(error);
  }
};

// Get all brands
const handleGetBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const brands = await Brand.find().select("title slug").lean();
    if (!brands) {
      throw createError(404, "No brands found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Brands were returned successfully",
      payload: brands,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single brand
const handleGetBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { slug } = req.params;

  try {
    const brand = await Brand.findOne({ slug });
    if (!brand) {
      throw createError(404, "No brand found with this slug!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Brand was returned successfully",
      payload: brand,
    });
  } catch (error) {
    next(error);
  }
};

// Delete brand
const handleDeleteBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { slug } = req.params;

  try {
    const brand = await Brand.findOneAndDelete({ slug });
    if (!brand) {
      throw createError(404, "No brand found with this slug!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Brand was deleted successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

// Update brand
const handleUpdateBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { slug } = req.params;
  const { title } = req.body;

  try {
    const filter = { slug };
    const updates = { $set: { title: title, slug: slugify(slug) } };
    const option = { new: true };

    const updatedBrand = await Brand.findOneAndUpdate({
      filter,
      updates,
      option,
    });
    if (!updatedBrand) {
      throw createError(404, "No brand found with this slug!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Brand was updated successfully",
      payload: updatedBrand,
    });
  } catch (error) {
    next(error);
  }
};

export {
  handleCreateBrand,
  handleGetBrands,
  handleGetBrand,
  handleDeleteBrand,
  handleUpdateBrand,
};
