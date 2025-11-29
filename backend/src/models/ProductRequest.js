import mongoose from "mongoose";

const productRequestSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  product_name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },

  // QUANTITY = user requested quantity
  quantity: { type: Number, required: true },

  // ⭐ NEW FIELD — THIS IS YOUR STOCK
  stock: { type: Number, required: true },

  description: { type: String, required: true },
  image: { type: String },

  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Product_Request", productRequestSchema);
