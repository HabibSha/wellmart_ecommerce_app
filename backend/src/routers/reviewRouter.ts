import { Router } from "express";

import {
  handleCreateReview,
  handleGetReview,
} from "../controllers/reviewController";
import { uploadReviewImage } from "../middleware/fileUpload";
import { isLoggedIn } from "../middleware/auth";
// import validateBrand from "../validation/brand";
// import runValidation from "../validation";

const reviewRouter = Router();

reviewRouter.post(
  "/:slug",
  isLoggedIn,
  uploadReviewImage.single("image"),
  //   validateBrand,
  //   runValidation,
  handleCreateReview
);
reviewRouter.get("/:slug", handleGetReview);

export default reviewRouter;
