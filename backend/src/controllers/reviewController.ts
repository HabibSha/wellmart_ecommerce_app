import { Request, Response, NextFunction } from "express";

const handleCreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { rating, message } = req.body;

  try {
  } catch (error) {
    next(error);
  }
};

export { handleCreateReview };
