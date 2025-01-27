import { Router } from "express";

import {
  handleCreateReview,
  handleGetReview,
  handleUpdateReview,
} from "../controllers/reviewController";
import { uploadReviewImage } from "../middleware/fileUpload";
import { isLoggedIn } from "../middleware/auth";
// import validateBrand from "../validation/brand";
// import runValidation from "../validation";

const reviewRouter = Router();

reviewRouter.post(
  "/",
  isLoggedIn,
  uploadReviewImage.single("image"),
  //   validateBrand,
  //   runValidation,
  handleCreateReview
);
reviewRouter.get("/", handleGetReview);
reviewRouter.put("/", handleUpdateReview);

export default reviewRouter;
