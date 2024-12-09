import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import fs from "fs";

import User from "../models/userModel";
import { successResponse } from "./responseController";
import uploadToCloudinary from "../helper/uploadToCloudinary";
import { defaultImagePath } from "../secret";

// Create a new user - Process register
const handleUserRegister = async (
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

    let imageUrl: string = defaultImagePath;

    if (req.file) {
      const file = req.file;

      if (file.size > 1024 * 1024 * 2) {
        throw createError(400, "File too large. It must be less than 2 MB");
      }

      const image = file?.path;

      // Upload the file to Cloudinary
      const result = await uploadToCloudinary(image);
      if (!result || !result.secure_url) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      imageUrl = result.secure_url;

      // Optionally delete the file from the local server
      fs.unlinkSync(image);
    }

    const newUser = { name, email, password, image: imageUrl };
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
