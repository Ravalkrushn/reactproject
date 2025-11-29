import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
