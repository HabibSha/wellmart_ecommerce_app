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
  const { name } = req.body;
  try {
    const existingBrand = await Brand.findOne();
    if (existingBrand) {
      throw createError(400, "Brand name is already exists");
    }

    const newBrand = {
      name: name,
      slug: slugify(name),
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

export { handleCreateBrand };
