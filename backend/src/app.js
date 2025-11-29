import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import productRequestRoutes from "./routes/productRequestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";

// ======================
// CREATE EXPRESS APP FIRST
// ======================
const app = express();

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/uploads", express.static(path.join(__dirname, "..", "public/uploads")));

// ======================
// ROUTES REGISTER
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/product_requests", productRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/comments", commentsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
