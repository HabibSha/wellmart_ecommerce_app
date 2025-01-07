import express, { Request, Response, NextFunction, Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import createError from "http-errors";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorResponse } from "./controllers/responseController";
import { port } from "./secret";
import connectDatabase from "./config/database";
import userRouter from "./routers/userRouter";
import productRouter from "./routers/productRouter";
import categoryRouter from "./routers/categoryRouter";
import brandRouter from "./routers/brandRouter";
import reviewRouter from "./routers/reviewRouter";
import cartRouter from "./routers/cartRouter";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));
app.use(cookieParser());

//todo: Routers
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/brands", brandRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/cart", cartRouter);

app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({ message: "hello" });
});

//todo: Not found error-handling middleware
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404, "Router not found!"));
});

//todo: Custom error-handling middleware

interface AppError {
  status?: number;
  message?: string;
}

app.use(
  (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
    errorResponse(res, {
      statusCode: err.status || 500,
      message: err.message || "Internal server error!",
    });
  }
);

// todo: Server
app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDatabase();
});
