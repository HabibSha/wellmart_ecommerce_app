import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

import User from "../models/userModel";
import { successResponse } from "./responseController";

export const handleUserRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(
        409,
        "User with this email already exists. Please sign in."
      );
    }

    const newUser = { name, email, password };
    const user = await User.create(newUser);

    successResponse(res, {
      statusCode: 201,
      message: "User was registered successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

export default { handleUserRegister };
