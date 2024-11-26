import express, { Request, Response, NextFunction, Application } from "express";
import createError from "http-errors";
import dotenv from "dotenv";
import cors from "cors";

import { errorResponse } from "./controllers/responseController";

const app: Application = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({ message: "hello" });
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404, "Router not found!"));
});

interface AppError extends Error {
  status?: number;
}

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  return errorResponse(res, {
    statusCode: err.status || 500,
    message: err.message || "Internal server error!",
  });
});

app.listen(5000, () => {
  console.log(`server is running at http://localhost:5000`);
});
