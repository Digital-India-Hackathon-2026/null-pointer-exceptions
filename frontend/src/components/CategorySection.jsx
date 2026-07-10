import React from "react";
import { FaTractor, FaWheelchair, FaFemale, FaHeartbeat, FaUserGraduate, FaBriefcase, FaHandsHelping } from "react-icons/fa";
import SchemeCard from "./SchemeCard.jsx";

const CATEGORY_META = {
  farmer: { label: "As a Farmer", icon: <FaTractor /> },
  disabled: { label: "As a Person with a Disability", icon: <FaWheelchair /> },
  widow: { label: "Widow Support", icon: <FaFemale /> },
  woman: { label: "For Women", icon: <FaFemale /> },
  "low-income": { label: "Low-Income Support", icon: <FaHandsHelping /> },
  health: { label: "Healthcare", icon: <FaHeartbeat /> },
  student: { label: "Education", icon: <FaUserGraduate /> },
  entrepreneur: { label: "Business & Entrepreneurship", icon: <FaBriefcase /> }
};

export default function CategorySection({ category, schemes, onSelectScheme, startRank }) {
  const meta = CATEGORY_META[category] || { label: category, icon: <FaHandsHelping /> };

  return (
    <div>
      <div className="category-heading">
        {meta.icon}
        <h3 style={{ margin: 0 }}>{meta.label}</h3>
      </div>
      {schemes.map((scheme, i) => (
        <SchemeCard
          key={scheme._id + category}
          scheme={scheme}
          rank={startRank + i}
          onClick={onSelectScheme}
        />
      ))}
    </div>
  );
}
