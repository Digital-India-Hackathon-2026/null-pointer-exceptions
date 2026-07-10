import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  LuLogOut as LogOut,
  LuUser as User,
  LuSparkles as Sparkles,
  LuRefreshCw as RefreshCw
} from "react-icons/lu";
import AuthForm from "../components/AuthForm";
import Dashboard from "../components/Dashboard";
import ProfileSelector from "../components/ProfileSelector";
import ProfileForm from "../components/ProfileForm";
import ResultsPage from "../components/ResultsPage";
import {
  getProfiles,
  saveProfile,
  updateProfile,
  deleteProfile,
  matchSchemes,
  getAllSchemes
} from "../api";
import { getSavedSchemes, toggleSavedScheme, SCHEMES } from "../mock";

export default function Profile() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [profiles, setProfiles] = useState([]);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // View state: 'selector' | 'form' | 'results'
  const [view, setView] = useState("selector");
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isSelf, setIsSelf] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // Load profiles, total schemes count, and saved schemes
  useEffect(() => {
    if (token) {
      fetchProfiles();
      fetchTotalSchemes();
      fetchSavedSchemes();
    }
  }, [token]);

  async function fetchProfiles() {
    try {
      setLoading(true);
      const data = await getProfiles(token);
      setProfiles(data);
    } catch (err) {
      toast.error("Failed to load profiles");
      if (err.message.toLowerCase().includes("token") || err.message.toLowerCase().includes("auth") || err.message.toLowerCase().includes("log")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchTotalSchemes() {
    try {
      const schemes = await getAllSchemes();
      setTotalSchemes(schemes.length);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchSavedSchemes() {
    const savedIds = getSavedSchemes();
    let list = SCHEMES.filter(s => savedIds.includes(s.id));

    try {
      const dbSchemes = await getAllSchemes();
      const mappedDb = dbSchemes
        .filter(s => savedIds.includes(s._id))
        .map(s => ({
          id: s._id,
          title: s.name,
          ministry: s.source,
          provider: s.source,
          benefit: s.benefitDescription || `₹${s.benefitAmount?.toLocaleString('en-IN')}`,
          isPrivate: s.providerType === 'private',
          description: s.description || ''
        }));

      const combined = [...list];
      mappedDb.forEach(dbS => {
        if (!combined.some(item => item.id === dbS.id)) {
          combined.push(dbS);
        }
      });
      list = combined;
    } catch (err) {
      console.error("Failed to sync database saved schemes:", err);
    }

    setSavedSchemes(list);
  }

  function handleUnsaveScheme(schemeId) {
    toggleSavedScheme(schemeId);
    fetchSavedSchemes();
    toast.success("Scheme unsaved");
  }

  function handleAuthSuccess(newToken, newUserId) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserId(newUserId);
    toast.success("Logged in successfully");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken("");
    setUserId("");
    setProfiles([]);
    setSavedSchemes([]);
    setView("selector");
    setCurrentProfile(null);
    setMatchResult(null);
    setLastResult(null);
    toast.success("Logged out successfully");
  }

  async function handleSelectProfile(profile) {
    try {
      setLoading(true);
      const result = await matchSchemes(profile);
      setMatchResult(result);
      setLastResult(result);
      setCurrentProfile(profile);
      setView("results");
    } catch (err) {
      toast.error("Failed matching schemes: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAddNewProfile(self) {
    setIsSelf(self);
    setEditingProfile(null);
    setView("form");
  }

  function handleEditProfile(profile) {
    setIsSelf(profile.isSelf);
    setEditingProfile(profile);
    setView("form");
  }

  async function handleDeleteProfile(profileId) {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      setLoading(true);
      await deleteProfile(token, profileId);
      toast.success("Profile deleted");
      await fetchProfiles();
      setView("selector");
      setCurrentProfile(null);
      setMatchResult(null);
    } catch (err) {
      toast.error("Failed to delete profile: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(formData) {
    try {
      setLoading(true);
      if (editingProfile) {
        await updateProfile(token, editingProfile._id, formData);
        toast.success("Profile updated");
      } else {
        const payload = { ...formData, isSelf };
        await saveProfile(token, payload);
        toast.success("Profile saved");
      }
      await fetchProfiles();
      setView("selector");
    } catch (err) {
      toast.error("Failed to save profile: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 flex flex-col items-center">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 grid place-items-center mb-6 shadow-md shadow-emerald-500/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Profile Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage profiles and check eligibility for your household.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
            <span className="text-sm font-medium text-slate-600">Syncing with server...</span>
          </div>
        </div>
      )}

      <div className="mb-8">
        <Dashboard
          totalSchemes={totalSchemes}
          profileCount={profiles.length}
          lastResult={lastResult}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 border-r border-slate-100 lg:pr-8">
          <ProfileSelector
            profiles={profiles}
            onSelect={handleSelectProfile}
            onAddNew={handleAddNewProfile}
          />
        </div>

        <div className="lg:col-span-2">
          {view === "selector" && (
            <div className="flex flex-col gap-8">
              <div className="min-h-[220px] border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
                <div className="h-12 w-12 rounded-full bg-slate-100 grid place-items-center text-slate-400 mb-4">
                  <User size={20} />
                </div>
                <h3 className="text-base font-semibold text-slate-950">No Profile Selected</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  Select a profile from the sidebar to check scheme eligibility, or add a new family member.
                </p>
              </div>

              <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500 fill-amber-500" /> Saved Programs ({savedSchemes.length})
                </h3>
                {savedSchemes.length === 0 ? (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    You haven't bookmarked any schemes yet. Go to{" "}
                    <Link to="/schemes" className="text-emerald-600 font-semibold hover:underline">
                      Browse Schemes
                    </Link>{" "}
                    to save policies and scholarships of interest.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {savedSchemes.map(s => (
                      <div key={s.id || s._id} className="py-4 flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{s.title || s.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">{s.ministry || s.provider || s.source}</p>
                          <p className="text-xs text-emerald-700 font-medium mt-1">{s.benefit || s.benefitDescription}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            to={`/schemes/${s.id || s._id}`}
                            className="px-3 py-1.5 border border-slate-205 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-350 transition-all"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleUnsaveScheme(s.id || s._id)}
                            className="p-1.5 border border-slate-201 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-650 hover:bg-red-50 hover:border-red-200 transition-all"
                            title="Remove from saved"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {view === "form" && (
            <div className="fade-up">
              <ProfileForm
                isSelf={isSelf}
                initialData={editingProfile}
                isEditing={!!editingProfile}
                onSubmit={handleFormSubmit}
                onCancel={() => setView("selector")}
              />
            </div>
          )}

          {view === "results" && (
            <div className="fade-up">
              <div className="flex items-center justify-between mb-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <span className="text-sm font-medium text-slate-700">Options for {currentProfile?.label}:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProfile(currentProfile)}
                    className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => handleDeleteProfile(currentProfile._id)}
                    className="px-3.5 py-1.5 border border-red-200 rounded-xl text-xs font-semibold text-red-600 bg-white hover:bg-red-50 transition-colors"
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
              <ResultsPage
                result={matchResult}
                profileLabel={currentProfile?.label || ""}
                onBack={() => setView("selector")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}