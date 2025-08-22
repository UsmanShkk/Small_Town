// models/UserPreferences.js
const mongoose = require('mongoose');

const UserPreferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Link to your user system
  goal: String,
  calories_per_day: Number,
  macro_ratio: {
    protein: Number,
    carbs: Number,
    fat: Number
  },
  restrictions: [String],
  age: Number,
  gender: String,
  weight_kg: Number,
  height_cm: Number,
  activity_level: String
}, { timestamps: true });

module.exports = mongoose.model('UserPreferences', UserPreferencesSchema);