import express from "express";
import ProductRequest from "../models/ProductRequest.js";

const router = express.Router();

/* =====================================================
   ⭐ GET ALL APPROVED PRODUCTS (With Category Filter)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: "approved" };

    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    const products = await ProductRequest.find(filter)
      .populate({ path: "supplierId", select: "username email" })
      .sort({ created_at: -1 });

    // ⭐ FIX: guarantee stock field
    const finalProducts = products.map(p => ({
      ...p._doc,
      stock: p.stock ?? p.quantity ?? 0,
    }));

    return res.status(200).json({ success: true, products: finalProducts });
  } catch (err) {
    console.error("Products fetch error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


/* =====================================================
   ⭐ UPDATE STOCK AFTER ORDER (MOST IMPORTANT)
===================================================== */
router.post("/update-stock", async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const product = await ProductRequest.findById(product_id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Reduce stock
    product.stock = product.stock - quantity;

    // Safety: stock can't be negative
    if (product.stock < 0) product.stock = 0;

    await product.save();

    return res.json({
      success: true,
      message: "Stock updated",
      newStock: product.stock
    });
  } catch (err) {
    console.error("Stock update error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
