const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  mealType: String,     // Breakfast, Lunch, Dinner
  name: String,         // e.g. "Grilled Chicken Salad"
  description: String,
  calories: String,
  protein: String,
  carbs: String,
  fat: String,
  tags: [String],
  mealId: String
});

const daySchema = new mongoose.Schema({
  day: Number,          // 1 → 7
  meals: [mealSchema]   // 3 meals in a day
});

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plans: [daySchema],   // 7 days data
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MealPlan", mealPlanSchema);
