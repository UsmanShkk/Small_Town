const Meal = require('../models/meals');

const createMeal = async (req, res) => {
  try {
    const {
      name, description, price, nutrition, allergens, tags
    } = req.body;

    const imageUrl = req.file ? req.file.location : '';

    const meal = new Meal({
      name,
      description,
      imageUrl,
      price,
      nutrition,
      allergens,
      tags,
      vendorId: req.vendor._id,
    });

    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    console.error('Meal creation failed:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getMeals = async (req, res) => {
    try {
      const meals = await Meal.find({ vendorId: req.vendor._id });
      res.status(200).json(meals);
    } catch (error) {
      console.error('Get meals failed:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

const getAllMeals = async (req, res) => {
  try{
    const meals = await Meal.find().populate('vendorId', 'name');
    res.status(200).json(meals);
  } catch (err) {
    console.log('error : ', err)
    res.status(500).json({ message: 'Server error' });
  }
};


const getMealById = async (req, res) => {
    try {
      const meal = await Meal.findOne({ _id: req.params.id, vendorId: req.vendor._id });
  
      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }
  
      res.status(200).json(meal);
    } catch (error) {
      console.error('Get meal by ID failed:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  const updateMeal = async (req, res) => {
    try {
      const meal = await Meal.findOne({ _id: req.params.id, vendorId: req.vendor._id });
      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }
  
      const updates = req.body;
      if (req.file) {
        updates.imageUrl = req.file.location;
      }
  
      Object.assign(meal, updates);
      await meal.save();
  
      res.status(200).json(meal);
    } catch (error) {
      console.error('Update meal failed:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
const deleteMeal = async (req, res) => {
    try {
      const deletedMeal = await Meal.findOneAndDelete({
        _id: req.params.id,
        vendorId: req.vendor._id
      });
  
      if (!deletedMeal) {
        return res.status(404).json({ message: 'Meal not found or not authorized' });
      }
  
      res.status(200).json({ message: 'Meal deleted successfully' });
    } catch (error) {
      console.error('Delete meal failed:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
    
  module.exports = {
    createMeal,
    getMeals,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal
  };
  
