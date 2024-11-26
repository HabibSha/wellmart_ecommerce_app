import express, {
  Request,
  Response,
  NextFunction,
  Application,
  ErrorRequestHandler,
} from "express";
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

// Define the error handler explicitly
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  return errorResponse(res, {
    statusCode: err.status || 500,
    message: err.message || "Internal server error!",
  });
};

app.use(errorHandler);

app.listen(5000, () => {
  console.log(`server is running at http://localhost:5000`);
});
