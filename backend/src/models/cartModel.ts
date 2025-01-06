import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 0 },
  cartTotal: { type: Number },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
