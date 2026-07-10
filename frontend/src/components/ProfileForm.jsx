import React, { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";

const STATES = ["Andhra Pradesh", "Telangana", "Maharashtra", "Tamil Nadu", "Karnataka", "Uttar Pradesh", "West Bengal", "Bihar", "Rajasthan", "Gujarat", "Other"];

export default function ProfileForm({ isSelf, initialData, isEditing, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || {
    label: isSelf ? "Myself" : "",
    age: "",
    gender: "male",
    state: "",
    occupation: "farmer",
    maritalStatus: "single",
    socialCategory: "general",
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
      occupation: "farmer",
      maritalStatus: "single",
      socialCategory: "general",
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
            <input type="number" value={form.age} onChange={e => update("age", e.target.value)} required min="0" max="120" />
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
              <option value="farmer">Farmer</option>
              <option value="student">Student</option>
              <option value="business">Business / Entrepreneur</option>
              <option value="salaried">Salaried</option>
              <option value="unemployed">Unemployed</option>
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
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="field-group">
            <label>Annual Income (₹)</label>
            <input
              type="number"
              value={form.income}
              onChange={e => update("income", e.target.value)}
              disabled={form.incomeUnknown}
              placeholder="e.g. 150000"
            />
            <div className="not-sure-row">
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

        <div className="link-btn-row">
          {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel} style={{ flex: 1 }}>Cancel</button>}
          <button className="btn btn-primary" type="submit" style={{ flex: 2 }}>
            {isEditing ? "Save Changes" : "Check Eligible Schemes"}
          </button>
        </div>
      </form>
    </div>
  );
}