import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/profile.css";

function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // FETCH USER DATA FROM MONGODB
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = localStorage.getItem("userId");
        if (!id) {
          setMessage("Please sign in again.");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/auth/profile/${id}`
        );

        if (res.data.success) {
          setUser({
            username: res.data.user.username,
            email: res.data.user.email,
            mobile: res.data.user.mobile,
            address: res.data.user.address,
            password: "", // never show hashed password
          });
        } else {
          setMessage("Could not fetch profile.");
        }
      } catch (err) {
        setMessage("Please sign in again.");
      }
    };

    fetchUser();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // SAVE UPDATED PROFILE
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const id = localStorage.getItem("userId");
      const role = localStorage.getItem("role");

      // Prevent overwriting password when left empty
      const { password, ...safeUser } = user;

      const payload = {
        id,
        role,
        ...safeUser,
        ...(password ? { password } : {}), // send password ONLY if user typed it
      };

      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        payload
      );

      if (res.data.success) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Something went wrong!");
    }
  };

  const handleCancel = () => {
    window.location.href = "/";
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Your Profile</h2>

        {message && <p className="msg">{message}</p>}

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

          <div className="btn-group">
            <button className="save-btn" type="submit">
              Save
            </button>
            <button className="cancel-btn" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
