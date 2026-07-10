import React from "react";
import { FaHandHoldingHeart, FaSignOutAlt } from "react-icons/fa";

export default function Navbar({ isLoggedIn, onLogout }) {
  return (
    <div className="hero-header">
      <div className="navbar">
        <div className="brand">
          <span className="brand-icon-badge"><FaHandHoldingHeart /></span>
          SchemeSaathi
        </div>
        {isLoggedIn && (
          <button className="logout-link" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
      <div className="hero-tagline">Find every government &amp; private scheme you're eligible for — ranked by what to do first.</div>
    </div>
  );
}
