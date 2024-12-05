import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import bcrypt from "bcryptjs";

import User from "../models/userModel";

const handleUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw createError(
        404,
        "User with this email does not exist. Please sign up."
      );
    }

    const matchPassword = bcrypt.compareSync(password, existingUser.password);
    if (!matchPassword) {
      throw createError(
        401,
        "Invalid email or password. Please input valid credentials."
      );
    }

    if (existingUser.isBanned) {
      throw createError(403, "You are banned. Please contact with authority.");
    }
  } catch (error) {
    next(error);
  }
};

export { handleUserLogin };
