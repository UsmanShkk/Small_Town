const mongoose = require('mongoose');
const vendor = require('./vendor')

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },

 
  nutrition: {
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
    },
    carbohydrates: {
      type: Number,
      required: true,
      min: 0,
    },
    fat: {
      type: Number,
      required: true,
      min: 0,
    },
  },


  allergens: {
    type: [String], // e.g., ["nuts", "gluten", "dairy"]
    default: [],
  },

  tags: {
    type: [String],
    default: [],
  },

  
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: vendor,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
