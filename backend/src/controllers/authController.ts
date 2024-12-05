import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import bcrypt from "bcryptjs";

import User from "../models/userModel";
import generateToken from "../helper/jsonwebtoken";
import { successResponse } from "./responseController";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../helper/cookie";
import { jwtAccessKey, jwtRefreshKey } from "../secret";

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

    const accessToken = generateToken({
      payload: { existingUser },
      secretKey: jwtAccessKey,
      expiresIn: "5m",
    });
    setAccessTokenCookie(res, accessToken);

    const refreshToken = generateToken({
      payload: { existingUser },
      secretKey: jwtRefreshKey,
      expiresIn: "7d",
    });
    setRefreshTokenCookie(res, refreshToken);

    // hiding password from result
    const { password: hidePassword, ...user } = existingUser.toObject();
    // delete userWithoutPassword.password;

    successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully",
      payload: [user],
    });
  } catch (error) {
    next(error);
  }
};

export { handleUserLogin };
