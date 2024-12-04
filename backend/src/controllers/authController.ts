import { Request, Response, NextFunction } from "express";

const handleUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
  } catch (error) {
    next(error);
  }
};

export { handleUserLogin };
