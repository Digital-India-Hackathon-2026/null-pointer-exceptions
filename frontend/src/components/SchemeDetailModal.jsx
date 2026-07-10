import React from "react";
import { FaTimes, FaFileAlt, FaListOl, FaExternalLinkAlt, FaExclamationTriangle } from "react-icons/fa";

export default function SchemeDetailModal({ scheme, onClose }) {
  if (!scheme) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FaTimes /></button>
        <h2>{scheme.name}</h2>
        <p style={{ color: "var(--ink-muted)", marginTop: -8 }}>{scheme.source} • {scheme.providerType === "government" ? "Government Scheme" : "Private Scheme"}</p>

        {scheme.matchTier === "possible" && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: 12, borderRadius: 10, marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <FaExclamationTriangle style={{ marginTop: 3, flexShrink: 0 }} />
            <span>Some of your details were marked "Not Sure" — please verify your income or disability status matches this scheme's requirements before applying.</span>
          </div>
        )}

        <p>{scheme.description}</p>

        <p><strong>Benefit:</strong> {scheme.benefitDescription}</p>
        {scheme.deadline && <p><strong>Deadline:</strong> {new Date(scheme.deadline).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>}
        <p><strong>Apply Mode:</strong> {scheme.applyMode === "both" ? "Online or Offline" : scheme.applyMode.charAt(0).toUpperCase() + scheme.applyMode.slice(1)}</p>

        <h3 className="section-title"><FaFileAlt /> Documents Required</h3>
        <ul className="doc-list">
          {scheme.documentsRequired?.map((doc, i) => <li key={i}>{doc}</li>)}
        </ul>

        <h3 className="section-title"><FaListOl /> Application Process</h3>
        <ol className="step-list">
          {scheme.applicationSteps?.map((step, i) => <li key={i}>{step}</li>)}
        </ol>

        {scheme.applyUrl && (
          <a href={scheme.applyUrl} target="_blank" rel="noreferrer">
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
              <FaExternalLinkAlt /> Go to Application Page
            </button>
          </a>
        )}
      </div>
    </div>
  );
}
