const express = require("express");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Get all profiles for logged-in user
router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user.profiles);
});

// Add a new profile (self, on first onboarding, or a friend)
router.post("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.profiles.push(req.body);
  await user.save();
  res.json(user.profiles[user.profiles.length - 1]);
});

// Update an existing profile
router.put("/:profileId", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const profile = user.profiles.id(req.params.profileId);
  if (!profile) return res.status(404).json({ error: "Profile not found" });

  Object.assign(profile, req.body);
  await user.save();
  res.json(profile);
});

// Delete a profile (e.g. remove a friend entry)
router.delete("/:profileId", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.profiles.id(req.params.profileId).deleteOne();
  await user.save();
  res.json({ success: true });
});

module.exports = router;
