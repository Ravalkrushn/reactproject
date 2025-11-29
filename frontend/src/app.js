import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import AdminGallery from "./pages/AdminGallery";
import CustomerPanel from "./pages/CustomerPanel";
import SupplierPanel from "./pages/SupplierPanel";
import SupplierProfile from "./pages/SupplierProfile";  // ⭐ IMPORT FIXED

import Index from "./pages/Index";
import Dog from "./pages/Dog";
import Cat from "./pages/Cat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/cart" element={<Cart />} />

        {/* CUSTOMER PROFILE */}
        <Route path="/profile" element={<Profile />} />

        {/* ADMIN PANEL */}
        <Route path="/admin" element={<AdminGallery />} />

        {/* CUSTOMER PANEL */}
        <Route path="/customer" element={<CustomerPanel />} />

        {/* SUPPLIER PANEL */}
        <Route path="/supplier" element={<SupplierPanel />} />

        {/* SUPPLIER PROFILE */}
        <Route path="/supplier/profile" element={<SupplierProfile />} />

        {/* PRODUCTS */}
        <Route path="/dog" element={<Dog />} />
        <Route path="/cat" element={<Cat />} />
      </Routes>
    </Router>
  );
}

export default App;
