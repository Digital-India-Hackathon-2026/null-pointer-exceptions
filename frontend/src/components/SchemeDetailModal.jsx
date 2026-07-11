import React from "react";
import { FaTimes, FaFileAlt, FaListOl, FaExternalLinkAlt, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "./ui/button";

export default function SchemeDetailModal({ scheme, onClose }) {
  if (!scheme) return null;

  const title = scheme.name || scheme.title || "";
  const source = scheme.source || scheme.ministry || scheme.provider || "";
  const providerType = scheme.providerType || (scheme.type === "govt" ? "government" : scheme.type === "private" ? "private" : "government");
  const isGovernment = providerType === "government";

  const benefit = scheme.benefitDescription || scheme.benefit || "";
  const docs = scheme.documentsRequired || scheme.documents || [];
  const steps = scheme.applicationSteps || scheme.benefits || [];
  const url = scheme.applyUrl || scheme.applyLink || "";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FaTimes /></button>
        <h2>{title}</h2>
        <p style={{ color: "var(--ink-muted)", marginTop: -8 }}>{source} • {isGovernment ? "Government Scheme" : "Private Scheme"}</p>

        {scheme.matchTier === "possible" && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: 12, borderRadius: 10, marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <FaExclamationTriangle style={{ marginTop: 3, flexShrink: 0 }} />
            <span>Some of your details were marked "Not Sure" — please verify your income or disability status matches this scheme's requirements before applying.</span>
          </div>
        )}

        <p>{scheme.description}</p>

        <p><strong>Benefit:</strong> {benefit}</p>
        {scheme.deadline && <p><strong>Deadline:</strong> {typeof scheme.deadline === "string" ? scheme.deadline : new Date(scheme.deadline).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>}
        <p><strong>Apply Mode:</strong> {scheme.applyMode ? (scheme.applyMode === "both" ? "Online or Offline" : scheme.applyMode.charAt(0).toUpperCase() + scheme.applyMode.slice(1)) : "Online"}</p>

        <h3 className="section-title"><FaFileAlt /> Documents Required</h3>
        <ul className="doc-list">
          {docs.length > 0 ? (
            docs.map((doc, i) => <li key={i}>{doc}</li>)
          ) : (
            <li>No specific documents listed. Aadhaar Card/ID proof generally required.</li>
          )}
        </ul>

        <h3 className="section-title"><FaListOl /> Application Process</h3>
        <ol className="step-list">
          {steps.length > 0 ? (
            steps.map((step, i) => <li key={i}>{step}</li>)
          ) : (
            <li>Apply on the official portal link below.</li>
          )}
        </ol>

        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="block mt-4">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-sm">
              <FaExternalLinkAlt size={13} className="mr-1 mt-0.5" /> Go to Application Page
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
