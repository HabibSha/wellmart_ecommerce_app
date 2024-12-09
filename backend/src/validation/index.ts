import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { errorResponse } from "../controllers/responseController";

const runValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export default runValidation;
