import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
      unique: true,
      minLength: [2, "Category title should be at least minimum 2 characters"],
      maxLength: [150, "Category title can not be maximum 150 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Category slug is required."],
      lowercase: true,
      unique: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    // image: {
    //   type: String,
    //   required: [true, "Category image is required"],
    // },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
