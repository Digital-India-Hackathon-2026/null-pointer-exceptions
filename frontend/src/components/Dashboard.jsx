import React from "react";
import { FaListAlt, FaUsers, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function Dashboard({ totalSchemes, profileCount, lastResult }) {
  return (
    <div className="dashboard-grid">
      <div className="stat-card">
        <div className="stat-icon-wrap navy"><FaListAlt /></div>
        <div>
          <span className="stat-num">{totalSchemes !== null ? `${totalSchemes}+` : "—"}</span>
          <span className="stat-label">Total Schemes Available</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap saffron"><FaUsers /></div>
        <div>
          <span className="stat-num">{profileCount}</span>
          <span className="stat-label">Saved Profiles</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap banyan"><FaCheckCircle /></div>
        <div>
          <span className="stat-num">{lastResult ? lastResult.confirmedCount : "—"}</span>
          <span className="stat-label">Confirmed Matches, Last Check</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap brick"><FaExclamationCircle /></div>
        <div>
          <span className="stat-num">{lastResult ? lastResult.possibleCount : "—"}</span>
          <span className="stat-label">Need Verification, Last Check</span>
        </div>
      </div>
    </div>
  );
}