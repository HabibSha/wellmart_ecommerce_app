import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import createError from "http-errors";

import User from "../models/userModel";
import { successResponse } from "./responseController";
import uploadToCloudinary from "../helper/uploadToCloudinary";
import { defaultImagePath } from "../secret";
import unlinkImageFromLocal from "../helper/unlinkImageFromLocal";

// Create a new user - Process register
const handleUserRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  let uploadedImageResult = null;
  let imageUrl: string = defaultImagePath;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(
        409,
        "User with this email already exists. Please sign in."
      );
    }

    // handle image upload
    if (req.file) {
      const image = req.file;

      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "File too large. It must be less than 2 MB");
      }

      uploadedImageResult = await uploadToCloudinary(image?.path);
      if (!uploadedImageResult || !uploadedImageResult.secure_url) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      imageUrl = uploadedImageResult.secure_url;

      // Optionally delete the file from the local server
      unlinkImageFromLocal(image.path);
    }

    const newUser = { name, email, password, image: imageUrl };
    const user = await User.create(newUser);

    successResponse(res, {
      statusCode: 201,
      message: "Your account has been successfully created",
      payload: user,
    });
  } catch (error) {
    // Cleanup: delete the uploaded image from Cloudinary if an error occurred
    if (uploadedImageResult?.public_id) {
      await cloudinary.uploader.destroy(uploadedImageResult.public_id);
    }
    next(error);
  }
};

// Get all users by admin
const handleGetAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find();
    if (!users) {
      throw createError(404, "No users found!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Users were returned successfully",
      payload: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get single user
const handleGetSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw createError(404, "No user found with this id!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "User was returned successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

// update user
const handleUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.params.id;
  const { email } = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId });
    if (!user) {
      throw createError(404, "No user found with this id!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "User was updated successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

// delete user
const handleDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    if (!user) {
      throw createError(404, "No user found with this id!");
    }

    successResponse(res, {
      statusCode: 200,
      message: "User was deleted successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

export {
  handleUserRegister,
  handleGetAllUsers,
  handleGetSingleUser,
  handleUpdateUser,
  handleDeleteUser,
};
