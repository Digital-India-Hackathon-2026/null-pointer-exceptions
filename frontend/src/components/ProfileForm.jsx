import React, { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Button } from "./ui/button";

const STATES = ["Andhra Pradesh", "Telangana", "Maharashtra", "Tamil Nadu", "Karnataka", "Uttar Pradesh", "West Bengal", "Bihar", "Rajasthan", "Gujarat", "Other"];

export default function ProfileForm({ isSelf, initialData, isEditing, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || {
    label: isSelf ? "Myself" : "",
    age: "",
    gender: "male",
    state: "",
    occupation: "student",
    maritalStatus: "single",
    socialCategory: "General",
    hasDisability: "not_sure",
    income: "",
    incomeUnknown: false
  });

  useEffect(() => {
    setForm(initialData || {
      label: isSelf ? "Myself" : "",
      age: "",
      gender: "male",
      state: "",
      occupation: "student",
      maritalStatus: "single",
      socialCategory: "General",
      hasDisability: "not_sure",
      income: "",
      incomeUnknown: false
    });
  }, [initialData, isSelf]);

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="card">
      <h2>{isEditing ? "Edit Profile" : isSelf ? "Tell us about yourself" : "Tell us about them"}</h2>
      <p style={{ color: "var(--ink-muted)", marginTop: -8, fontSize: "0.9rem" }}>
        {isEditing
          ? "Update any detail below — for example, a birthday that just passed."
          : "Don't know an exact figure? Just tick \"Not Sure\" — we'll still show possible matches."}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {!isSelf && (
            <div className="field-group">
              <label>Their Name / Nickname</label>
              <input value={form.label} onChange={e => update("label", e.target.value)} required placeholder="e.g. Amma, Ramesh" />
            </div>
          )}

          <div className="field-group">
            <label>Age</label>
            <input
              type="text"
              value={form.age}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "");
                update("age", val);
              }}
              required
              placeholder="e.g. 25"
            />
          </div>

          <div className="field-group">
            <label>Gender</label>
            <select value={form.gender} onChange={e => update("gender", e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="field-group">
            <label>State</label>
            <select value={form.state} onChange={e => update("state", e.target.value)} required>
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="field-group">
            <label>Occupation</label>
            <select value={form.occupation} onChange={e => update("occupation", e.target.value)}>
              <option value="student">Student</option>
              <option value="farmer">Farmer</option>
              <option value="employee">Employee / Salaried</option>
              <option value="women">Homemaker</option>
              <option value="senior">Retired</option>
              <option value="entrepreneur">Entrepreneur / Business</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="field-group">
            <label>Marital Status</label>
            <select value={form.maritalStatus} onChange={e => update("maritalStatus", e.target.value)}>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widow">Widow / Widower</option>
              <option value="divorced">Divorced</option>
            </select>
          </div>

          <div className="field-group">
            <label>Social Category</label>
            <select value={form.socialCategory} onChange={e => update("socialCategory", e.target.value)}>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="field-group">
            <div className="flex justify-between items-center mb-1">
              <label className="mb-0">Annual Income (₹)</label>
              {!form.incomeUnknown && (
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-xs select-none">
                  ₹{Number(form.income || 0).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <input
              type="range"
              min="0"
              max="1500000"
              step="10000"
              value={form.incomeUnknown ? 0 : (form.income || 0)}
              onChange={e => update("income", e.target.value)}
              disabled={form.incomeUnknown}
              className="premium-slider"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 select-none">
              <span>₹0</span>
              <span>₹5L</span>
              <span>₹10L</span>
              <span>₹15L+</span>
            </div>
            <div className="not-sure-row mt-3">
              <input
                type="checkbox"
                id="incomeUnknown"
                checked={form.incomeUnknown}
                onChange={e => update("incomeUnknown", e.target.checked)}
              />
              <label htmlFor="incomeUnknown" style={{ marginBottom: 0, fontWeight: 400 }}>
                <FaQuestionCircle style={{ marginRight: 4 }} />Not Sure of exact income
              </label>
            </div>
          </div>

          <div className="field-group">
            <label>Do you have a disability?</label>
            <select value={form.hasDisability} onChange={e => update("hasDisability", e.target.value)}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
              <option value="not_sure">Not Sure / Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="link-btn-row mt-6 flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 h-11 rounded-xl font-medium"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white h-11 rounded-xl font-semibold shadow-sm"
          >
            {isEditing ? "Save Changes" : "Check Eligible Schemes"}
          </Button>
        </div>
      </form>
    </div>
  );
}