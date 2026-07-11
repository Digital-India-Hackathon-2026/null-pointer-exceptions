const BASE = "/api";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAllSchemes() {
  const res = await fetch(`${BASE}/schemes`);
  if (!res.ok) throw new Error("Could not fetch schemes");
  return res.json();
}

export async function signup(email, password) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json()).error || "Signup failed");
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json()).error || "Login failed");
  return res.json();
}

export async function getProfiles(token) {
  const res = await fetch(`${BASE}/profile`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Could not load profiles");
  return res.json();
}

export async function saveProfile(token, profile) {
  const res = await fetch(`${BASE}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error("Could not save profile");
  return res.json();
}

export async function updateProfile(token, profileId, profile) {
  const res = await fetch(`${BASE}/profile/${profileId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error("Could not update profile");
  return res.json();
}

export async function deleteProfile(token, profileId) {
  const res = await fetch(`${BASE}/profile/${profileId}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Could not delete profile");
  return res.json();
}

export async function matchSchemes(profile) {
  const res = await fetch(`${BASE}/schemes/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error("Could not fetch matching schemes");
  return res.json();
}

export async function getSchemeById(id) {
  const res = await fetch(`${BASE}/schemes/${id}`);
  if (!res.ok) throw new Error("Could not fetch scheme details");
  return res.json();
}

export async function sendChatMessage(message, profile, history, lang) {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, profile, history, lang })
  });
  if (!res.ok) throw new Error("Could not send chat query");
  return res.json();
}