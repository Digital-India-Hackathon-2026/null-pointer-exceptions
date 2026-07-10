import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import AuthForm from "./components/AuthForm.jsx";
import ProfileSelector from "./components/ProfileSelector.jsx";
import ProfileForm from "./components/ProfileForm.jsx";
import ResultsPage from "./components/ResultsPage.jsx";
import { getProfiles, saveProfile, matchSchemes } from "./api.js";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [profiles, setProfiles] = useState([]);
  const [view, setView] = useState("select"); // "select" | "form" | "results"
  const [formTargetIsSelf, setFormTargetIsSelf] = useState(true);
  const [activeProfile, setActiveProfile] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) loadProfiles();
  }, [token]);

  async function loadProfiles() {
    try {
      const data = await getProfiles(token);
      setProfiles(data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleAuthSuccess(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setProfiles([]);
    setView("select");
  }

  function handleAddNew(isSelf) {
    setFormTargetIsSelf(isSelf);
    setView("form");
  }

  async function handleProfileSubmit(formData) {
    setLoading(true);
    try {
      // Save profile so it's available next time (skip re-entry problem)
      const saved = await saveProfile(token, { ...formData, isSelf: formTargetIsSelf });
      await loadProfiles();
      await runMatch(saved);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function runMatch(profile) {
    setLoading(true);
    try {
      const result = await matchSchemes(profile);
      setMatchResult(result);
      setActiveProfile(profile);
      setView("results");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectProfile(profile) {
    runMatch(profile);
  }

  return (
    <div className="app-shell">
      <Navbar isLoggedIn={!!token} onLogout={handleLogout} />

      {!token && <AuthForm onAuthSuccess={handleAuthSuccess} />}

      {token && view === "select" && (
        <ProfileSelector profiles={profiles} onSelect={handleSelectProfile} onAddNew={handleAddNew} />
      )}

      {token && view === "form" && (
        <ProfileForm
          isSelf={formTargetIsSelf}
          onSubmit={handleProfileSubmit}
          onCancel={() => setView("select")}
        />
      )}

      {token && view === "results" && (
        <ResultsPage
          result={matchResult}
          profileLabel={activeProfile?.label}
          onBack={() => setView("select")}
        />
      )}

      {loading && <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</p>}
    </div>
  );
}
