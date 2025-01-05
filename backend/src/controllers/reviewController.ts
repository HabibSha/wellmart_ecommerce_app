import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

import Review from "../models/reviewModel";
import uploadToCloudinary from "../helper/uploadToCloudinary";
import unlinkImageFromLocal from "../helper/unlinkImageFromLocal";
import { successResponse } from "./responseController";

const handleCreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params;
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
    } else {
      throw createError(400, "No image file Provided");
    }

    const newReview = {
      rating,
      message,
      user: req.user?.userId,
      product: slug,
    };

    const review = await Review.create(newReview);

    successResponse(res, {
      statusCode: 201,
      message: "Review has been successfully created",
      payload: review,
    });
  } catch (error) {
    next(error);
  }
};

export { handleCreateReview };
