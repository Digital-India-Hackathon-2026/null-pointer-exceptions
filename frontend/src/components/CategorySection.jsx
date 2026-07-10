import React from "react";
import { FaTractor, FaWheelchair, FaFemale, FaHeartbeat, FaUserGraduate, FaBriefcase, FaHandsHelping } from "react-icons/fa";
import SchemeCard from "./SchemeCard.jsx";

const CATEGORY_META = {
  farmer: { label: "As a Farmer", icon: <FaTractor />, color: "#2F7A4A" },
  disabled: { label: "As a Person with a Disability", icon: <FaWheelchair />, color: "#6B3FA0" },
  widow: { label: "Widow Support", icon: <FaFemale />, color: "#B23A48" },
  woman: { label: "For Women", icon: <FaFemale />, color: "#C4568A" },
  "low-income": { label: "Low-Income Support", icon: <FaHandsHelping />, color: "#E08D2C" },
  health: { label: "Healthcare", icon: <FaHeartbeat />, color: "#B23A48" },
  student: { label: "Education", icon: <FaUserGraduate />, color: "#1E3A5F" },
  entrepreneur: { label: "Business & Entrepreneurship", icon: <FaBriefcase />, color: "#1E3A5F" }
};

export default function CategorySection({ category, schemes, onSelectScheme, startRank }) {
  const meta = CATEGORY_META[category] || { label: category, icon: <FaHandsHelping />, color: "#1E3A5F" };

  return (
    <div>
      <div className="category-heading">
        <span className="category-dot" style={{ background: meta.color }}></span>
        <h3>{meta.label}</h3>
      </div>
      <div className="scheme-grid">
        {schemes.map((scheme, i) => (
          <SchemeCard
            key={scheme._id + category}
            scheme={scheme}
            rank={startRank + i}
            accentColor={meta.color}
            onClick={onSelectScheme}
          />
        ))}
      </div>
    </div>
  );
}