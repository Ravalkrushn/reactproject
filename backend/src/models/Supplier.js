
import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "supplier" },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Supplier ||
  mongoose.model("Supplier", SupplierSchema);
