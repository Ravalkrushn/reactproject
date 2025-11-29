import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/supplierprofile.css";

function SupplierProfile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (!id || role !== "supplier") {
      setMsg("Please sign in as supplier.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/profile/${id}`
        );

        if (res.data.success) {
          setUser({
            username: res.data.user.username,
            email: res.data.user.email,
            mobile: res.data.user.mobile,
            address: res.data.user.address,
            password: "",
          });
        } else {
          setMsg("Could not load profile.");
        }
      } catch (err) {
        setMsg("Server error.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();

    const id = localStorage.getItem("userId");
    const role = "supplier";

    const payload = {
      id,
      role,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      ...(user.password ? { password: user.password } : {}),
    };

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        payload
      );

      if (res.data.success) setMsg("Profile updated successfully!");
      else setMsg(res.data.message);
    } catch (err) {
      setMsg("Update failed.");
    }
  };

  const goBack = () => {
    window.location.href = "/supplier";
  };

  return (
    <div className="supplier-profile-page">
      <div className="supplier-profile-card">
        <h2>Supplier Profile</h2>

        {msg && <p className="msg">{msg}</p>}

        <form onSubmit={handleSave}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />

          <label>Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={user.mobile}
            onChange={handleChange}
          />

          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
          />

          <label>Password (Optional):</label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password (optional)"
            value={user.password}
            onChange={handleChange}
          />

          <div className="btn-box">
            <button className="save-btn" type="submit">
              Save
            </button>
            <button className="cancel-btn" type="button" onClick={goBack}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupplierProfile;
