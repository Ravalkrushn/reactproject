import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    payment_method: { type: String, required: true },

    items: [
      {
        product_id: String,
        product_name: String,
        quantity: Number,
        price: Number,
        subtotal: Number,
      }
    ],

    total: Number,
    created_at: { type: Date, default: Date.now }
  },
  {
    collection: "cart_master"   // 🔥 THIS IS YOUR TABLE NAME
  }
);

export default mongoose.model("Order", orderSchema);
