import { Request, Response, NextFunction } from "express";

import Review from "../models/reviewModel";
import { successResponse } from "./responseController";

const handleCreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params;
  const { rating, message } = req.body;

  try {
    const newReview = {
      rating,
      message,
      user: req.userId,
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
