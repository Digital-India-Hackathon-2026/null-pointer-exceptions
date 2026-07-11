import React from "react";
import { FaCoins, FaBolt, FaClock, FaExclamationTriangle, FaLandmark, FaBuilding, FaStar } from "react-icons/fa";

function formatMoney(amount) {
  if (!amount) return "Non-monetary benefit";
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function SchemeCard({ scheme, rank, accentColor, onClick }) {
  const { matchInsights, matchTier } = scheme;
  const isTopRank = rank === 1;

  return (
    <div
      className="scheme-card"
      style={{ borderLeftColor: accentColor }}
      onClick={() => onClick(scheme)}
    >
      <div className="scheme-card-top">
        <div>
          <div className="scheme-name">{scheme.name}</div>
          <div className="scheme-source">{scheme.source}</div>
        </div>
        {isTopRank ? (
          <span className="priority-seal"><FaStar size={10} /> DO THIS FIRST</span>
        ) : (
          <span className="rank-pill">#{rank}</span>
        )}
      </div>

      <div className="badge-row">
        <span className={`badge ${scheme.providerType === "government" ? "badge-govt" : "badge-private"}`}>
          {scheme.providerType === "government" ? <FaLandmark /> : <FaBuilding />}
          {scheme.providerType === "government" ? "Govt" : "Private"}
        </span>
        <span className="badge badge-value"><FaCoins /> {formatMoney(scheme.benefitAmount)}</span>
        {matchInsights.easeScore >= 60 && <span className="badge badge-ease"><FaBolt /> Easy to Apply</span>}
        {matchInsights.daysUntilDeadline !== null && matchInsights.daysUntilDeadline <= 30 && matchInsights.daysUntilDeadline >= 0 && (
          <span className="badge badge-urgent"><FaClock /> {matchInsights.daysUntilDeadline}d left</span>
        )}
        {matchTier === "possible" && (
          <span className="badge badge-possible"><FaExclamationTriangle /> Confirm Eligibility</span>
        )}
      </div>
    </div>
  );
}
