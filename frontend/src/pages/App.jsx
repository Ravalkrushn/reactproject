import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin"; 
import AdminGallery from "./pages/AdminGallery";  
import CustomerPanel from "./pages/CustomerPanel";
import SupplierPanel from "./pages/SupplierPanel";
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
        <Route path="/profile" element={<Profile />} />
         <Route path="/admin" element={<AdminLogin />} />
        <Route path="/AdminGallery" element={<AdminGallery />} />
        <Route path="/customer" element={<CustomerPanel />} />
        <Route path="/supplier" element={<SupplierPanel />} />
        <Route path="/dog" element={<Dog />} />
       <Route path="/cat" element={<Cat />} />
      </Routes>
    </Router>
  );
}

export default App;
