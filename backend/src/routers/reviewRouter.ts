import { Router } from "express";

import { handleCreateReview } from "../controllers/reviewController";
import { uploadReviewImage } from "../middleware/fileUpload";
// import validateBrand from "../validation/brand";
// import runValidation from "../validation";

const reviewRouter = Router();

reviewRouter.post(
  "/",
  uploadReviewImage.single("image"),
  //   validateBrand,
  //   runValidation,
  handleCreateReview
);

export default reviewRouter;
