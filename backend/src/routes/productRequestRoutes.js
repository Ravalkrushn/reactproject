import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ProductRequest from "../models/ProductRequest.js";

const router = express.Router();

// ===== Multer Setup ===== //
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

// =====================================
// 03️⃣ Admin → Get All Supplier Requests
// =====================================
router.get("/admin/all", async (req, res) => {
  try {
    const requests = await ProductRequest.find()
      .populate({ path: "supplierId", select: "username email" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===============================
// 01️⃣ Supplier → Submit Request
// ===============================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { supplierId, product_name, category, price, quantity, description } =
      req.body;

    if (!supplierId || !product_name || !category || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newRequest = new ProductRequest({
      supplierId,
      product_name,
      category,
      price,

      quantity,          // original item quantity
      stock: quantity,   // ⭐ NEW — REAL STOCK VALUE

      description,
      image: imagePath,
      status: "pending",
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Product request submitted successfully!",
      request: newRequest,
    });
  } catch (err) {
    console.error("Error saving product request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===========================================
// 02️⃣ Supplier → Get Their Own Requests
// ===========================================
router.get("/:supplierId", async (req, res) => {
  try {
    const { supplierId } = req.params;

    const requests = await ProductRequest.find({ supplierId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (err) {
    console.error("Error fetching supplier requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =====================================
// 04️⃣ Admin → Update Approval Status
// =====================================
router.put("/admin/update-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const requestFound = await ProductRequest.findById(id);
    if (!requestFound) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    requestFound.status = status;
    await requestFound.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      request: requestFound,
    });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
