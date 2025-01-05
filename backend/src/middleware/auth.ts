import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

// Define user payload type if needed
interface UserPayload {
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isBanned: boolean;
}

// Extend the Request interface
declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}

import { jwtAccessKey } from "../secret";

const isLoggedIn = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw createError(401, "Unauthorized. User not logged in.");
    }

    const decoded = jwt.verify(accessToken, jwtAccessKey) as JwtPayload;
    if (!decoded) {
      throw createError(401, "Invalid access token. Please login");
    }

    // console.log("accessToken = ", accessToken);
    // console.log(decoded);

    req.user = decoded.user;
    next();
  } catch (error) {
    return next(error);
  }
};

const isLoggedOut = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const decoded = jwt.verify(accessToken, jwtAccessKey) as JwtPayload;
      if (decoded) {
        throw createError(400, "User is already logged in");
      }
    }
    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if(!req.user?.isAdmin) {
      throw createError(403, "Forbidden. You must be an admin to access this resource.");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

export { isLoggedIn, isLoggedOut, isAdmin };
