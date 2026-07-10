import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { signup, login } from "../api.js";
import { Button } from "./ui/button";

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fn = mode === "login" ? login : signup;
      const { token, userId } = await fn(email, password);
      onAuthSuccess(token, userId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card auth-card">
      <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
      <p style={{ color: "var(--ink-muted)", marginTop: -8, fontSize: "0.9rem" }}>
        Save your details once, check your eligible schemes anytime.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label><FaEnvelope style={{ marginRight: 6 }} />Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
        </div>
        <div className="field-group">
          <label><FaLock style={{ marginRight: 6 }} />Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" minLength={6} />
        </div>

        {error && <div className="error-text">{error}</div>}

        <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold h-11 rounded-xl shadow-sm text-sm" type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
        </Button>
      </form>

      <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.9rem" }}>
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <button className="btn-link" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
}