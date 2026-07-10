import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import CategorySection from "./CategorySection.jsx";
import SchemeDetailModal from "./SchemeDetailModal.jsx";

export default function ResultsPage({ result, profileLabel, onBack }) {
  const [selectedScheme, setSelectedScheme] = useState(null);

  if (!result || result.schemes.length === 0) {
    return (
      <div className="card empty-state">
        <p>No matching schemes found for {profileLabel}. Try adjusting the details.</p>
        <button className="btn btn-outline" onClick={onBack}><FaArrowLeft /> Go Back</button>
      </div>
    );
  }

  // Group schemes by their first category for display; a scheme can repeat under
  // multiple categories if it belongs to more than one.
  const grouped = {};
  result.schemes.forEach(scheme => {
    (scheme.categories || ["general"]).forEach(cat => {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(scheme);
    });
  });

  let runningRank = 1;

  return (
    <div>
      <button className="btn-link" onClick={onBack} style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <FaArrowLeft /> Back
      </button>

      <div className="card">
        <h2>Results for {profileLabel}</h2>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          {result.confirmedCount} confirmed match{result.confirmedCount !== 1 ? "es" : ""}
          {result.possibleCount > 0 && `, ${result.possibleCount} possible match${result.possibleCount !== 1 ? "es" : ""} pending verification`}
        </p>
      </div>

      {Object.entries(grouped).map(([category, schemes]) => {
        const startRank = runningRank;
        runningRank += schemes.length;
        return (
          <CategorySection
            key={category}
            category={category}
            schemes={schemes}
            startRank={startRank}
            onSelectScheme={setSelectedScheme}
          />
        );
      })}

      <SchemeDetailModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />
    </div>
  );
}
