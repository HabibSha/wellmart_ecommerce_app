import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

import User from "../models/userModel";
import { successResponse } from "./responseController";

// Create a new user - Process register
const handleUserRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  if (!req.file) {
    throw createError(400, "No file uploaded");
  }
  const image = req.file?.path;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(
        409,
        "User with this email already exists. Please sign in."
      );
    }

    const newUser = { name, email, password, image };
    const user = await User.create(newUser);

    successResponse(res, {
      statusCode: 201,
      message: "Your account has been successfully created",
      payload: [user],
    });
  } catch (error) {
    next(error);
  }
};

// Get all the users by admin
const handleGetAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find();

    successResponse(res, {
      statusCode: 200,
      message: "User returned successfully",
      payload: users,
    });
  } catch (error) {
    next(error);
  }
};

export { handleUserRegister, handleGetAllUsers };
