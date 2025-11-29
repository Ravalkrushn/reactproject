import React, { useState } from "react";
import api from "../services/api";
import "../styles/signin.css";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email aur password dono bharna zaroori hai!");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Sahi email daalo!");
      return;
    }

    setLoading(true);

    try {
      // =====================================
      // 🔥 STEP 1 — ADMIN LOGIN TRY
      // =====================================
      try {
        const adminRes = await api.post("/admin/login", { email, password });

        if (adminRes.data.success) {
          localStorage.setItem("authUser", JSON.stringify(adminRes.data.admin));

          alert("Admin Login Successful!");
          window.location.href = "/admin"; // Admin panel
          return;
        }
      } catch (err) {
        console.log("Not admin, checking normal user...");
      }

      // =====================================
      // 🔥 STEP 2 — NORMAL USER LOGIN
      // =====================================
      const userRes = await api.post("/auth/signin", { email, password });
      const data = userRes.data;

      if (!data.success) {
        alert(data.message || "Login failed!");
        return;
      }

      const userData = data.user;

      // ⭐ SAVE ALL USER DETAILS (REQUIRED FOR PROFILE PAGE)
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("mobile", userData.mobile);
      localStorage.setItem("address", userData.address);

      // Optional full user store
      localStorage.setItem("authUser", JSON.stringify(userData));

      alert("Login Successful!");

      // User redirection
      if (userData.role === "supplier") {
        window.location.href = "/supplier";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box">
      <div className="left-side">
        <img src="/img/logo.jpg" className="logo1" alt="logo" />
        <h2>Sign in to continue</h2>

        <form id="signinform" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="input-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="password-container">
              <img
                src={showPassword ? "/img/openeye.png" : "/img/eyeclose.png"}
                className="eye-icon"
                alt="show password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <a href="#" className="forgot">
            forget password?
          </a>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="signin">
            Don't Have Account? <a href="/signup">Create a new account</a>
          </p>
        </form>
      </div>

      <div className="right-side">
        <img src="/img/banner1.jpg" alt="Dog" className="dog-image" />
      </div>
    </div>
  );
}

export default Signin;
