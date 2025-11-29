import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const updateProfile = async (data) => {
  try {
    const res = await axios.put(`${API_URL}/update-profile`, data);
    alert(res.data.message);
  } catch (err) {
    console.error("Update profile error:", err);
    alert("Error updating profile");
  }
};
