import React from "react";
import { FaUser, FaUserFriends, FaPlus, FaChevronRight } from "react-icons/fa";
import { Button } from "./ui/button";

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
        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 rounded-xl mb-4 flex items-center justify-center gap-1.5 font-semibold text-sm" onClick={() => onAddNew(true)}>
          <FaPlus size={12} /> Set Up My Profile
        </Button>
      )}

      <h3 style={{ marginTop: 22 }} className="section-title"><FaUserFriends /> Checking for a Friend or Family Member</h3>
      {friends.map(f => (
        <div className="profile-chip" key={f._id} onClick={() => onSelect(f)}>
          <div>{f.label}</div>
          <FaChevronRight color="#9ca3af" />
        </div>
      ))}
      <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 h-11 rounded-xl mt-3 flex items-center justify-center gap-1.5 font-semibold text-sm" onClick={() => onAddNew(false)}>
        <FaPlus size={12} /> Add Someone Else
      </Button>
    </div>
  );
}
