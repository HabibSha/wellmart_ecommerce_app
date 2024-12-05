import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Brand title is required"],
      unique: true,
      minLength: [2, "Brand title should be at least minimum 2 characters"],
      maxLength: [150, "Brand title can not be maximum 150 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Brand slug is required."],
      lowercase: true,
      unique: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    image: {
      type: String,
      required: [true, "Brand image is required"],
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
