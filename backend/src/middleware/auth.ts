import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";

import { jwtAccessKey } from "../secret";

const isLoggedIn = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw createError(401, "Access token not found. Please login");
    }

    const decoded = jwt.verify(accessToken, jwtAccessKey);
    if (!decoded) {
      throw createError(401, "Invalid access token. Please login");
    }

    console.log("accessToken = ", accessToken);
    console.log(decoded);

    // req.user = decoded.user;
    next();
  } catch (error) {
    return next(error);
  }
};

// const isLoggedOut = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const accessToken = req.cookies.accessToken;
//     if (!accessToken) {
//       throw createError(401, "Access token not found. Please login");
//     }

//     const decoded = jwt.verify(accessToken, jwtAccessKey);
//     if (!decoded) {
//       throw createError(401, "Invalid access token. Please login");
//     }

//     // req.user = decoded.user;
//     next();
//   } catch (error) {
//     return next(error);
//   }
// };

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.body.admin;
    if (!accessToken) {
      throw createError(401, "Access token not found. Please login");
    }

    const decoded = jwt.verify(accessToken, jwtAccessKey);
    if (!decoded) {
      throw createError(401, "Invalid access token. Please login");
    }
  } catch (error) {
    return next(error);
  }
};

export { isLoggedIn, isAdmin };
