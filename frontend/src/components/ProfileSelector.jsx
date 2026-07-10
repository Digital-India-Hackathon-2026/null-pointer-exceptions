import React from "react";
import { FaUser, FaUserFriends, FaPlus, FaChevronRight } from "react-icons/fa";

export default function ProfileSelector({ profiles, onSelect, onAddNew }) {
  const self = profiles.find(p => p.isSelf);
  const friends = profiles.filter(p => !p.isSelf);

  return (
    <div className="card">
      <h2 className="section-title"><FaUser /> Check Eligibility</h2>

      {self ? (
        <div className="profile-chip" onClick={() => onSelect(self)}>
          <div><strong>{self.label}</strong> <span style={{ color: "var(--ink-muted)" }}>(You)</span></div>
          <FaChevronRight color="#9ca3af" />
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => onAddNew(true)} style={{ marginBottom: 10 }}>
          <FaPlus /> Set Up My Profile
        </button>
      )}

      <h3 style={{ marginTop: 22 }} className="section-title"><FaUserFriends /> Checking for a Friend or Family Member</h3>
      {friends.map(f => (
        <div className="profile-chip" key={f._id} onClick={() => onSelect(f)}>
          <div>{f.label}</div>
          <FaChevronRight color="#9ca3af" />
        </div>
      ))}
      <button className="btn btn-outline" onClick={() => onAddNew(false)} style={{ width: "100%", marginTop: 6 }}>
        <FaPlus /> Add Someone Else
      </button>
    </div>
  );
}










