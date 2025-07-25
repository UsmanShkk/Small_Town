// models/Meal.js

const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,

  price: {
    type: Number,
    required: true,
  },

  imageUrl: String, // Optional: stored on S3 maybe

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },

  tags: [String], // like ['vegan', 'gluten-free', 'low-calorie']

  nutrition: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number,
  },

  isAvailable: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meal', mealSchema);
