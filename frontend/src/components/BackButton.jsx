import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./backbutton.css";

function BackButton({ onClick }) {
  const navigate = useNavigate();

  return (
    <button
      className="back-btn"
      onClick={() => {
        if (onClick) return onClick();  // ⭐ Cart.jsx will use this
        navigate("/");                 // ⭐ Default: GO TO index.jsx
      }}
    >
      <FaArrowLeft className="back-icon" />
      Back
    </button>
  );
}

export default BackButton;
