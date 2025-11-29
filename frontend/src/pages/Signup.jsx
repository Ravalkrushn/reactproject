import React, { useState } from "react";
import api from "../services/api"; // axios instance (http://localhost:5000/api)

import "../styles/signup.css"; // tumhari CSS file

function Signup() {
  // State for form fields
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    mobile: "",
    address: "",
    password: "",
    confirm_password: "",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation
  const validateForm = () => {
    const {
      username,
      email,
      role,
      mobile,
      address,
      password,
      confirm_password,
    } = formData;

    if (
      !username ||
      !email ||
      !role ||
      !mobile ||
      !address ||
      !password ||
      !confirm_password
    ) {
      alert("All fields are required!");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobile)) {
      alert("Mobile number must be 10 digits only.");
      return false;
    }

    if (password !== confirm_password) {
      alert("Password and Confirm Password do not match.");
      return false;
    }

    return true;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Send to backend (Express + MongoDB)
      const res = await api.post("/auth/signup", formData);

      if (res.data.success) {
        alert("Signup Successful! Please login now.");
        window.location.href = "/signin";
      } else {
        alert(res.data.message || "Error: Could not save data.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="container">
      {/* Left side form */}
      <div className="form-section">
        <div className="form-header">
          <img src="/img/logo.jpg" alt="logo" className="logo" />
          <h2>Create Your Account</h2>
        </div>
        <form id="signupForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your name"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Select Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="" disabled>
                Select the role
              </option>
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          <div className="input-group">
            <label>Mobile No.</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter mobile no."
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            <img
              src={showPassword ? "/img/openeye.png" : "/img/eyeclose.png"}
              className="eyeicon"
              alt="show password"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              placeholder="Confirm password"
              value={formData.confirm_password}
              onChange={handleChange}
            />
            <img
              src={
                showConfirmPassword ? "/img/openeye.png" : "/img/eyeclose.png"
              }
              className="eyeicon1"
              alt="show password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          <button id="signupBtn" type="submit" className="link-button">
            Sign Up
          </button>
        </form>
      </div>

      {/* Right side image */}
      <div className="image-section">
        <img src="/img/banner1.jpg" alt="dog" />
      </div>
    </div>
  );
}

export default Signup;
