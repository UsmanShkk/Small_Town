// routes/preferences.js
const express = require("express");
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const UserPreferences = require('../models/userpreferences');

const router = express.Router();

// Save or update preferences for logged-in user
router.post("/update/prefer", protect, authorizeRoles('Customer'), async (req, res) => {
  const updated = await UserPreferences.findOneAndUpdate(
    { userId: req.user.id }, // from token
    { $set: req.body },
    { new: true, upsert: true }
  );
  res.json({ success: true, preferences: updated });
});

// Get preferences for logged-in user
router.get("/get/prefer", protect, authorizeRoles('Customer'), async (req, res) => {
  const preferences = await UserPreferences.findOne({ userId: req.user.id });
  res.json({ success: true, preferences });
});

module.exports = router; // ✅ export router only
