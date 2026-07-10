const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");
const { matchAndRank } = require("../utils/ranking");

// GET all schemes (for browsing / admin)
router.get("/", async (req, res) => {
  const schemes = await Scheme.find();
  res.json(schemes);
});

// POST /api/schemes/match — core matching endpoint. Works for a "self" or "friend" profile.
router.post("/match", async (req, res) => {
  try {
    const p = req.body;

    const required = ["age", "gender", "occupation"];
    for (const field of required) {
      if (p[field] === undefined || p[field] === null || p[field] === "") {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const profile = {
      age: Number(p.age),
      gender: p.gender,
      occupation: p.occupation,
      maritalStatus: p.maritalStatus || "",
      state: p.state || "",
      socialCategory: p.socialCategory || "",
      hasDisability: p.hasDisability || "not_sure", // "yes" | "no" | "not_sure"
      income: p.incomeUnknown ? null : (p.income !== undefined && p.income !== "" ? Number(p.income) : null),
      incomeUnknown: !!p.incomeUnknown
    };

    const allSchemes = await Scheme.find();
    const ranked = matchAndRank(allSchemes, profile);

    res.json({
      totalMatches: ranked.length,
      confirmedCount: ranked.filter(s => s.matchTier === "confirmed").length,
      possibleCount: ranked.filter(s => s.matchTier === "possible").length,
      schemes: ranked
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong while matching schemes." });
  }
});

module.exports = router;
