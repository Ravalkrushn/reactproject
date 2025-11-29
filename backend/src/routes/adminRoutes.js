import express from "express";
const router = express.Router();

import Order from "../models/Order.js";        // ⭐ Required for Order Reports
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Supplier from "../models/Supplier.js";
import ProductRequest from "../models/ProductRequest.js";

/* ==========================
    ADMIN LOGIN
========================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.json({ success: false, message: "Admin not found" });

    if (admin.password !== password)
      return res.json({ success: false, message: "Incorrect password" });

    return res.json({
      success: true,
      message: "Admin login success",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
});

/* ==========================
   TOTAL CUSTOMERS COUNT
========================== */
router.get("/total-customers", async (req, res) => {
  try {
    const count = await User.countDocuments();
    return res.json({ success: true, count });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
   TOTAL SUPPLIERS COUNT
========================== */
router.get("/total-suppliers", async (req, res) => {
  try {
    const count = await Supplier.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
   TOTAL PENDING REQUESTS
========================== */
router.get("/pending-requests", async (req, res) => {
  try {
    const count = await ProductRequest.countDocuments({ status: "pending" });
    return res.json({ success: true, count });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
   TOTAL REPORTS COUNT
========================== */
router.get("/reports-count", async (req, res) => {
  try {
    return res.json({ success: true, count: 0 });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
      GET ALL SUPPLIERS
========================== */
router.get("/all-suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json({ success: true, suppliers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
      DELETE SUPPLIER
========================== */
router.delete("/delete-supplier/:id", async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
      GET ALL CUSTOMERS
========================== */
router.get("/all-customers", async (req, res) => {
  try {
    const customers = await User.find();
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
      DELETE CUSTOMER
========================== */
router.delete("/delete-customer/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =======================================================
      ⭐⭐⭐  DYNAMIC REPORTS  ⭐⭐⭐
======================================================= */

/* ==========================
   USERS REPORT
========================== */
router.get("/report-users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ==========================
   SUPPLIERS REPORT
========================== */
router.get("/report-suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json({ success: true, data: suppliers });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ==========================
   ORDERS REPORT
========================== */
router.get("/report-orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

export default router;
