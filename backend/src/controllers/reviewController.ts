import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

import Review from "../models/reviewModel";
import uploadToCloudinary from "../helper/uploadToCloudinary";
import unlinkImageFromLocal from "../helper/unlinkImageFromLocal";
import Product from "../models/productModel";
import { successResponse } from "./responseController";

const handleCreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const { rating, message } = req.body;

  let uploadedImageResult = null;
  let imageUrl = "";

  try {
    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "File is too large. It must be less than 2 MB");
      }

      uploadedImageResult = await uploadToCloudinary(image.path);
      imageUrl = uploadedImageResult.secure_url;

      // Delete image from local file storage
      unlinkImageFromLocal(image.path);
    }

    const newReview = {
      rating,
      message,
      user: req.user?.userId,
      product: productId,
    };

    const review = await Review.create(newReview);

    await Product.findOneAndUpdate(
      { productId },
      { $push: { review: review._id } }
    );

    successResponse(res, {
      statusCode: 201,
      message: "Review has been successfully created",
      payload: review,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;

  try {
    const review = await Review.findById(productId);
    if (!review) {
      throw createError(404, "Review not found!");
    }

    successResponse(res, {
      statusCode: 201,
      message: "Review was returned successfully",
      payload: review,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;

  try {
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates: { [key: string]: any } = {};

    const allowedFields = ["rating", "message"];

    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const existingReview = await Review.findById(productId);
    if (!existingReview) {
      throw createError(404, "No review found with this id!");
    }

    successResponse(res, {
      statusCode: 201,
      message: "Review was updated successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;

  try {
    const existingReview = await Review.findByIdAndDelete(productId);
    if (!existingReview) {
      throw createError(404, "No review found with this id!");
    }

    successResponse(res, {
      statusCode: 201,
      message: "Review was deleted successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

export {
  handleCreateReview,
  handleGetReview,
  handleUpdateReview,
  handleDeleteReview,
};
