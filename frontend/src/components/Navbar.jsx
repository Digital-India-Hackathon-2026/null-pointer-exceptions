import React from "react";
import { FaHandHoldingHeart, FaSignOutAlt } from "react-icons/fa";

export default function Navbar({ isLoggedIn, onLogout }) {
  return (
    <div className="navbar">
      <div className="brand">
        <FaHandHoldingHeart color="#2563eb" />
        SchemeSaathi
      </div>
      {isLoggedIn && (
        <button className="btn-link" onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaSignOutAlt /> Logout
        </button>
      )}
    </div>
  );
}
