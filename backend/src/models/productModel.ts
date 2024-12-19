import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      unique: true,
      minLength: [2, "Product title should be at least minimum 2 characters"],
      maxLength: [150, "Product title can not be maximum 150 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minLength: [
        3,
        "Product description should be at least minimum 3 characters",
      ],
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not a valid price! Price must be greater than 0.`,
      },
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required."],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not a valid quantity! Quantity must be greater than 0.`,
      },
    },
    sold: {
      type: Number,
      trim: true,
      default: 0,
    },
    images: [{ type: String, required: [true, "Product image is required"] }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
