import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    message: { type: String },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
