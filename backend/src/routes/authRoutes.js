import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Supplier from "../models/Supplier.js";

const router = express.Router();

/* -----------------------------------
   🟢 SIGNUP (User + Supplier)
----------------------------------- */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, role, mobile, address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "supplier") {
      const existingSupplier = await Supplier.findOne({ email });
      if (existingSupplier) {
        return res.json({ success: false, message: "Supplier email already exists!" });
      }

      const newSupplier = new Supplier({
        username,
        email,
        role,
        mobile,
        address,
        password: hashedPassword,
      });
      await newSupplier.save();
      return res.json({ success: true, message: "Supplier registered successfully" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists!" });
    }

    const newUser = new User({
      username,
      email,
      role,
      mobile,
      address,
      password: hashedPassword,
    });
    await newUser.save();

    return res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* -----------------------------------
   🟢 SIGNIN (User + Supplier)
----------------------------------- */
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check in both collections
    let user = await User.findOne({ email });
    let role = "user";

    if (!user) {
      user = await Supplier.findOne({ email });
      role = "supplier";
      if (!user)
        return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid password" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: role,
      },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* -----------------------------------
   🟢 GET PROFILE (Fetch user data)
----------------------------------- */
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let user = await User.findById(id);          // 🔥 password included
    if (!user) user = await Supplier.findById(id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


/* -----------------------------------
   🟢 UPDATE PROFILE
----------------------------------- */
router.put("/update-profile", async (req, res) => {
  try {
    const { id, role, username, email, mobile, address, password } = req.body;

    const Model = role === "supplier" ? Supplier : User;
    const user = await Model.findById(id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
